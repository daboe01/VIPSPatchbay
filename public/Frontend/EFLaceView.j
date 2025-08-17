//
//  EFLaceView.j
//  created by daniel boehringer on 29/DEC/2023
//  cappuccino port of
//  EFLaceView.m
//  all changes copyright by daniel boehringer
//  todo
//  - draw title more nicely
//  - add undo-redo using [_window undoManager] prepareWithInvocationTarget
//
//  original copyright notice
//  EFLaceView
//
//  Created by MacBook Pro ef on 01/08/06.
//  Copyright 2006 Edouard FISCHER. All rights reserved.
//  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//
//    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//    - Neither the name of Edouard FISCHER nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

@class EFView;

@implementation CPObject(KVCAddition)

- (id)mutableSetValueForKey:(CPString)someKey
{
    var proxyArray = [self valueForKey:someKey];

    if (!proxyArray)
    {
        [self setValue:@[] forKey:someKey];
    }
    
    return [self valueForKey:someKey];
}
@end

// fixme: need to implement delegate methods
/*
@interface CPObject (EFLaceViewDelegateMethod)
- (void)laceView:(EFLaceView)aView didConnectHole:(id)startHole toHole:(id)endHole;
- (void)laceView:(EFLaceView)aView didUnconnectHole:(id)startHole fromHole:(id)endHole;
- (void)laceView:(EFLaceView)aView showTooltipForHole:(id)aHole;
@end
*/

@implementation EFLaceView : CPView
{
    id               _dataObjectsContainer;
    CPString         _dataObjectsKeyPath;
    id               _selectionIndexesContainer;
    CPString         _selectionIndexesKeyPath;

    CPArray          _oldDataObjects;

    BOOL             _isMaking;

    CGPoint          _startPoint;
    CGPoint          _endPoint;
    CGPoint          _rubberStart;
    CGPoint          _rubberEnd;
    BOOL             _isRubbing;

    id               _startHole;
    id               _endHole;

    EFView           _startSubView;
    EFView           _endSubView;

    id               _delegate;
}

var _propertyObservationContext = 1091;
var _dataObjectsObservationContext = 1092;
var _selectionIndexesObservationContext = 1093;

function treshold(x, tr)
{
    return (x > 0) ? ((x > tr) ? x : tr) : -x + tr;
}

+ (void)initialize
{
    [self exposeBinding:"dataObjects"];
    [self exposeBinding:"selectionIndexes"];
}

- (CPArray)exposedBindings
{
    [CPArray arrayWithObjects:"dataObjects", "selectedObjects", nil];
}

+ (CPSet)keyPathsForValuesAffectingLaces
{
    return [CPSet setWithObjects:"dataObjects", nil];
}

- (void)bind:(CPString)bindingName toObject:(id)observableObject withKeyPath:(CPString)observableKeyPath options:(CPDictionary)options
{
    if ([bindingName isEqualToString:@"dataObjects"])
    {
        _dataObjectsContainer = observableObject;
        _dataObjectsKeyPath = observableKeyPath;
        [_dataObjectsContainer addObserver:self forKeyPath:_dataObjectsKeyPath options:(CPKeyValueObservingOptionNew | CPKeyValueObservingOptionOld) context:_dataObjectsObservationContext];
        [self startObservingDataObjects:[self dataObjects]];
        [self setOldDataObjects:[self dataObjects]];
    }
    else if ([bindingName isEqualToString:@"selectionIndexes"])
    {
        _selectionIndexesContainer = observableObject;
        _selectionIndexesKeyPath = observableKeyPath;
        [_selectionIndexesContainer addObserver:self forKeyPath:_selectionIndexesKeyPath options:0 context:_selectionIndexesObservationContext];
    }
    else
        [super bind:bindingName toObject:observableObject withKeyPath:observableKeyPath options:options];

    [self setNeedsDisplay:YES];
}

- (void)unbind:(CPString)bindingName
{
    if ([bindingName isEqualToString:@"dataObjects"]) {
        [self stopObservingDataObjects:[self dataObjects]];
        [_dataObjectsContainer removeObserver:self forKeyPath:_dataObjectsKeyPath];
        _dataObjectsContainer = nil;
        _dataObjectsKeyPath = nil;
    }
    if ([bindingName isEqualToString:@"selectionIndexes"])
    {
        [_selectionIndexesContainer removeObserver:self forKeyPath:_selectionIndexesKeyPath];
        _selectionIndexesContainer = nil;
        _selectionIndexesKeyPath = nil;
    }
    else
    {
        [super unbind:bindingName];
    }

    [self setNeedsDisplay:YES];
}

- (void)startObservingDataObjects:(CPArray)dataObjects
{
    if ([dataObjects isEqual:[CPNull null]])
        return;

    // Register to observe each of the new dataObjects, and each of their observable properties -- we need old and new values for drawingBounds to figure out what our dirty rect

    var dataObjectsCount = [dataObjects count];

    for (var i = 0;  i < dataObjectsCount; i++)
    {
        var newDataObject =  dataObjects[i];

        [newDataObject addObserver:self forKeyPath:@"drawingBounds" options:(CPKeyValueObservingOptionNew | CPKeyValueObservingOptionOld) context:_propertyObservationContext];
        var myview = [[(dataObjects[i].is_label ? EFLabelView : EFView) alloc] init];
        myview._dataObject = newDataObject;
        [self addSubview:myview];

        [self scrollRectToVisible:[myview bounds]]; //make new view visible if view in scrolling view

        // bind view to data
        [myview bind:@"title" toObject:newDataObject withKeyPath:@"title" options:nil];
        [myview bind:@"titleColor" toObject:newDataObject withKeyPath:@"titleColor" options:nil];
        [myview bind:@"originX" toObject:newDataObject withKeyPath:@"originX" options:nil];
        [myview bind:@"originY" toObject:newDataObject withKeyPath:@"originY" options:nil];
        [myview bind:@"width" toObject:newDataObject withKeyPath:@"width" options:nil];
        [myview bind:@"height" toObject:newDataObject withKeyPath:@"height" options:nil];
        [myview bind:@"tag" toObject:newDataObject withKeyPath:@"tag" options:nil];
        [myview bind:@"verticalOffset" toObject:newDataObject withKeyPath:@"verticalOffset" options:nil];

        [myview bind:@"inputs" toObject:newDataObject withKeyPath:@"inputs" options:nil];
        [myview bind:@"outputs" toObject:newDataObject withKeyPath:@"outputs" options:nil];

        [newDataObject bind:@"originX" toObject:myview withKeyPath:@"originX" options:nil];
        [newDataObject bind:@"originY" toObject:myview withKeyPath:@"originY" options:nil];
        [newDataObject bind:@"width" toObject:myview withKeyPath:@"width" options:nil];
        [newDataObject bind:@"height" toObject:myview withKeyPath:@"height" options:nil];

        [newDataObject bind:@"inputs" toObject:myview withKeyPath:@"inputs" options:nil];
        [newDataObject bind:@"outputs" toObject:myview withKeyPath:@"outputs" options:nil];
        [myview setValue:newDataObject forKeyPath:@"data"];

        if(0){
            var keysArray = [[newDataObject class] keysForNonBoundsProperties];
            var keysCount = [keysArray count];

            for (var j = 0; j < keysCount ; j++)
            {
                var key = keysArray[j]
                //@"tag",@"inputs",@"outputs",@"title",@"titleColor",@"verticalOffset",@"originX",@"originY",@"width",@"height"
                [newDataObject addObserver:self forKeyPath:key options:0 context:_propertyObservationContext];
            }
        }
    }
}

- (void)stopObservingDataObjects:(CPArray)dataObjects
{
    if ([dataObjects isEqual:[CPNull null]])
        return;

    var dataObjectsCount = [dataObjects count];

    for (var i = 0;  i < dataObjectsCount; i++)
    {
        var oldDataObject = dataObjects[i];

        [oldDataObject removeObserver:self forKeyPath:@"drawingBounds"];

        var keysArray = [[oldDataObject class] keysForNonBoundsProperties];
        var keysCount = [keysArray count];

        for (var j = 0; j < keysCount ; j++)
        {
            [oldDataObject removeObserver:self forKeyPath:keysArray[j]];
        }

        [oldDataObject unbind:@"originX"];
        [oldDataObject unbind:@"originY"];
        [oldDataObject unbind:@"width"];
        [oldDataObject unbind:@"heigth"];
        [oldDataObject unbind:@"inputs"];
        [oldDataObject unbind:@"outputs"];

        var svc = [[self subviews] copy];
        var svcCount = [svc count];

        for (var j = 0; j < svcCount ; j++)
        {
            var aView = svc[j];

            if ([aView valueForKey:@"data"] == oldDataObject)
            {
                [aView unbind:@"title"];
                [aView unbind:@"titleColor"];
                [aView unbind:@"originX"];
                [aView unbind:@"originY"];
                [aView unbind:@"width"];
                [aView unbind:@"height"];
                [aView unbind:@"tag"];
                [aView unbind:@"verticalOffset"];

                [aView unbind:@"inputs"];
                [aView unbind:@"outputs"];

                [aView removeFromSuperview];
            }
        }
    }
}

- (void)observeValueForKeyPath:(CPString)keyPath ofObject:(id)object change:(CPDictionary)change context:(id)context
{
    if (context == _dataObjectsObservationContext)
    {
        var _newDataObjects = [object valueForKeyPath:_dataObjectsKeyPath];

        var onlyNew = [_newDataObjects mutableCopy];
        [onlyNew removeObject:[CPNull null]];
        [onlyNew removeObjectsInArray:_oldDataObjects];
        [self startObservingDataObjects:onlyNew];

        var removed = [_oldDataObjects mutableCopy];
        [removed removeObject:[CPNull null]];
        [removed removeObjectsInArray:_newDataObjects];
        [self stopObservingDataObjects:removed];

        [self setOldDataObjects:_newDataObjects];
        [self setNeedsDisplay:YES];
        return;
    }

    if (context == _propertyObservationContext)
    {
        [self setNeedsDisplay:YES];
        return;
    }

    if (context == _selectionIndexesObservationContext)
    {
        [[self subviews] makeObjectsPerformSelector:@selector(setNeedsDisplay:) withObject:YES];
        return;
    }
}


- (id)delegate {
    return _delegate;
}

- (void)setDelegate:(id)newDelegate {
    _delegate = newDelegate;
}

// dataObjects  
- (CPArray)dataObjects
{
    var result = [[_dataObjectsContainer valueForKeyPath:_dataObjectsKeyPath] mutableCopy];
    [result removeObject:[CPNull null]];

    return result;
}

- (CPView)viewForData:(id)data
{
    var sv = [self subviews];
    var svCount = [sv count];

    for (var i = 0; i < svCount; i++)
    {
        var view = sv[i];

        if ([view valueForKey:@"data"] == data)
            return view;
    }

    return nil;
}

- (CPIndexSet)selectionIndexes
{
    return [_selectionIndexesContainer valueForKeyPath:_selectionIndexesKeyPath];
}

- (CPArray)oldDataObjects
{
    return _oldDataObjects;
}

- (void)setOldDataObjects:(CPArray)anOldDataObjects
{
    if (_oldDataObjects != anOldDataObjects)
        _oldDataObjects = [anOldDataObjects mutableCopy];
}

- (CPMutableArray)laces
{
    var _laces = [[CPMutableArray alloc] init];

    var startObjects = [[self dataObjects] objectEnumerator];
    var startObject;

    while ((startObject = [startObjects nextObject]))
    {
        var startHoles = [startObject valueForKey:@"outputs"];

        if ([startHoles count] > 0)
        {
            var startHolesEnum = [startHoles objectEnumerator];
            var startHole;

            while ((startHole = [startHolesEnum nextObject]))
            {
                var endHoles = [startHole valueForKey:@"laces"];

                if ([endHoles count] > 0)
                {
                    var endHolesEnum = [endHoles objectEnumerator];
                    var endHole;

                    while ((endHole = [endHolesEnum nextObject]))
                    {
                        [_laces addObject:@{@"startHole": startHole, @"endHole": endHole}];
                    }
                }
            }
        }
    }

    return _laces;
}

-(void)drawLinkFrom:(CGPoint)startPoint to:(CGPoint)endPoint color:(CPColor)insideColor
{

    var dist = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));

    // a lace is made of an outside gray line of width 5, and a inside insideColor(ed) line of width 3
    var p0 = CGPointMake(startPoint.x, startPoint.y);
    var p3 = CGPointMake(endPoint.x, endPoint.y);

    var p1 = CGPointMake(startPoint.x + treshold((endPoint.x - startPoint.x) / 2, 50), startPoint.y);
    var p2 = CGPointMake(endPoint.x -   treshold((endPoint.x - startPoint.x) / 2, 50), endPoint.y);

    // p0 and p1 are on the same horizontal line
    // distance between p0 and p1 is set with the treshold fuction
    // the same holds for p2 and p3

    var path = [CPBezierPath bezierPath];
    [path setLineWidth:0];
    [[CPColor grayColor] set];
    [path appendBezierPathWithOvalInRect:CGRectMake(startPoint.x-2.5,startPoint.y-2.5,5,5)];
    [path fill];

    path = [CPBezierPath bezierPath];
    [path setLineWidth:0];
    [insideColor set];
    [path appendBezierPathWithOvalInRect:CGRectMake(startPoint.x-1.5,startPoint.y-1.5,3,3)];
    [path fill];

    path = [CPBezierPath bezierPath];
    [path setLineWidth:0];
    [[CPColor grayColor] set];
    [path appendBezierPathWithOvalInRect:CGRectMake(endPoint.x-2.5,endPoint.y-2.5,5,5)];
    [path fill];

    path = [CPBezierPath bezierPath];
    [path setLineWidth:0];
    [insideColor set];
    [path appendBezierPathWithOvalInRect:CGRectMake(endPoint.x-1.5,endPoint.y-1.5,3,3)];
    [path fill];

    // if the line is rather short, draw a straight line. the curve would look rather odd in this case.
    if (dist < 40)
    {
        path = [CPBezierPath bezierPath];
        [path setLineWidth:5];
        [path moveToPoint:startPoint];
        [path lineToPoint:endPoint];
        [[CPColor grayColor] set];
        [path stroke];

        path = [CPBezierPath bezierPath];
        [path setLineWidth:3];
        [path moveToPoint:startPoint];
        [path lineToPoint:endPoint];
        [insideColor set];
        [path stroke];

        return;
    }

    path = [CPBezierPath bezierPath];
    [path setLineWidth:5];
    [path moveToPoint:p0];
    [path curveToPoint:p3 controlPoint1:p1 controlPoint2:p2];
    [[CPColor grayColor] set];
    [path stroke];

    path = [CPBezierPath bezierPath];
    [path setLineWidth:3];
    [path moveToPoint:p0];
    [path curveToPoint:p3 controlPoint1:p1 controlPoint2:p2];
    [insideColor set];
    [path stroke];
}

- (void)drawRect:(CPRect)rect
{
    // Draw laces
    for (var i = 0 ; i < [[self dataObjects] count] ; i++)
    {
        var startObject = [self dataObjects][i];
        var startHoles = [startObject valueForKey:@"outputs"];

        if ([startHoles count] > 0)
        {
            var startView = [self viewForData:startObject];

            for (var j = 0 ; j < [startHoles count] ; j++)
            {
                var startHole = startHoles[j];
                var endHoles = [startHole valueForKey:@"laces"];

                if ([endHoles count] > 0)
                {
                    var startPoint = [startView startHolePoint:startHole];

                    for (var k = 0 ; k < [endHoles count] ; k++)
                    {
                        var endHole = endHoles[k];
                        var endData = [endHole valueForKey:@"data"];

                        var endView = [self viewForData:endData];

                        if (!endView)
                        {
                            [endHole removeObjectForKey:@"data"]
                            continue;
                        }

                        var endPoint = [endView endHolePoint:endHole];

                        if ([startView isSelected] || [endView isSelected])
                            [self drawLinkFrom:startPoint to:endPoint color:[CPColor selectedControlColor]];
                        else
                            [self drawLinkFrom:startPoint to:endPoint color:[CPColor yellowColor]];
                    }
                }
            }
        }
    }

    // Draw lace being created
    if (_isMaking)
    {
        if (([self isEndHole:_endPoint]) && (_endSubView != _startSubView))
        {
            _endPoint = [_endSubView endHolePoint:_endHole];
            [self drawLinkFrom:_startPoint to:_endPoint color:[CPColor yellowColor]];
        }
        else
        {
            [self drawLinkFrom:_startPoint to:_endPoint color:[CPColor whiteColor]];
        }
    }

    // Draw selection rubber band
    if (_isRubbing)
    {
        var rubber = CGRectUnion(CGRectMake(_rubberStart.x, _rubberStart.y, 0.1, 0.1), CGRectMake(_rubberEnd.x, _rubberEnd.y, 0.1, 0.1));
        [CPBezierPath setDefaultLineWidth:0.5];
        [[[[CPColor whiteColor] blendedColorWithFraction:0.2 ofColor:[CPColor blackColor]] colorWithAlphaComponent:0.3] setFill];
        [CPBezierPath fillRect:rubber];
        [[CPColor whiteColor] setStroke];
        [CPBezierPath setDefaultLineWidth:1.0];
        [CPBezierPath strokeRect:rubber];
    }
}

- (void)deselectViews
{
    [_selectionIndexesContainer setValue:nil forKeyPath:_selectionIndexesKeyPath];
}

- (void)selectView:(EFView)aView
{
    [self selectView:aView state:YES];
}

- (void)selectView:(EFView)aView state:(BOOL)select
{
    var selection = [[self selectionIndexes] mutableCopy];
    var dob = [self dataObjects];
    var dataObjectIndex;

    for (var i = 0 ; i < [dob count] ; i++)
    {
        if (dob[i] == aView._dataObject)
        {
            dataObjectIndex = i;
            break;
        }
    }

    if (select)
        [selection addIndex:dataObjectIndex];
    else
        [selection removeIndex:dataObjectIndex];

    [_selectionIndexesContainer setValue:selection forKeyPath:_selectionIndexesKeyPath];
}

- (CPArray)selectedSubViews
{
    var selectedDataObjects = [[self dataObjects] objectsAtIndexes:[self selectionIndexes]];
    var subviews = [self subviews];
    var outarr = [];

    for (var i = 0 ; i < [subviews count] ; i++)
    {
        for (var j = 0 ; j < [selectedDataObjects count] ; j++)
        {
            if (selectedDataObjects[j] == subviews[i]._dataObject)
                outarr.push(subviews[i]);
        }
    }

    return outarr;
}

- (BOOL)isStartHole:(CPPoint)aPoint
{
    var aView;
    var enu = [[self subviews] objectEnumerator];

    while ((aView = [enu nextObject]))
    {
        if ([aView startHole:aPoint] != nil)
        {
            _startSubView = aView;
            _startHole = [aView startHole:aPoint];

            return YES;
        }
    }

    return NO;
}

- (BOOL)isEndHole:(CPPoint)aPoint
{
    var aView;
    var enu = [[self subviews] objectEnumerator];

    while ((aView = [enu nextObject]))
    {
        if ([aView endHole:aPoint] != nil)
        {
            _endSubView = aView;
            _endHole = [aView endHole:aPoint];

            return YES;
        }
    }

    return NO;
}

- (void)connectHole:(id)startHole toHole:(id)endHole
{
    if ([startHole valueForKey:@"data"] == [endHole valueForKey:@"data"] && [startHole valueForKey:@"data"])
        return;

    var conn = @{@"startHole":startHole, @"endHole":endHole};
    var laces = [self laces];

    
    // check if already connected
    for (var i = 0 ; i < [laces count] ; i++)
    {
        if ([conn objectForKey:@"startHole"] == [laces[i] objectForKey:@"startHole"] &&
            [conn objectForKey:@"endHole"] == [laces[i] objectForKey:@"endHole"])
            return;
    }

    [self willChangeValueForKey:@"laces"];
    [[startHole mutableSetValueForKey:@"laces"] addObject:endHole];

    if (_delegate && [_delegate respondsToSelector:@selector(laceView:didConnectHole:toHole:)])
        [_delegate laceView:self didConnectHole:startHole toHole:endHole];

    [self didChangeValueForKey:@"laces"];
}

- (BOOL) acceptsFirstResponder
{
    return YES;
}

- (void)delete:(id)sender
{
    if ([_dataObjectsContainer respondsToSelector:@selector(remove:)])
    {
        [_dataObjectsContainer performSelector:@selector(remove:) withObject:self];
        [self deselectViews];
        [self setNeedsDisplay:YES];
    }
}

- (void)cancelOperation:(id)sender
{
    if ([[self selectionIndexes] count] > 0)
    {
        [self deselectViews];
        [self setNeedsDisplay:YES];

        return;
    }
}

- (void)_dragOpenSpaceWithEvent:(CPEvent)theEvent
{
    var mouseLoc = [self convertPoint:[theEvent locationInWindow] fromView:nil];
    _rubberEnd = mouseLoc;
    var rubber = CGRectUnion(CGRectMake(_rubberStart.x,_rubberStart.y, 0.1, 0.1), CGRectMake(_rubberEnd.x, _rubberEnd.y, 0.1, 0.1));

    switch ([theEvent type])
    {
        case CPLeftMouseDragged:
        {
            // find views partially inside rubber and select them
            var svc = [[self subviews] copy];
            var svcCount = [svc count];

            for (var i = 0; i < svcCount ; i++)
            {
                var aView = svc[i];
                [self selectView:aView state:CGRectIntersectsRect([aView frame], rubber)];
                [aView setNeedsDisplay:YES];
            }

            [self setNeedsDisplay:YES];
            [CPApp setTarget:self selector:@selector(_dragOpenSpaceWithEvent:) forNextEventMatchingMask:CPLeftMouseDraggedMask | CPLeftMouseUpMask untilDate:nil inMode:nil dequeue:YES];

            break;
        }
        case CPLeftMouseUp:
        {
            _isRubbing = NO;

            [self setNeedsDisplay:YES];
            break;
        }
    }

}
- (void)_dragConnectWithEvent:(CPEvent)theEvent
{
    var mouseLoc = [self convertPoint:[theEvent locationInWindow] fromView:nil];

    switch ([theEvent type])
    {
        case CPLeftMouseDragged:
            _endPoint = mouseLoc;
            [self setNeedsDisplay:YES];
            [CPApp setTarget:self selector:@selector(_dragConnectWithEvent:) forNextEventMatchingMask:CPLeftMouseDraggedMask | CPLeftMouseUpMask untilDate:nil inMode:nil dequeue:YES];

            break;
        case CPLeftMouseUp:
            [[CPCursor arrowCursor] set];

            if ([self isEndHole:mouseLoc])
                [self connectHole:_startHole toHole:_endHole];

            [self setNeedsDisplay:YES];
            _isMaking = NO;
            break;
    }
};

- (void)mouseDown:(CPEvent)theEvent
{
    var mouseLoc = [self convertPoint:[theEvent locationInWindow] fromView:nil];

    // Did we click on a start hole ?
    if (![self isStartHole:mouseLoc])
    {
        // clicked outside a hole for begining a new lace
        // Did we click on an end hole ?
        if (![self isEndHole:mouseLoc])
        {
            // clicked outside any hole : so manage selections
            [self deselectViews];

            //Rubberband selection
            _isRubbing = YES;
            _rubberStart = mouseLoc;
            _rubberEnd = mouseLoc;

            [CPApp setTarget:self selector:@selector(_dragOpenSpaceWithEvent:) forNextEventMatchingMask:CPLeftMouseDraggedMask | CPLeftMouseUpMask untilDate:nil inMode:nil dequeue:YES];

            return;
        }

        // We clicked on an end hole
        // Dragging from an existing connection end will disconnect and recontinue the drag
        var enu = [[self laces] reverseObjectEnumerator]; // last created lace first
        var aDict;

        while ((aDict = [enu nextObject]))
        {
            if ([aDict objectForKey:@"endHole"] == _endHole) break;
        }

        if(!aDict)
            return; //nothing to un-drag...

        _startHole = [aDict objectForKey:@"startHole"];
        _startSubView = [self viewForData:[_startHole valueForKey:@"data"]];

        [_startHole willChangeValueForKey:@"laces"];
        [_endHole willChangeValueForKey:@"laces"];
        [self willChangeValueForKey:@"laces"];

        [[_startHole mutableSetValueForKey:@"laces"] removeObject:_endHole];
        [[_endHole mutableSetValueForKey:@"laces"] removeObject:_startHole];

        if (_delegate && [_delegate respondsToSelector:@selector(laceView:didUnconnectHole:fromHole:)])
            [_delegate laceView:self didUnconnectHole:_startHole fromHole:_endHole];

        [_startHole didChangeValueForKey:@"laces"];
        [_endHole didChangeValueForKey:@"laces"];
        [self didChangeValueForKey:@"laces"];
        [self setNeedsDisplay:YES];

        _startPoint = [_startSubView startHolePoint:_startHole];
        _endPoint = mouseLoc;

    }
    else // we clicked on a start hole
    {
        _startPoint = _endPoint = [_startSubView startHolePoint:_startHole];
        [[CPCursor crosshairCursor] set];
        _isMaking = YES;

        [CPApp setTarget:self selector:@selector(_dragConnectWithEvent:) forNextEventMatchingMask:CPLeftMouseDraggedMask | CPLeftMouseUpMask untilDate:nil inMode:nil dequeue:YES];
    }
}

@end
