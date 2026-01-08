#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import "AdSDKManager.h"
#import <AppTrackingTransparency/AppTrackingTransparency.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"PigeonApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  //开启日志
  [ATAPI setLogEnabled:YES];//Turn on debug logs

  //开启日志后，调用检查集成情况方法
  [ATAPI integrationChecking];
  [[AdSDKManager sharedManager] initSDK];
 
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}
- (void)applicationDidBecomeActive:(UIApplication *)application {
    if (@available(iOS 14, *)) {
        //iOS 14
        [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {

        }];
    }
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
