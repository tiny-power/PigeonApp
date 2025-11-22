#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import "AdSDKManager.h"
#import "PPVC.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"PigeonApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // iOS 13以下版本在这里调用PPVC
   [PPVC showSDKManagementWithAgreementCallback:^{//Demo首次启动展示隐私政策弹窗，可选实际是否需要根据您的产品需求来决定是否显示

       //开屏广告展示启动图
       [[AdSDKManager sharedManager] addLaunchLoadingView];
       //初始化SDK，必须接入，在非欧盟地区发行的应用，需要用此方法初始化SDK接入，欧盟地区初始化替换为[[AdSDKManager sharedManager] initSDK_EU:];
       [[AdSDKManager sharedManager] initSDK];
       //初始化广告SDK完成
       
       //加载开屏广告
       [[AdSDKManager sharedManager] loadSplashAdWithPlacementID:FirstAppOpen_PlacementID result:^(BOOL isSuccess) {
           //加载成功
           if (isSuccess) {
               //展示开屏广告
               [[AdSDKManager sharedManager] showSplashWithPlacementID:FirstAppOpen_PlacementID];
           }
       }];
   }];
 
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
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
