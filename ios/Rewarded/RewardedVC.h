#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface RewardedVC : UIViewController <RCTBridgeModule>
@property (nonatomic, assign) NSInteger retryAttempt;
@end
