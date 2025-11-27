#import <React/RCTViewManager.h>
#import "BannerVC.h"

@interface BannerManager : RCTViewManager
@end

@implementation BannerManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[BannerVC alloc] init].view;
}

@end
