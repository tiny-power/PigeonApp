#import <React/RCTViewManager.h>
#import "SelfRenderVC.h"

@interface SelfRenderManager : RCTViewManager
@end

@implementation SelfRenderManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[SelfRenderVC alloc] init].view;
}

@end

