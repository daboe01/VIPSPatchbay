/*
 * Cappuccino frontend for PatchbayVIPS
 *
 * Created by daboe01 on Aug, 2025 by Daniel Boehringer.
 * Copyright 2025, All rights reserved.
 *
 * Todo:
 *       support required_format + display_name in blocks_catalogue
 *       change size for the imageviews in the collectionviews to the real image size on load (currently they are fixed 100x100px)
 *       support disabling / enabling of blocks via the context menu ("defaultMenu") (they are displayed grayed out in this case)
 *       support probe image windows (command in main menu). these windows can be connected to any block (control-dragging) and show the output image in realtime
 *       make inputController dependent on projectController
 *       support globals size slider for displaying the input and output images in the collectionviews
 *
 */



/////////////////////////////////////////////////////////

HostURL=""
BaseURL=HostURL+"/";

/////////////////////////////////////////////////////////

@import <Foundation/CPObject.j>
@import <Renaissance/Renaissance.j>
@import "TNGrowlCenter.j";
@import "TNGrowlView.j";
@import "LaceViewController.j";
@import "InspectorController.j";

@import <Cup/Cup.j>

@implementation SimpleImageViewCollectionItem : CPCollectionViewItem
{
    CPImageView _imageView;
}

- (void)imageDidFinishLoading:(CPImage)anImage
{
    var imageSize = [anImage size];
    if (imageSize.width > 0 && imageSize.height > 0) {
        [_imageView setFrameSize:imageSize];
        // We might need to tell the collection view to re-layout its items
        [[self collectionView] setNeedsLayout:YES];
    }
}

- (CPView)loadView
{
    if (!_imageView) {
        _imageView = [CPImageView new];
        [_imageView setImageScaling:CPScaleToFit];
    }
    
    [self setView:_imageView];

    var dataObject = [self representedObject];

    if (dataObject)
    {
        var imageURL = [dataObject valueForKey:@"url"];

        if (!imageURL)
            imageURL = "/VIPS/preview/" + [dataObject valueForKey:@"uuid"]; //+ "?w=100";

        var image = [[CPImage alloc] initWithContentsOfFile:imageURL];
        [image setDelegate:self];
        [_imageView setImage:image];

    }
    else
    {
        [_imageView setImage:nil];
    }

    return _imageView;
}

- (void)setRepresentedObject:(id)anObject
{
    [super setRepresentedObject:anObject];
    [self loadView];
}

@end

@implementation CGPTURLRequest : CPURLRequest

- (id)initWithURL:(CPURL)anURL cachePolicy:(CPURLRequestCachePolicy)aCachePolicy timeoutInterval:(CPTimeInterval)aTimeoutInterval
{
    if (self = [super initWithURL:anURL initWithURL:anURL cachePolicy:aCachePolicy timeoutInterval:aTimeoutInterval])
    {
        [self setValue:"3037" forHTTPHeaderField:"X-ARGOS-ROUTING"];
    }

    return self;
}

@end

@implementation SessionStore : FSStore 

- (CPURLRequest)requestForAddressingObjectsWithKey: aKey equallingValue: (id) someval inEntity:(FSEntity) someEntity
{
    var request = [CGPTURLRequest requestWithURL: [self baseURL]+"/"+[someEntity name]+"/"+aKey+"/"+someval];

    return request;
}
-(CPURLRequest) requestForInsertingObjectInEntity:(FSEntity) someEntity
{
    var request = [CPURLRequest requestWithURL: [self baseURL]+"/"+[someEntity name]+"/"+ [someEntity pk]];
    [request setHTTPMethod:"POST"];

    return request;
}

- (CPURLRequest)requestForFuzzilyAddressingObjectsWithKey: aKey equallingValue: (id) someval inEntity:(FSEntity) someEntity
{
    var request = [CGPTURLRequest requestWithURL: [self baseURL]+"/"+[someEntity name]+"/"+aKey+"/like/"+someval];

    return request;
}

- (CPURLRequest)requestForAddressingAllObjectsInEntity:(FSEntity) someEntity
{
    var request = [CGPTURLRequest requestWithURL: [self baseURL]+"/"+[someEntity name] ];

    return request;
}

@end

@implementation AppController : CPObject
{
    id  store @accessors;

    id  mainWindow;
    id  editWindow;
    id  addBlocksWindow;
    id  laceView;
    id  laceViewController;
    id  projectsController @accessors;
    id  inputController;
    id  outputController @accessors;
    id  blocksCatalogueController @accessors;
    id  blocksController @accessors;
    id  settingsController @accessors;
    id  blockIndex;
    id  connections;
    id  addBlocksPopover;
    id  editPopover;
    id  runConnection;
    id  outputImagesConnection;
    id  spinnerImg;

    // Upload properties
    id myCuploader;
    id queueController;
    id inspectorController;
}

- (void)flushGUI
{
    var fr = [[CPApp keyWindow] firstResponder];

    if ([fr respondsToSelector:@selector(_reverseSetBinding)])
        [fr _reverseSetBinding]; // flush any typed text before printing


    if ([fr isKindOfClass:CPDatePicker])
        [fr resignFirstResponder]; // important for the textual datepicker to work properly
}


-(void)setButtonBusy:(CPButton)myButton
{
    myButton._oldImage = [myButton image];
    [myButton setImage:spinnerImg];
    [myButton setValue:spinnerImg forThemeAttribute:@"image" inState:CPThemeStateDisabled];
    [myButton setEnabled:NO];
}
-(void)resetButtonBusy:(CPButton)myButton
{
    [myButton setImage:myButton._oldImage];
    [myButton setEnabled:YES];
}

- (void)performImportCSV:(id)sender suffix:(CPString)suffix
{
    var myreq = [CPURLRequest requestWithURL:"/LLM/import_embedding_dataset/" + [embeddedDatasetsController valueForKeyPath:"selection.id"] + suffix];
    [myreq setHTTPMethod:"POST"];
    [myreq setHTTPBody:[importCSVText stringValue]];
    [CPURLConnection connectionWithRequest:myreq delegate:nil];

    [importCSVText setString:'']; // fixme: better gui feedback
}

- (void)performImportCSV:(id)sender
{
    [self performImportCSV:sender suffix:""];
}

- (void)performImportCSVAppend:(id)sender
{
    [self performImportCSV:sender suffix:"?preserve=1"];
}

- (void)performImportCSVRemove:(id)sender
{
    [self performImportCSV:sender suffix:"?remove=1"];
}

-(void)openWindowWithURL:(CPString)myURL inWindowID:(CPString)myid
{
    // window.removeEventListener('beforeunload', beforeUnloadHandler);
    window.open(myURL, myid);
    // window.addEventListener('beforeunload', beforeUnloadHandler);
}

- (void)downloadDataset:(id)sender
{
    [self openWindowWithURL:'/LLM/get_data_from_dataset/' + [embeddedDatasetsController valueForKeyPath:'selection.name'] inWindowID:'download_window'];
}

- (void)run:(id)sender
{
    [self flushGUI];

    var selectedImage = [inputController selection];
    var selectedProject = [projectsController selection];

    if (!selectedImage) {
        [[TNGrowlCenter defaultCenter] pushNotificationWithTitle:"Error" message:"Please select an input image from the left panel." customIcon:TNGrowlIconError];
        return;
    }
    if (!selectedProject) {
        [[TNGrowlCenter defaultCenter] pushNotificationWithTitle:"Error" message:"Please select a pipeline to run." customIcon:TNGrowlIconError];
        return;
    }

    var payload =  @{
                        "idproject":  [selectedProject valueForKey:"id"],
                        "input_uuid": [selectedImage valueForKey:'uuid']
                    };

    // This is the corrected request logic
    setTimeout(function(){
        var myreq = [CPURLRequest requestWithURL:"/VIPS/run"];
        [myreq setHTTPMethod:"POST"];

        // Serialize the payload object to JSON and set it as the body
        [myreq setHTTPBody:[payload toJSON]];

        // Set the correct header so the backend knows to parse JSON
        [myreq setValue:"application/json" forHTTPHeaderField:"Content-Type"];

        runConnection = [CPURLConnection connectionWithRequest:myreq delegate:self];
        [self setButtonBusy:sender];
        runConnection._senderButton = sender;
    }, 250);
}

- (void)insertInput:(id)sender
{
    [inputController insert:sender]
    [inputWindow makeKeyAndOrderFront:sender]
    [inputText selectAll:sender]
}

- (void)removeInput:(id)sender
{
    [inputController remove:sender]
}

- (void)removeBlocks:(id)sender
{
    [laceViewController removeBlocks:sender]
}

- (void)addBlocks:(id)sender
{
    [laceViewController addBlocks:sender]
}

- (void)performAddBlocks:(id)sender
{
    [laceViewController performAddBlocks:sender]
}

- (void)reloadOutputImagesForProject:(id)aProject
{
    if (!aProject) {
        [outputController setContent:@[]];
        return;
    }

    var projectID = [aProject valueForKey:@"id"];
    var myreq = [CPURLRequest requestWithURL:"/VIPS/project/" + projectID + "/outputs"];
    outputImagesConnection = [CPURLConnection connectionWithRequest:myreq delegate:self];
}

- (void)observeValueForKeyPath:(CPString)keyPath ofObject:(id)object change:(CPDictionary)change context:(void)context
{
    if (object === projectsController && keyPath === @"selection") {
        [self reloadOutputImagesForProject:[projectsController selection]];
    }
}

- (void)connection:(CPConnection)someConnection didReceiveData:(CPData)data
{
    if (someConnection == runConnection)
    {
        if (someConnection._senderButton && [someConnection._senderButton isKindOfClass:CPButton])
            [self resetButtonBusy:someConnection._senderButton];

        // After a successful run, just reload the outputs for the current project.
        // The bindings will take care of updating the UI.
        [self reloadOutputImagesForProject:[projectsController selection]];
    }
    else if (someConnection == outputImagesConnection)
    {
        var images = JSON.parse(data);
        debugger
        [outputController setContent:images];
    }
}

- (void)showInspector:(id)sender
{
    var selectedProject = [projectsController selection];

    if (!selectedProject) {
        [[TNGrowlCenter defaultCenter] pushNotificationWithTitle:"Notice" message:"Please select a pipeline first."];
        return;
    }

    // Create a NEW instance of the inspector every time the button is clicked.
    // This ensures it's always up-to-date with the current blocks in the pipeline.
    _inspectorController = [[InspectorController alloc] initWithProject:selectedProject];
    // Tell the new controller to show its window.
    [_inspectorController showWindow:sender];
}

- (void)cup:(Cup)aCup uploadDidCompleteForFile:(CupFile)aFile
{
    // remove from list
    var indexes = [aCup.queue indexesOfObjectsPassingTest:function(file)
                   {
        return  file === aFile;
    }];
    [aCup.queue removeObjectsAtIndexes:indexes];
    [[aCup queueController] setContent:aCup.queue];
}

- (void)applicationDidFinishLaunching:(CPNotification)aNotification
{
    // Point the store to the new /VIPS endpoint
    store = [[SessionStore alloc] initWithBaseURL:HostURL+"/VIPS"];

    [CPBundle loadRessourceNamed:"model.gsmarkup" owner:self];
    [CPBundle loadRessourceNamed:"gui.gsmarkup" owner:self];
    spinnerImg = [[CPImage alloc] initWithContentsOfFile:[CPString stringWithFormat:@"%@%@", [[CPBundle mainBundle] resourcePath], "spinner.gif"]];

    // Initialize Uploader to the /VIPS/upload endpoint
    myCuploader = [[Cup alloc] initWithURL:BaseURL + "VIPS/upload"];
    queueController = [myCuploader queueController];
    // We can set the main window content as a drop target
    [myCuploader setDropTarget:[mainWindow contentView]];
    [myCuploader setAutoUpload:YES];
    [myCuploader setRemoveCompletedFiles:YES];
    [myCuploader setDelegate:self];

    [[TNGrowlCenter defaultCenter] setView:[[CPApp mainWindow] contentView]];
    [[TNGrowlCenter defaultCenter] setLifeDefaultTime:10];
    [[mainWindow contentView] setBackgroundColor:[CPColor colorWithWhite:0.95 alpha:1.0]];

    laceViewController = [LaceViewController new];
    [laceViewController setView:laceView];
    [laceViewController setBlocksController:blocksController];
    [laceViewController setSettingsController:settingsController];
    [laceViewController setEditWindow:editWindow];
    [laceViewController setAddBlocksView:[addBlocksWindow contentView]];

    [projectsController addObserver:self forKeyPath:@"selection" options:CPKeyValueObservingOptionNew context:NULL];
}

@end
