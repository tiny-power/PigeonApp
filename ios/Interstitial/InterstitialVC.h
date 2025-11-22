#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface InterstitialVC : RCTEventEmitter <RCTBridgeModule>
@property (nonatomic, assign) NSInteger retryAttempt;
@end

