/*
 * InspectorController.j
 * VIPS Patchbay
 *
 * Created by Daniel Boehringer in August, 2025.
 * Copyright 2025, All rights reserved.
 */

@import <Foundation/CPObject.j>
@import <Renaissance/Renaissance.j>

// Keep all the formatters and custom sliders from your provided code
@implementation ReversePercentageFormatter : CPFormatter
- (CPString)stringForObjectValue:(id)theObject { return [theObject isKindOfClass:CPString] ? [theObject stringByAppendingString:"%"] : [[theObject stringValue] stringByAppendingString:"%"]; }
- (id)objectValueForString:(CPString)aString { return [aString stringByReplacingOccurrencesOfString:"%" withString:""]; }
@end

@implementation IntegerFormatter : CPFormatter
- (CPString)stringForObjectValue:(id)theObject { return [theObject stringValue]; }
- (id)objectValueForString:(CPString)aString { return parseInt(aString, 10); }
@end

@implementation FloatFormatter : CPFormatter
- (CPString)stringForObjectValue:(id)theObject { return [theObject stringValue]; }
- (id)objectValueForString:(CPString)aString { return Number(aString).toFixed(3); }
@end

@implementation OptionSlider: CPSlider
- (void)mouseDown:(CPEvent)anEvent { [self setContinuous: ![anEvent modifierFlags]]; [super mouseDown: anEvent]; }
@end

// The GSMarkupTag definitions are crucial for the dynamic markup to work.
@implementation GSMarkupTagOptionSlider:GSMarkupTagSlider
+(CPString) tagName { return @"optionSlider"; }
+(Class) platformObjectClass { return [OptionSlider class]; }
@end

// Controller for the unified settings inspector panel
@implementation InspectorController : CPObject
{
    id _panel;
    id _project;
    id _inspectorDataController;  // A single ArrayController for our one data object
    id _combinedDataObject;       // The single, flat dictionary holding all parameters
    id _stagingView;              // The top-level view with all generated controls
}

- (id)initWithProject:(id)aProject
{
    if (!(self = [self init])) return nil;

    _project = aProject;

    // === Step 1: Create the single data model ===

    _inspectorDataController = [CPArrayController new];
    _combinedDataObject = [CPMutableDictionary dictionary];
    // This object doesn't correspond to a DB entity, so we give it a dummy ID
    [_combinedDataObject setObject:@"1" forKey:@"id"];


    var blocks = [_project valueForKey:@"blocks"];
    var settingsBlocks = [blocks filteredArrayUsingPredicate:[CPPredicate predicateWithFormat:@"block_type.gui_xml != NULL AND block_type.gui_xml != ''"]];

    // Sort the blocks by their ID to ensure a stable order
    var sortDescriptor = [CPSortDescriptor sortDescriptorWithKey:@"id" ascending:YES];
    settingsBlocks = [settingsBlocks sortedArrayUsingDescriptors:[sortDescriptor]];

    // === Step 2: Populate the flat data dictionary and build the master XML string ===
    var markupContent = '';

    for (var i = 0; i < [settingsBlocks count]; i++)
    {
        var block = [settingsBlocks objectAtIndex:i];
        var blockId = [block valueForKey:'id'];
        var blockName = [block valueForKeyPath:'block_type.display_name'];
        var gui_xml = [block valueForKeyPath:'block_type.gui_xml'];

        // A. Populate the _combinedDataObject
        var settingsJSON = JSON.parse([block valueForKey:@"output_value"] || '{}');
        for (var key in settingsJSON) {
            if (settingsJSON.hasOwnProperty(key)) {
                var newKey = key + "@" + blockId; // Create the unique key, e.g., "sigma@104"
                [_combinedDataObject setObject:settingsJSON[key] forKey:newKey];
            }
        }

        // B. Add this block's GUI definition to our master string
        markupContent += '<label halign="left">' + blockName + ' (id: ' + blockId + ')</label>';

        // C. Transform 'column' attributes to bind to the unique key in our flat dictionary
        var bindingPrefix = '_inspectorDataController.selection.';
        // This regex replacement is more robust than a simple string replace.
        // It finds 'column="xyz"' and replaces it with a full binding to 'xyz@blockId'.

        var processed_xml = (gui_xml + '').replace(/column="([^"]+)"/g, 'valueBinding="#CPOwner.' + bindingPrefix + '$1@' + blockId + '"');
        markupContent += processed_xml;
        markupContent += '<divider/>';
    }

    // Add the populated data object to its controller
    [_inspectorDataController addObject:_combinedDataObject];

    // === Step 3: Create the staging view from the accumulated markup ===
    // All widgets are loaded at once into a container view that is not yet attached to any window.
    var finalMarkup = '<?xml version="1.0"?> <!DOCTYPE gsmarkup> <gsmarkup> <objects> <vbox halign="expand" width="350" id="widgets">' + markupContent +
    '</vbox> </objects> <connectors> <outlet source="#CPOwner" target="widgets" label="_stagingView"/> </connectors></gsmarkup>';

    [CPBundle loadGSMarkupData:[CPData dataWithRawString:finalMarkup]
             externalNameTable:[CPDictionary dictionaryWithObject:self forKey:"CPOwner"]
       localizableStringsTable:nil inBundle:nil tagMapping:nil];


    // === Step 4: Build the inspector window and its chrome ===
    _panel = [[CPWindow alloc] initWithContentRect:CGRectMake(200, 50, 400, 700) styleMask:CPTitledWindowMask | CPClosableWindowMask | CPResizableWindowMask];
    [_panel setTitle:"Inspector for: " + [_project valueForKey:"name"]];

    var mainVBox = [[CPView alloc] initWithFrame:[[_panel contentView] bounds]];
    [mainVBox setAutoresizingMask:CPViewWidthSizable | CPViewHeightSizable];
    [[_panel contentView] addSubview:mainVBox];

    var scrollView = [[CPScrollView alloc] initWithFrame:CGRectMake(0, 30, [_panel frame].size.width, [_panel frame].size.height - 30)];
    [scrollView setAutoresizingMask:CPViewWidthSizable | CPViewHeightSizable];
    [mainVBox addSubview:scrollView];

    var saveButton = [[CPButton alloc] initWithFrame:CGRectMake(10, 5, 120, 24)];
    [saveButton setTitle:"Save & Apply"];
    [saveButton setTarget:self];
    [saveButton setAction:@selector(saveAndApplyChanges:)];
    [mainVBox addSubview:saveButton];

    // === Step 5: Place the staging view into the scroll view ===
    // Only now is the fully populated view added to the window's hierarchy.
    if (_stagingView) {
        var view = [[CPView alloc] initWithFrame:CGRectMake(0, 0, 400, [_stagingView frame].size.height)];
        [view setAutoresizingMask:CPViewWidthSizable];
        [view setAutoresizesSubviews:YES];
        [view addSubview:_stagingView];
        [scrollView setDocumentView:view];
    }

    return self;
}

- (void)saveAndApplyChanges:(id)sender
{
    // This method deconstructs the flat dictionary and applies the changes
    // back to the individual block objects.

    var changesByBlockId = {};

    // 1. Group all changes by their block ID using the correct iteration method
    var allKeys = [_combinedDataObject allKeys];
    for (var i = 0; i < [allKeys count]; i++) {
        var key = [allKeys objectAtIndex:i];

        if ([key containsString:'@']) {
            var parts = [key componentsSeparatedByString:'@'];
            var paramName = parts[0];
            var blockId = parts[1];
            var value = [_combinedDataObject objectForKey:key];

            if (!changesByBlockId[blockId]) {
                changesByBlockId[blockId] = {};
            }
            changesByBlockId[blockId][paramName] = value;
        }
    }

    // 2. Apply the grouped changes to each block
    var allBlocks = [_project valueForKey:@"blocks"];
    for (var blockId in changesByBlockId) {
        if (changesByBlockId.hasOwnProperty(blockId)) {
            var blockChanges = changesByBlockId[blockId];
            var predicate = [CPPredicate predicateWithFormat:@"id == %@", blockId];
            var targetBlock = [[allBlocks filteredArrayUsingPredicate:predicate] lastObject];

            if (targetBlock) {
                var currentSettings = JSON.parse([targetBlock valueForKey:@"output_value"] || '{}');
                // Merge the new changes into the existing settings
                for (var paramName in blockChanges) {
                    if (blockChanges.hasOwnProperty(paramName)) {
                        currentSettings[paramName] = blockChanges[paramName];
                    }
                }

                [targetBlock setValue:JSON.stringify(currentSettings) forKey:@"output_value"];
            }
        }
    }

    // [[TNGrowlCenter defaultCenter] pushNotificationWithTitle:"Saved" message:"Inspector changes have been saved."];
    // rerun to give user feedback
    [CPApp._delegate run:nil];
}

- (void)showWindow:(id)sender
{
    [_panel makeKeyAndOrderFront:sender];
}

@end
