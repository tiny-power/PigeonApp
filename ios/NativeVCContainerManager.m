#import <React/RCTViewManager.h>
#import "NativeVCContainer.h"

@interface NativeVCContainerManager : RCTViewManager
@end

@implementation NativeVCContainerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[NativeVCContainer alloc] init];
}

@end
