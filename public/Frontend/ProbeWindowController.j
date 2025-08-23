@implementation ProbeWindowController : CPWindowController
{
    CPImageView _imageView;
    id _block;
    id _inputUUID;
}

- (id)initWithBlock:(id)aBlock andInputUUID:(id)anInputUUID
{
    if (self = [super init])
    {
        _block = aBlock;
        _inputUUID = anInputUUID;
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

        [_block addObserver:self forKeyPath:@"outputImage" options:CPKeyValueObservingOptionNew context:nil];
        [_block addObserver:self forKeyPath:@"name" options:CPKeyValueObservingOptionNew context:nil];
    }
    return self;
}

- (void)dealloc
{
    [_block removeObserver:self forKeyPath:@"outputImage"];
    [_block removeObserver:self forKeyPath:@"name"];
    [super dealloc];
}

- (void)observeValueForKeyPath:(NSString)keyPath ofObject:(id)object change:(NSDictionary)change context:(void)context
{
    if ([keyPath isEqualToString:@"outputImage"])
        [self updateImage];
    else if ([keyPath isEqualToString:@"name"])
        [self _updateTitle];
}

- (void)updateImage
{
    if (!_inputUUID)
        return;

    var imageURL = "/VIPS/block/" + [_block ID] + "/image/" + _inputUUID;
    var image = [[CPImage alloc] initWithContentsOfFile:imageURL];
    [_imageView setImage:image];
}

- (void)_updateTitle
{
    [[self window] setTitle:[_block valueForKey:"display_name"] + " (" + [_block valueForKey:"id"] + ")"];
}

- (void)windowWillClose:(CPNotification)aNotification
{
    [[CPApp delegate] removeProbeController:self];
}

@end
