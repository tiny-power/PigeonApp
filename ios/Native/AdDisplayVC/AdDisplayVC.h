#import "BannerVC.h"

#import <AnyThinkNative/AnyThinkNative.h>
 
@interface AdDisplayVC : UIViewController

- (instancetype)initWithAdView:(ATNativeADView *)adView offer:(ATNativeAdOffer *)offer adViewSize:(CGSize)size;

@end
