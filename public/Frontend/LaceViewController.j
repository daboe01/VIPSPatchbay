/*
 * Cappuccino frontend for PatchbayLLM
 *
 * Created by daboe01 on Dec, 29, 2023 by Daniel Boehringer.
 * Copyright 2023, All rights reserved.
 *
 *
 *
 */



/////////////////////////////////////////////////////////

HostURL=""
BaseURL=HostURL+"/";

/////////////////////////////////////////////////////////

@import <Foundation/CPObject.j>
@import <Renaissance/Renaissance.j>
@import "EFView.j"
@import "EFLaceView.j"

@implementation GSMarkupTagPatchbayView: GSMarkupTagView

+ (Class) platformObjectClass
{
    return [EFLaceView class];
}
@end

@implementation CPConservativeDictionary:CPDictionary
+ (CPArray)keysForNonBoundsProperties
{
    return [];
}

- (void)setValue:(id)aVal forKey:(CPString)aKey
{
    if ([self objectForKey:aKey] != aVal)
        [super setValue:aVal forKey:aKey];
}
- (BOOL)isEqual:(id)otherObject
{
    return [self valueForKey:'id'] == [otherObject valueForKey:'id'];
}
@end

@implementation CPArray(outletsContainer)
- (CPArray)allObjects
{
    return self;
}
@end

@implementation CPColor(BlendAddititon)
- (CPColor)blendedColorWithFraction:(CGFloat)fraction ofColor:(CPColor)color
{
    var red = [_components[0], color._components[0]],
    green = [_components[1], color._components[1]],
    blue = [_components[2], color._components[2]],
    alpha = [_components[3], color._components[3]];

    var blendedRed = red[0] + fraction * (red[1] - red[0]);
    var blendedGreen = green[0] + fraction * (green[1] - green[0]);
    var blendedBlue = blue[0] + fraction * (blue[1] - blue[0]);
    var blendedAlpha = alpha[0] + fraction * (alpha[1] - alpha[0]);

    return [CPColor colorWithCalibratedRed:blendedRed green:blendedGreen blue:blendedBlue alpha:blendedAlpha];
}
@end


@implementation LaceViewController : CPViewController
{
    id _blocksController;
    id _screenController;

    id _editPopover;
    id _settingsController @accessors(property = settingsController);
    id _editWindow  @accessors(property = editWindow);
    id _blockGUIConnector;
    id addBlocksPopover;
    id _addBlocksView @accessors(property = addBlocksView);
    id _connections;
    id _blockIndex;
}

+ (void)connectBlock:(id)mydata toOtherBlock:(id)mydata2 usingOutletNamed:(CPString)name
{
    var startHoles = [mydata valueForKey:'outputs'];
    var endHoles = [mydata2 valueForKey:'inputs'];
    var myinput;

    if (!startHoles)
        return;

    for (var i = 0; i < [endHoles count] ; i++)
    {
        if ([endHoles[i] valueForKey:"label"] == name)
        {
            myinput = endHoles[i];
            break;
        }
    }

    if ([[startHoles[0] valueForKey:"laces"] isKindOfClass:CPArray])
        [startHoles[0] valueForKey:"laces"].push(myinput);
    else
        [startHoles[0] setValue:[myinput] forKey:"laces"];

    [myinput setValue:mydata2 forKey:"data"]
    [startHoles[0] setValue:mydata forKey:"data"]
}

- (void)laceView:(EFLaceView)aView didConnectHole:(id)startHole toHole:(id)endHole
{
    var sourcePK = [[startHole valueForKey:"data"] valueForKey:'id']
    var targetPK = [[endHole valueForKey:"data"] valueForKey:'id'];
    var outletName = [endHole valueForKey:"label"];
    var o = [_blocksController._entity objectWithPK:targetPK];
    var connString = [o valueForKey:'connections'];
    var conn = connString ? JSON.parse([o valueForKey:'connections']) : {};
    conn[outletName] = sourcePK;
    [o setValue:JSON.stringify(conn) forKey:"connections"];
}

- (void)laceView:(EFLaceView)aView didUnconnectHole:(id)startHole fromHole:(id)endHole
{
    var targetPK = [[endHole valueForKey:"data"] valueForKey:'id'];
    var outletName = [endHole valueForKey:"label"];
    var o = [_blocksController._entity objectWithPK:targetPK];
    var connString = [o valueForKey:'connections'];

    var conn = connString ? JSON.parse([o valueForKey:'connections']) : {};
    delete conn[outletName];
    [o setValue:JSON.stringify(conn) forKey:"connections"];
}

- (void)laceView:(EFLaceView)aView showTooltipForHole:(id)aHole
{
    // FIXME
    // document.title = [aHole valueForKey:"label"]
}

- (void)laceView:(EFLaceView)aView didDragBlockView:(EFView)aView
{
    var data = [aView valueForKey:'data'];
    var point = [aView frame].origin;
    var o = [_blocksController._entity objectWithPK:[data valueForKey:'id']];
    [o setValue:FLOOR(point.x) forKey:"originX"];
    [o setValue:FLOOR(point.y) forKey:"originY"];
}

- (void)cancelEdit:(id)sender
{
    [_editPopover close];
}

- (void)popoverDidClose:(CPPopover)aPopover
{
    // refresh gui for label only after settins are surely saved FIXME
    if ([_screenController valueForKeyPath:"selection.is_label"] == '1')
        setTimeout(function(){
            [_blocksController rearrangeObjects];
        }, 500)
}

- (CPString)_compileGUIXML:(CPString)string rotatedResultsPrefix:(CPString)rrprefix
{
    string = [string stringByReplacingOccurrencesOfString:'column="' withString:'valueBinding="#CPOwner.'+rrprefix+'.selection.'];

    return  '<?xml version="1.0"?> <!DOCTYPE gsmarkup>  <gsmarkup> <objects> <window visible="NO"> <vbox id="widgets">' + string +
    '</vbox> </window>  </objects> <connectors> <outlet source="#CPOwner" target="widgets" label="_blockGUIConnector"/> </connectors></gsmarkup>';
}

- (void)laceView:(EFLaceView)aLaceView didDoubleClickView:(EFView)aView
{

    var pk = [aView valueForKeyPath:'data.id'];
    var selectionArray = [[_blocksController arrangedObjects] filteredArrayUsingPredicate:[CPPredicate predicateWithFormat:"id = %@", pk + '']];
    var currentBlock = selectionArray[0];
    [currentBlock reload];
    [_blocksController setSelectedObjects:[currentBlock]];


    var effectiveView;

    if (!_editPopover)
    {
        _editPopover = [CPPopover new];
        [_editPopover setDelegate:self];
        [_editPopover setAnimates:NO];
        [_editPopover setBehavior:CPPopoverBehaviorTransient];
        [_editPopover setAppearance:CPPopoverAppearanceMinimal];
    }

    var myViewController = [CPViewController new];
    [_editPopover setContentViewController:myViewController];

    var gui_xml = [currentBlock valueForKeyPath:"block_type.gui_xml"];

    if ([gui_xml isKindOfClass:CPString])
    {
        gui_xml = [self _compileGUIXML:gui_xml rotatedResultsPrefix:'_settingsController'];
        var cols = JSON.parse([currentBlock valueForKeyPath:"block_type.gui_fields"]);
        cols.push('id'); // primary key

        _settingsController._entity._columns = [CPSet setWithArray:cols];
        [_settingsController reload]

        [CPBundle loadGSMarkupData:[CPData dataWithRawString:gui_xml] externalNameTable:[CPDictionary dictionaryWithObject:self forKey:"CPOwner"] localizableStringsTable:nil inBundle:nil tagMapping:nil];

        var mysize = CGSizeMake(300, 600)
        var view = [[CPView alloc] initWithFrame:CGRectMake(0, 0, mysize.width, mysize.height)];
        [view setFrameSize:mysize];
        [view addSubview:_blockGUIConnector];

        effectiveView = view;
    }
    else
        effectiveView = [_editWindow contentView];

    [myViewController setView:effectiveView];
    [_editPopover showRelativeToRect:aView._frame ofView:aLaceView preferredEdge:nil];
}

- (void)removeBlocks:(id)sender
{
    var selectedBlocks = [_screenController selectedObjects];
    var count = [selectedBlocks count];

    // delete each block in backend separately
    for(var i = 0; i < count; i++)
    {
        var dbo = [_blocksController._entity objectWithPK:[selectedBlocks[i] valueForKey:'id']];
        [_blocksController._entity deleteObject:dbo];
    }

    setTimeout(function(){
        [_blocksController reload];
    }, 250)
}

- (void)performAddBlocks:(id)sender
{
    var selectedBlocks = [CPApp._delegate.blocksCatalogueController selectedObjects];  // fixme
    var currentX = 0;
    var currentY = 0;

    for(var i = 0; i < [selectedBlocks count]; i++)
    {
        var currentBlockTemplate = selectedBlocks[i];
        var mydata = [CPConservativeDictionary new];
        [mydata setValue:[CPApp._delegate.projectsController valueForKeyPath:"selection.id"] forKey:'idproject']; // fixme
        [mydata setValue:currentX forKey:'originX'];
        [mydata setValue:currentY forKey:'originY'];
        [mydata setValue:[currentBlockTemplate valueForKey:'id'] forKey:'idblock'];
        [mydata setValue:[currentBlockTemplate valueForKey:'default_value'] forKey:'output_value'];
        var dbo = [_blocksController._entity createObjectWithDictionary:mydata];
        [_blocksController._entity insertObject:dbo];

        currentX += 100;
    }
    [_blocksController reload];
}

- (void)addBlocks:(id)sender
{
    if (!addBlocksPopover)
    {
        addBlocksPopover = [CPPopover new];
        [addBlocksPopover setDelegate:self];
        [addBlocksPopover setAnimates:NO];
        [addBlocksPopover setBehavior:CPPopoverBehaviorTransient];
        [addBlocksPopover setAppearance:CPPopoverAppearanceMinimal];
        var myViewController = [CPViewController new];
        [addBlocksPopover setContentViewController:myViewController];
        [myViewController setView:_addBlocksView];
    }

    [addBlocksPopover showRelativeToRect:NULL ofView:sender preferredEdge:nil];
}

- (void)cancelAddBlocks:(id)sender
{
    [addBlocksPopover close];
}

- (id)blockForData:(id)o
{
    var mydata = [CPConservativeDictionary new];
    var title = [o valueForKeyPath:"block_type.name"];

    var x    = parseInt([o valueForKey:'originX'], 10)
    var y    = parseInt([o valueForKey:'originY'], 10)
    var myid = parseInt([o valueForKey:'id'], 10)

    x = isNaN(x) ? 0 : x;
    y = isNaN(y) ? 0 : y;
    [mydata setValue:x forKey:'originX'];
    [mydata setValue:y forKey:'originY'];
    [mydata setValue:myid forKey:'id'];

    if (title == 'Label')
    {
        [mydata setValue:'1' forKey:'is_label'];
        mydata.is_label = YES;
        [mydata setValue:[o valueForKey:'output_value']  || 'Label' forKey:'title'];
    }
    else
        [mydata setValue:title forKey:'title'];

    var connString = [o valueForKey:'connections'];

    if (connString)
    {
        var conn = JSON.parse(connString);
        conn['target'] = myid;
        _connections.push(conn);
    }

    var myinputArray = [];
    var conncatString = [o valueForKeyPath:'block_type.inputs'];

    if (conncatString)
    {
        var conncat = JSON.parse(conncatString);

        for (var j = 0 ; j < conncat.length ; j++)
        {
            var myinput = @{'label': conncat[j]};
            myinputArray.push(myinput);
        }
    }

    [mydata setValue:myinputArray forKey:'inputs'];

    var myoutputArray = [];
    var conncatStringOut = [o valueForKeyPath:'block_type.outputs'];

    if (conncatStringOut)
    {
        var conncat = JSON.parse(conncatStringOut);
        for (var j = 0 ; j < conncat.length ; j++)
        {
            var effectiveLabel = conncat[j] == 'Output' ? '↣' : conncat[j];
            var myoutput = @{'label': effectiveLabel};
            myoutputArray.push(myoutput);
        }
    }

    [mydata setValue:myoutputArray forKey:'outputs'];

    [_blockIndex setObject:mydata forKey:myid];

    return mydata;
}

- (void)setupBlocksView
{
    var blocks = [_blocksController arrangedObjects];

    _connections = [];

    _blockIndex = @{};

    for (var i = 0 ; i < [blocks count] ; i++)
    {
        var o = blocks[i];
        [o reload]; // important for connections

        var mydata = [self blockForData:o];
        [_screenController insertObject:mydata atArrangedObjectIndex:0];
    }

    for (var i = 0 ; i < _connections.length ; i++)
    {
        var conn = _connections[i];

        var target = [_blockIndex objectForKey:conn['target']];

        for (var key in conn)
        {
            if (conn.hasOwnProperty(key))
            {
                if (key == 'target')
                    continue;

                var source = [_blockIndex objectForKey:conn[key]];
                [[self class] connectBlock:source toOtherBlock:target usingOutletNamed:key]
            }
        }
    }
}

- (void)setBlocksController:(CPArrayController)blocksController
{
    [_view setDelegate:self];
    _blocksController = blocksController;
    [_blocksController addObserver:self forKeyPath:"arrangedObjects" options:nil context:nil];
}

- (void)observeValueForKeyPath:(CPString)keyPath ofObject:(id)object change:(id)change context:(id)context
{
    if (object == _blocksController)
    {
        [_view unbind:"dataObjects"];
        [_view unbind:"selectionIndexes"];

        _screenController = [CPArrayController new];

        [self setupBlocksView];

        [_view bind:"selectionIndexes" toObject:_screenController withKeyPath:"selectionIndexes" options:nil]
        [_view bind:"dataObjects"      toObject:_screenController withKeyPath:"arrangedObjects" options:nil]
    }
}

@end
