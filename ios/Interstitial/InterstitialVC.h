#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface InterstitialVC : UIViewController <RCTBridgeModule>
@property (nonatomic, assign) NSInteger retryAttempt;
@end

