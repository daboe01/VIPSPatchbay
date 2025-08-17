//  EFView.j
//  created by daniel boehringer on 29/DEC/2023
//  cappuccino port of
//  EFView.m
//  EFLaceView
//
//  Created by MacBook Pro ef on 25/07/06.
//  Copyright 2006 Edouard FISCHER. All rights reserved.
//  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//
//    -    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//    -    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//    -    Neither the name of Edouard FISCHER nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


var _inoutputObservationContext = 1094;

@implementation CPString(SizingAddition)
- (CPSize)sizeWithAttributes:(CPDictionary)stringAttributes
{
    return [self sizeWithFont:[stringAttributes objectForKey:CPFontAttributeName] inWidth:NULL];
}
- (void)drawAtPoint:(CGPoint)aPoint withAttributes:attributes
{
    var ctx = [[CPGraphicsContext currentContext] graphicsPort];
    CGContextSelectFont(ctx, [attributes objectForKey:"CPFontAttributeName"]);
    CGContextShowTextAtPoint(ctx, aPoint.x, aPoint.y, self);
}
@end

@implementation CPGraphicsContext(MonkeyAddition)
+ (BOOL)currentContextDrawingToScreen
{
    return YES;
}
@end
@implementation CPColor(SomeAdditions)
+ (CPColor)controlBackgroundColor
{
    return [CPColor whiteColor];
}

+ (CPColor)controlShadowColor
{
    return [CPColor grayColor];
}

+ (CPColor)selectedControlColor
{
    return [CPColor redColor];
}
@end

@implementation CPBezierPath(RoundedRectangle)

+ (CPBezierPath)bezierPathWithRoundedRect:(CPRect)aRect radius:(float)radius
{
    return [self bezierPathWithRoundedRect:aRect xRadius:radius yRadius:radius];
}

@end

@class CPTrackingArea;

@implementation EFView : CPView
{
    CPString                _title;
    CPColor                 _titleColor;
    CPMutableSet            _inputs;
    CPMutableSet            _outputs;
    float                   _verticalOffset;
    CPMutableDictionary     _stringAttributes;
    id                      _data @accessors(property=data);
    CGPoint                 _lastMouseLoc;
    CPTrackingArea          _trackingArea;
}

- (id)init
{
    return [self initWithFrame:CGRectMake (0,0,10,10)];
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];

    if (self)
    {
        _inputs = [[CPMutableSet alloc] init];
        _outputs = [[CPMutableSet alloc] init];

        _stringAttributes = [[CPMutableDictionary alloc] init];
        [_stringAttributes setObject:[CPFont systemFontOfSize:10] forKey:CPFontAttributeName];
        [_stringAttributes setObject:[CPColor blackColor] forKey:CPForegroundColorAttributeName];

        _title = @"Title bar";
        var titleSize = [[self title] sizeWithAttributes:_stringAttributes];
        _titleColor = [CPColor greenColor];

        _verticalOffset = titleSize.height/2;
        
        [self setFrameSize:[self minimalSize]];
        [self setNeedsDisplay:YES];
        
        // need to update view when labels or positions are changed in inputs or ouputs
        [self addObserver:self forKeyPath:@"inputs" options:(CPKeyValueObservingOptionNew|CPKeyValueObservingOptionOld) context:_inoutputObservationContext];
        [self addObserver:self forKeyPath:@"outputs" options:(CPKeyValueObservingOptionNew|CPKeyValueObservingOptionOld) context:_inoutputObservationContext];

        _trackingArea = [[CPTrackingArea alloc] initWithRect:CGRectMakeZero()
                                                    options:CPTrackingMouseMoved | CPTrackingActiveInKeyWindow | CPTrackingInVisibleRect
                                                      owner:self
                                                   userInfo:nil];
        [self addTrackingArea:_trackingArea];
    }
    
    return self;
}

- (void)removeFromSuperview
{
    [self removeTrackingArea:_trackingArea];

    for (var i = 0;  i < [_inputs count]; i++)
    {
        var anObject = _inputs[i];
        [anObject removeObserver:self forKeyPath:@"label"];
        [anObject removeObserver:self forKeyPath:@"position"];
    }

    for (var i = 0;  i < [_outputs count]; i++)
    {
        var anObject = _outputs[i];
        [anObject removeObserver:self forKeyPath:@"label"];
        [anObject removeObserver:self forKeyPath:@"position"];
    }

    [super removeFromSuperview];
}

//FIXME
/*
- (void)dealloc {
    [self removeObserver:self forKeyPath:@"inputs"];
    [self removeObserver:self forKeyPath:@"outputs"];
}
*/

#pragma mark -
#pragma mark *** setters and accessors ***
//vertical Offset
- (float)verticalOffset
{
    return _verticalOffset;
}

- (void)setVerticalOffset:(float)aValue
{
    _verticalOffset = MAX(aValue,0);
    [self setHeight:MAX([self minimalSize].height,[self height])];
    [[self superview] setNeedsDisplay:YES];
}

- (BOOL)isSelected
{
    var selectedSubviews = [[self superview] selectedSubViews];

    for (var i = 0 ; i < [selectedSubviews count] ; i++)
    {
        if (selectedSubviews[i] == self)
            return YES;
    }
    
    return NO;
}

// title color
- (CPColor)titleColor {
    return _titleColor;
}

- (void)setTitleColor:(CPColor)aColor
{
    if (aColor != [self titleColor])
        _titleColor = aColor;

    [self setNeedsDisplay:YES];
}

// title
- (CPString)title
{
    return (_title == nil) ? @"" : _title;
}

- (void)setTitle:(CPString)aTitle
{
    if (aTitle != _title)
    {
        _title = aTitle;
        [self setWidth:MAX([self minimalSize].width,[self width])];
        [self setNeedsDisplay:YES];
    }
}

- (float) originX
{
    return [self frame].origin.x;
}

- (float) originY
{
    return [self frame].origin.y;
}

- (float) width
{
    return [self frame].size.width;
}

- (float) height
{
    return [self frame].size.height;
}

-(void) setOriginX:(float)aFloat
{
    if (aFloat != [self originX])
    {
        var frame = [self frame];
        frame.origin.x = aFloat;
        [self setFrame:frame];
        [[self superview] setNeedsDisplay:YES];
    }
}

-(void) setOriginY:(float)aFloat
{
    if (aFloat != [self originY])
    {
        var frame = [self frame];
        frame.origin.y = aFloat;
        [self setFrame:frame];
        [[self superview] setNeedsDisplay:YES];
    }
}

-(void) setWidth:(float)aFloat
{
    if (aFloat != [self width])
    {
        var frame = [self frame];
        frame.size.width = MAX(aFloat,[self minimalSize].width);
        [self setFrame:frame];
        [[self superview] setNeedsDisplay:YES];
    }
}

- (void)setHeight:(float)aFloat
{
    if (aFloat != [self height])
    {
        var frame = [self frame];
        frame.size.height = MAX(aFloat,[self minimalSize].height);
        [self setFrame:frame];
        [[self superview] setNeedsDisplay:YES];
    }
}

- (CPMutableSet)inputs
{
    return _inputs;
}

- (void)setInputs:(CPMutableSet)aSet
{
    if (aSet != _inputs)
        _inputs = aSet;
}

- (CPArray)orderedInputs
{
    return [self orderedHoles:[self inputs]];
}

- (CPArray)orderedHoles:(CPSet)aSet
{
    var sort = [[CPSortDescriptor alloc] initWithKey:@"position" ascending:YES];
    var result = [[aSet allObjects] sortedArrayUsingDescriptors:[CPArray arrayWithObject:sort]];

    return result;
}

- (CPMutableSet)outputs
{
    return _outputs;
}

- (void)setOutputs:(CPMutableSet)aSet
{
    if (aSet != _outputs)
        _outputs = aSet;
}

- (CPArray)orderedOutputs
{
    return [self orderedHoles:[self outputs]];
}


- (id)endHole:(CGPoint)aPoint
{
    var mousePos = [self convertPoint:aPoint fromView:[self superview]];
    var stringSize = [[self title] sizeWithFont:[_stringAttributes objectForKey:CPFontAttributeName] inWidth:NULL];

    var heightOfText = stringSize.height;

    if ((mousePos.x > 0) && (mousePos.x < 15))
    {
        var hole = Math.floor((-mousePos.y + [self bounds].origin.y + [self bounds].size.height - [self verticalOffset] - heightOfText * 0.5) / heightOfText) - 1;
        var res = ((hole >= 0) && (hole < [[self inputs] count])) ? [[self orderedInputs] objectAtIndex:hole] : nil;
        
        if (res)
            [res setValue:_data forKey:@"data"];

        return res;
    }

    return nil;
}

- (id)startHole:(CGPoint)aPoint
{
    var mousePos = [self convertPoint:aPoint fromView:[self superview]];
    var stringSize = [[self title] sizeWithAttributes:_stringAttributes];
    var heightOfText = stringSize.height;

    if ((mousePos.x > [self bounds].origin.x + [self bounds].size.width-15) && (mousePos.x < [self bounds].origin.x + [self bounds].size.width))
    {
        var hole = Math.floor((-mousePos.y + [self bounds].origin.y + [self bounds].size.height - [self verticalOffset] - heightOfText * 0.5) / heightOfText) - 1;
        var res = ((hole >= 0) && (hole < [[self outputs] count])) ? [[self orderedOutputs] objectAtIndex:hole] : nil;

        if (res)
            [res setValue:_data forKey:@"data"];

        return res;
    }

    return nil;
}

- (CGPoint)endHolePoint:(id)aEndHole
{
    var stringSize = [[self title] sizeWithAttributes:_stringAttributes];
    var heightOfText = stringSize.height;

    var hole = [[self orderedHoles:[self inputs]] indexOfObject:aEndHole] + 1;

    return [self convertPoint:CGPointMake(5 + 4, [self bounds].origin.y + [self bounds].size.height - [self verticalOffset] - heightOfText * (hole + 1.0)) toView:[self superview]];
}

- (CGPoint)startHolePoint:(id)aStartHole
{
    var stringSize = [[self title] sizeWithAttributes:_stringAttributes];
    var heightOfText = stringSize.height;

    var hole = [[self orderedHoles:[self outputs]] indexOfObject:aStartHole] + 1;

    return [self convertPoint:CGPointMake([self bounds].origin.x + [self bounds].size.width - 5 - 4, [self bounds].origin.y + [self bounds].size.height - [self verticalOffset] - heightOfText * (hole + 1.0)) toView:[self superview]];
}

- (CPSize)minimalSize
{
    var titleSize = [[self title] sizeWithAttributes:_stringAttributes];
    var maxInputWidth = 0;
    var i;

    for (i = 0; i < [[self inputs] count]; i++)
    {
        var inputLabel = [[[self orderedInputs] objectAtIndex:i] valueForKey:@"label"];
        var inputWidth = 10 + 4 + [inputLabel sizeWithAttributes:_stringAttributes].width + 5;
        maxInputWidth = MAX(inputWidth, maxInputWidth);
    }

    var maxOutputWidth = 0;

    for (var j = 0; j < [[self outputs] count]; j++)
    {
        var outputLabel = [[[self orderedOutputs] objectAtIndex:j] valueForKey:@"label"];
        var outputWidth = 10 + 4 + [outputLabel sizeWithAttributes:_stringAttributes].width + 5;
        maxOutputWidth = MAX(outputWidth, maxOutputWidth);
    }
    
    var result = CGSizeMake(0, 0);
    result.width = MAX(titleSize.width + 16, maxInputWidth + maxOutputWidth);
    result.height = (titleSize.height) * (2.0 + (([[self inputs] count] > [[self outputs] count]) ? [[self inputs] count] : [[self outputs] count])) + [self verticalOffset] + 12;

    return result;
}

- (void)drawRect:(CGRect)rect
{
    var bounds = CGRectInset([self bounds], 4, 4);
    var stringSize = [[self title] sizeWithAttributes:_stringAttributes];

    //draw title
    [[self title] drawAtPoint:CGPointMake(bounds.origin.x + (bounds.size.width - stringSize.width) / 2, 12) withAttributes:_stringAttributes];

    // draw end of lace
    for (var i = 0 ; i < [[self inputs] count] ; i++)
    {
        var aDict = [self inputs][i];
        var path = [CPBezierPath bezierPath];
        [path setLineWidth:1];
        [[CPColor grayColor] set];
        var end = [self convertPoint:[self endHolePoint:aDict] fromView:[self superview]];
        [path appendBezierPathWithOvalInRect:CGRectMake(end.x - 3, end.y - 3, 6, 6)];
        [path stroke];
        var labelOrigin = CGPointMake(0, 0);
        var inputLabel = [aDict valueForKey:@"label"];
        labelOrigin.x = end.x + 5;
        labelOrigin.y = end.y;
        [[CPColor blackColor] set];
        [inputLabel drawAtPoint:labelOrigin withAttributes:_stringAttributes];
    }
    
    // draw start of lace
    for (var i = 0 ; i < [[self outputs] count] ; i++)
    {
        var aDict = [self outputs][i];

        var path = [CPBezierPath bezierPath];
        [path setLineWidth:1];
        [[CPColor grayColor] set];
        var start = [self convertPoint:[self startHolePoint:aDict] fromView:[self superview]];
        [path appendBezierPathWithOvalInRect:CGRectMake(start.x - 3,start.y - 3, 6, 6)];
        [path stroke];
        var labelOrigin = CGPointMake(0, 0);
        var outputLabel = [aDict valueForKey:@"label"];

        labelOrigin.x = start.x - 3 - [outputLabel sizeWithAttributes:_stringAttributes].width;
        labelOrigin.y = start.y;
        [[CPColor blackColor] set];
        [outputLabel drawAtPoint:labelOrigin withAttributes:_stringAttributes];
    }
    
    //draw outline
    [(([self isSelected]) && ([CPGraphicsContext currentContextDrawingToScreen])) ? [CPColor selectedControlColor] : [CPColor controlShadowColor] /*_titleColor*/ setStroke];
    var lineWidth = (([self isSelected]) && ([CPGraphicsContext currentContextDrawingToScreen])) ? 2.0 : 1.0;
    var shape = [CPBezierPath bezierPathWithRoundedRect:CGRectInset(bounds, -lineWidth / 2 + 0.15, -lineWidth / 2 + 0.15) radius:8]; //0.15 to be perfect on a zoomed printing
    [shape setLineWidth:lineWidth];
    [shape stroke];
}

-(void)setFrame:(CGRect)aRect
{
    var orFrame = [self frame];
    var superViewBounds = [[self superview] bounds];

    if (aRect.origin.x < superViewBounds.origin.x)
        aRect.origin.x = superViewBounds.origin.x;
    else if (aRect.origin.x + aRect.size.width > superViewBounds.origin.x + superViewBounds.size.width)
        aRect.origin.x = superViewBounds.origin.x + superViewBounds.size.width - aRect.size.width;

    if (aRect.origin.y < superViewBounds.origin.y)
        aRect.origin.y = superViewBounds.origin.y;
    else if (aRect.origin.y + aRect.size.height > superViewBounds.origin.y + superViewBounds.size.height)
        aRect.origin.y = superViewBounds.origin.y + superViewBounds.size.height - aRect.size.height;


    if (orFrame.origin.x != aRect.origin.x)
    {
        [self willChangeValueForKey:@"originX"];
        [self willChangeValueForKey:@"drawingBounds"];
    }

    if (orFrame.origin.y != aRect.origin.y)
    {
        [self willChangeValueForKey:@"originY"];
        [self willChangeValueForKey:@"drawingBounds"];
    }

    if (orFrame.size.height != aRect.size.height)
    {
        [self willChangeValueForKey:@"height"];
        [self willChangeValueForKey:@"drawingBounds"];
    }

    if (orFrame.size.width != aRect.size.width)
    {
        [self willChangeValueForKey:@"width"];
        [self willChangeValueForKey:@"drawingBounds"];
    }
    
    [super setFrame:aRect];
    
    if (orFrame.origin.x != aRect.origin.x)
    {
        [self didChangeValueForKey:@"originX"];
        [self didChangeValueForKey:@"drawingBounds"];
    }

    if (orFrame.origin.y != aRect.origin.y)
    {
        [self didChangeValueForKey:@"originY"];
        [self didChangeValueForKey:@"drawingBounds"];
    }

    if (orFrame.size.height != aRect.size.height)
    {
        [self didChangeValueForKey:@"height"];
        [self didChangeValueForKey:@"drawingBounds"];
    }

    if (orFrame.size.width != aRect.size.width)
    {
        [self didChangeValueForKey:@"width"];
        [self didChangeValueForKey:@"drawingBounds"];
    }
}

- (BOOL)acceptsFirstResponder
{
    return YES;
}

- (CPView)hitTest:(CGPoint)aPoint
{
    return (([self startHole:aPoint] != nil) || ([self endHole:aPoint] != nil)) ? nil : [super hitTest:aPoint];
}

- (void)_dragWithEvent:(CPEvent)theEvent
{
    var sView = [self superview];
    var initialFrame = [self frame];
    var mouseLoc;

    switch ([theEvent type])
    {
        case CPLeftMouseDragged:
        {
            [[CPCursor closedHandCursor] set];
            mouseLoc = [[self superview] convertPoint:[theEvent locationInWindow] fromView:nil];

            for (var i = 0;  i < [[sView selectedSubViews] count]; i++)
            {
                var view = [sView selectedSubViews][i];

                [view setFrame:CGRectOffset([view frame], mouseLoc.x - _lastMouseLoc.x, mouseLoc.y - _lastMouseLoc.y)];
            }

            _lastMouseLoc = mouseLoc;
            [self autoscroll:theEvent];
            [sView setNeedsDisplay:YES];
            [CPApp setTarget:self selector:@selector(_dragWithEvent:) forNextEventMatchingMask:CPLeftMouseDraggedMask | CPLeftMouseUpMask untilDate:nil inMode:nil dequeue:YES];

            break;
        }
        case CPLeftMouseUp:
            [[CPCursor arrowCursor] set];

            if (!CGRectContainsRect([sView bounds], [self frame]))
            {
                // revert to original frame if not inside superview
                [self setFrame:initialFrame];
                [sView setNeedsDisplay:YES];
            }
            [sView setNeedsDisplay:YES];
            
            if ([self superview]._delegate && [[self superview]._delegate respondsToSelector:@selector(laceView:didDragBlockView:)])
            {
                var selectedSubviews = [[self superview] selectedSubViews];

                for (var i = 0 ; i < [selectedSubviews count] ; i++)
                    [[self superview]._delegate laceView:[self superview] didDragBlockView:selectedSubviews[i]];
            }
            break;
    }
}

- (void)mouseMoved:(CPEvent)theEvent
{
    var aPoint = [[self superview] convertPoint:[theEvent locationInWindow] fromView:nil];
    var startHole = [self startHole:aPoint];
    var endHole = [self endHole:aPoint]

    if (!startHole && !endHole)
        return;

    if ([self superview]._delegate && [[self superview]._delegate respondsToSelector:@selector(laceView:showTooltipForHole:)])
        [[self superview]._delegate laceView:[self superview] showTooltipForHole:startHole || endHole];
}

- (void)mouseDown:(CPEvent)theEvent
{

    if ([theEvent clickCount] == 2)
    {
        if ([self superview]._delegate && [[self superview]._delegate respondsToSelector:@selector(laceView:didDoubleClickView:)])
            [[self superview]._delegate laceView:[self superview] didDoubleClickView:self];
        return;
    }

    var sView = [self superview];

    if ([theEvent modifierFlags] & CPShiftKeyMask)
    {
        // add to selection
        [sView selectView:self state:YES];
    }
    else if ([theEvent modifierFlags] & CPCommandKeyMask)
    {
        // inverse selection
        [sView selectView:self state:![self isSelected]];
    }
    else if (![self isSelected])
    {
        [sView deselectViews];
        [sView selectView:self state:YES];
    }
    
    _lastMouseLoc = [[self superview] convertPoint:[theEvent locationInWindow] fromView:nil];

    [CPApp setTarget:self selector:@selector(_dragWithEvent:) forNextEventMatchingMask:CPLeftMouseDraggedMask | CPLeftMouseUpMask untilDate:nil inMode:nil dequeue:YES];
}

- (void)observeValueForKeyPath:(CPString)keyPath ofObject:(id)object change:(CPDictionary)change context:(id)context
{
    if (((keyPath == @"inputs") || keyPath == @"outputs") && (context == _inoutputObservationContext))
    {
        var newV = [change valueForKey:@"new"];
        var old = [change valueForKey:@"old"];

        //compute inserted labels
        var inserted = [newV mutableCopy];
        [inserted minusSet:old];
        
        //compute removed labels
        var removed = [old mutableCopy];
        [removed minusSet:newV];

        //make label observed by the view for changes on label or on position
        for (var i = 0;  i < [inserted count]; i++)
        {
            var anObject = inserted[i];
            [anObject addObserver:self forKeyPath:@"label" options:0 context:_inoutputObservationContext];
            [anObject addObserver:self forKeyPath:@"position" options:0 context:_inoutputObservationContext];
            [anObject addObserver:self forKeyPath:@"laces" options:0 context:_inoutputObservationContext];
        }
        
        for (var i = 0;  i < [removed count]; i++)
        {
            var anObject = removed[i];
            [anObject removeObserver:self forKeyPath:@"label"];
            [anObject removeObserver:self forKeyPath:@"position"];
            [anObject removeObserver:self forKeyPath:@"laces"];
        }
        
        //update size and redraw
        [self setWidth:MAX([self minimalSize].width, [self width])];
        [self setHeight:MAX([self minimalSize].height, [self height])];
        [[self superview] setNeedsDisplay:YES];
        
    }
    if ((keyPath == @"label") && (context == _inoutputObservationContext))
    {
        //update size and redraw
        [self setWidth:MAX([self minimalSize].width, [self width])];
        [self setHeight:MAX([self minimalSize].height, [self height])];
    }
    if ((keyPath == @"position") && (context == _inoutputObservationContext))
    {
        //redraw superview (laces may have changed because of positions of labels)
        [[self superview] setNeedsDisplay:YES];
    }
    if ([keyPath isEqualToString:@"laces"]) {
        //redraw laces because of undos
        [[self superview] setNeedsDisplay:YES];
    }
}
@end

@implementation EFLabelView : EFView
{
}

- (CPSize)minimalSize
{
    var attributes = @{CPFontAttributeName:[self isSelected] ? [CPFont boldSystemFontOfSize:12] : [CPFont systemFontOfSize:12]};
    var result =  [[self title] sizeWithAttributes:attributes];
    return CGSizeMake(result.width + 4, result.height + 4);
}

- (void)drawRect:(CGRect)rect
{
    var bounds = CGRectInset([self bounds], 4, 4);
    var attributes = @{CPFontAttributeName:[self isSelected] ? [CPFont boldSystemFontOfSize:12] : [CPFont systemFontOfSize:12]};
    var stringSize = [[self title] sizeWithAttributes:attributes];

    //draw title
    [[self title] drawAtPoint:CGPointMake(bounds.origin.x + (bounds.size.width - stringSize.width) / 2, 12) withAttributes:attributes];
}
@end
