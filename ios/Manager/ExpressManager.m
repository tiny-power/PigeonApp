#import <React/RCTViewManager.h>
#import "ExpressVC.h"

@interface ExpressManager : RCTViewManager
@end

@implementation ExpressManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[ExpressVC alloc] init].view;
}

@end
