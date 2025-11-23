#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <AnyThinkNative/AnyThinkNative.h>

@interface ExpressVC : UIViewController <RCTBridgeModule>
@property (strong, nonatomic) ATNativeADView  * adView;
@property (nonatomic, strong) ATNativeAdOffer * nativeAdOffer;
// 重试次数计数器
@property (nonatomic, assign) NSInteger  retryAttempt;
@end
