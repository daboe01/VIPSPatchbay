/*
 * SimpleImageViewCollectionItem.j
 * VIPS Patchbay
 *
 * A custom CPCollectionViewItem that knows how to display an image
 * object with a name and a thumbnail. It handles its own view updates
 * and asynchronous image loading.
 */
@import <AppKit/CPCollectionViewItem.j>

@implementation SimpleImageViewCollectionItem : CPCollectionViewItem
{
    // These will be references to the subviews within our item's view.
    CPImageView _imageView;
    CPTextField _textField;
}

// setView: is called automatically by the collection view after it
// creates an instance of this class and assigns it a view from the prototype.
// This is the ideal place to get references to our subviews.
- (void)setView:(CPView)aView
{
    [super setView:aView];

    if (aView) {
        _imageView = [aView viewWithTag:1];
        _textField = [aView viewWithTag:2];
        // We call updateView here in case the representedObject was set *before* the view.
        [self _updateViewContents];
    } else {
        _imageView = nil;
        _textField = nil;
    }
}

// setRepresentedObject: is called automatically by the collection view
// when it binds a data object to this item.
- (void)setRepresentedObject:(id)anObject
{
    [super setRepresentedObject:anObject];

    // Only try to update the view if it has already been loaded.
    if ([self view]) {
        [self _updateViewContents];
    }
}

// This private helper method contains the actual logic to populate the views.
- (void)_updateViewContents
{
    var dataObject = [self representedObject];

    if (dataObject && _imageView) {
        // Populate the text field synchronously
        [_textField setStringValue:[dataObject valueForKey:@"name"]];

        // --- Asynchronous Image Loading ---
        var imageURL = [CPURL URLWithString:[dataObject valueForKey:@"url"]];
        var request = [CPURLRequest requestWithURL:imageURL cachePolicy:CPURLRequestReturnCacheDataElseLoad timeoutInterval:60.0];

        // Clear the old image while the new one loads
        [_imageView setImage:nil];

        [CPURLConnection sendAsynchronousRequest:request queue:[CPOperationQueue mainQueue]
            completionHandler:function(response, data, error) {
                // IMPORTANT: Check if the representedObject hasn't changed while we were loading.
                // This prevents a slow-loading image from overwriting a newer one if the user scrolls quickly.
                if ([self representedObject] === dataObject) {
                    if (!error && data) {
                        var image = [[CPImage alloc] initWithData:data];
                        [_imageView setImage:image];
                    }
                }
            }
        ];
    } else if (_imageView) {
        // Clear the views if there's no data object
        [_textField setStringValue:@""];
        [_imageView setImage:nil];
    }
}

@end