/*
 * InspectorController.j
 * VIPS Patchbay
 *
 * Created by Daniel Boehringer on October 30, 2024.
 * Adapted from user-provided CompoController.
 * Copyright 2024, All rights reserved.
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
    id _blockSettingsControllers; // A dictionary to hold controllers for each block's settings
}

- (id)initWithProject:(id)aProject
{
    if (!(self = [self init])) return nil;

    _project = aProject;
    _blockSettingsControllers = [CPMutableDictionary dictionary];

    var blocks = [_project valueForKey:@"blocks"];
    var settingsBlocks = [blocks filteredArrayUsingPredicate:[CPPredicate predicateWithFormat:@"block_type.gui_xml != NULL AND block_type.gui_xml != ''"]];

    // Step 1: Build the panel via dynamically generated markup
    var markup = '<?xml version="1.0"?><!DOCTYPE gsmarkup><gsmarkup><objects><window id="panel" title="Inspector" closable="yes" resizable="YES" x="800" y="50" width="400" height="700"><vbox><scrollView halign="expand" valign="expand" hasHorizontalScroller="NO"><vbox id="toplevel_container" halign="min" width="380">';

    for (var i = 0; i < [settingsBlocks count]; i++)
    {
        var block = [settingsBlocks objectAtIndex:i];
        var blockId = [block valueForKey:'id'];
        var blockName = [block valueForKeyPath:'block_type.name'];
        var gui_xml = [block valueForKeyPath:'block_type.gui_xml'];

        // Create a dedicated array controller for this block's settings
        var settingsController = [FSArrayController new];
        [settingsController setEntityName:@"settings"];
        [settingsController bind:CPContentBinding toObject:block withKeyPath:@"settings" options:nil];
        [_blockSettingsControllers setObject:settingsController forKey:blockId];

        markup += '<label halign="left" font="bold 14px Lucida Grande">' + blockName + ' (id: ' + blockId + ')</label>';
        // We inject a reference to our per-block controller into the binding path
        var processed_xml = [gui_xml stringByReplacingOccurrencesOfString:'valueBinding="#CPOwner.' withString:'valueBinding="#CPOwner._blockSettingsControllers.' + blockId + '.'];
        markup += processed_xml;
        markup += '<divider/>';
    }

    markup += '</vbox></scrollView></vbox></window></objects><connectors><outlet source="#CPOwner" target="panel" label="_panel"/></connectors></gsmarkup>';

    // Step 2: Load the generated markup
    [CPBundle loadGSMarkupData:[CPData dataWithRawString: markup] externalNameTable:[CPDictionary dictionaryWithObject:self forKey:"CPOwner"]
        localizableStringsTable: nil inBundle: nil tagMapping: nil];

    [_panel setTitle:"Inspector for: " + [_project valueForKey:"name"]];
    return self;
}

- (void)showWindow:(id)sender
{
    [_panel makeKeyAndOrderFront:sender];
}

@end
