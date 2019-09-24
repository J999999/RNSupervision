//
//  RNFileSelector.m
//  JQSupervision
//
//  Created by 张煜 on 2019/9/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RNFileSelector.h"

@implementation RNFileSelector
@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(Show: (nonnull NSDictionary *)props
                  onDone: (RCTResponseSenderBlock)onDone
                  onCancel: (RCTResponseSenderBlock)onCancel){
  dispatch_async(dispatch_get_main_queue(), ^{
    NSArray *fileter = [props objectForKey:@"filter"];
    NSNumber *filterDirectories = [props objectForKey: @"filterDirectories"];
    NSString *path = [props objectForKey: @"path"];
    NSNumber *hiddenFiles = [props objectForKey: @"hiddenFiles"];
    NSNumber *closeMenu = [props objectForKey: @"closeMenu"];
    NSString *title = [props objectForKey: @"title"];
    NSNumber *editable = [props objectForKey: @"editable"];
    
    NSURL *url = nil;
    if ([path length] > 0) url = [NSURL URLWithString: path];
    
    id<UIApplicationDelegate> app = [[UIApplication sharedApplication] delegate];
    FileBrowser *fileBrowser = [[FileBrowser alloc] initWithInitialPath: url allowEditing: [editable boolValue] showCancelButton: [closeMenu boolValue]];
    [fileBrowser setDidSelectFile:^(FBFile * _Nonnull file) {
      NSDictionary *dic = @{@"name": file.displayName, @"path": [file.filePath absoluteString]};
      onDone(@[dic]);
    }];
    
    NSMutableArray *filterExtensions = [[NSMutableArray alloc] init];
    for (int i = 0;i < fileter.count; i++) {
      [filterExtensions addObject: [fileter objectAtIndex: i]];
    }
    
    [fileBrowser setExcludesFileExtensions: filterExtensions];
    
    [((UINavigationController*) app.window.rootViewController) presentViewController:fileBrowser animated:YES completion:nil];
  });
}


@end
