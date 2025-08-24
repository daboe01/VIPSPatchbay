@implementation ProbeWindowController : CPWindowController
{
    CPImageView _imageView;
    id _block;
}

- (id)initWithBlock:(id)aBlock
{
    if (self = [super init])
    {
        _block = aBlock;
        var rect = CGRectMake(0, 0, 256, 256);
        
        var window = [[CPPanel alloc] initWithContentRect:rect styleMask:CPHUDBackgroundWindowMask | CPTitledWindowMask | CPClosableWindowMask];
        [window setReleasedWhenClosed:YES];
        [window setDelegate:self];
        [self setWindow:window];

        _imageView = [[CPImageView alloc] initWithFrame:rect];
        [_imageView setImageScaling:CPImageScaleProportionallyUpOrDown];
        [window setContentView:_imageView];
        
        [self updateImage];
        [self _updateTitle];
    }
    return self;
}

- (void)updateImage
{
    var imageURL = "/VIPS/block/" + [_block valueForKey:"id"] + "/image/" + "?cachebuster=" + Math.floor(Math.random() * 10000);
    var image = [[CPImage alloc] initWithContentsOfFile:imageURL];
    [_imageView setImage:image];
}

- (void)_updateTitle
{
    [[self window] setTitle:[_block valueForKeyPath:"block_type.display_name"] + " (" + [_block valueForKey:"id"] + ")"];
}

- (void)windowWillClose:(CPNotification)aNotification
{
    [[CPApp delegate] removeProbeController:self];
}

@end
