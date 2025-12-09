#import <Security/Security.h>
#import "RewardedVC.h"
#import <AnyThinkSDK/AnyThinkSDK.h>
#import <AnyThinkRewardedVideo/AnyThinkRewardedVideo.h>

@interface RewardedVC () <ATRewardedVideoDelegate>

@property (nonatomic, assign) NSInteger retryAttempt;

@end

@implementation RewardedVC

  
RCT_EXPORT_MODULE()

//广告位ID
#define RewardedPlacementID @"b6913031b968b7"

//场景ID，可选，可在后台生成。没有可传入空字符串
#define RewardedSceneID @""

  
- (NSArray *)supportedEvents {
  return @[@"rewarded"];
}

//RCT_EXPORT_METHOD(testPrint:(NSString *)name resolver:(RCTPromiseResolveBlock)resolve
//                  rejecter:(RCTPromiseRejectBlock)reject) {
//    NSLog(@"%@", name);
//    NSInteger eventId = 123;
//    [self sendEventWithName:@"wert" body:@{@"name": @"wert"}];
//    resolve(@(eventId));
//}

RCT_EXPORT_METHOD(loadAd) {
    NSLog(@"点击了加载广告");
    NSMutableDictionary * loadConfigDict = [NSMutableDictionary dictionary];
    // 可选接入，以下几个key参数适用于广告平台的服务端激励验证，将被透传
    [loadConfigDict setValue:@"media_val_RewardedVC" forKey:kATAdLoadingExtraMediaExtraKey];
    NSUUID *uuid = [[UIDevice currentDevice] identifierForVendor];
    NSString *uniqueIdentifier = uuid.UUIDString;
    NSLog(@"uniqueIdentifier: %@", uniqueIdentifier);
    [loadConfigDict setValue:@"rv_test_user_id" forKey:kATAdLoadingExtraUserIDKey];
    [loadConfigDict setValue:@"reward_Name" forKey:kATAdLoadingExtraRewardNameKey];
    [loadConfigDict setValue:@3 forKey:kATAdLoadingExtraRewardAmountKey];
 
    //(可选接入)如果使用了游可赢(Klevin)广告平台，可添加以下配置
    //[AdLoadConfigTool rewarded_loadExtraConfigAppend_Klevin:loadConfigDict];
    
    //(可选接入)若开启共享广告位，对其进行相关设置
    //[AdLoadConfigTool setInterstitialSharePlacementConfig:loadConfigDict];
    
    [[ATAdManager sharedManager] loadADWithPlacementID:RewardedPlacementID extra:loadConfigDict delegate:self];
}

/// 展示广告按钮被点击
RCT_EXPORT_METHOD(showAd) {
  dispatch_async(dispatch_get_main_queue(), ^{
    //场景统计功能(可选接入)
    //[[ATAdManager sharedManager] entryRewardedVideoScenarioWithPlacementID:RewardedPlacementID scene:RewardedSceneID];
    
    //    //查询可用于展示的广告缓存(可选接入)
    //    NSArray <NSDictionary *> * adCaches = [[ATAdManager sharedManager] getRewardedVideoValidAdsForPlacementID:RewardedPlacementID];
    //    ATDemoLog(@"getValidAds : %@",adCaches);
    //
    //    //查询广告加载状态(可选接入)
    //    ATCheckLoadModel * status = [[ATAdManager sharedManager] checkRewardedVideoLoadStatusForPlacementID:RewardedPlacementID];
    //    ATDemoLog(@"checkLoadStatus : %d",status.isLoading);
    //
    //检查是否有就绪
    if (![[ATAdManager sharedManager] rewardedVideoReadyForPlacementID:RewardedPlacementID]) {
      [self loadAd];
      return;
    }
    
    //展示配置，Scene传入后台的场景ID，没有可传入空字符串，showCustomExt参数可传入自定义参数字符串
    ATShowConfig *config = [[ATShowConfig alloc] initWithScene:RewardedSceneID showCustomExt:@"testShowCustomExt"];
    
    UIViewController *rootVC = [UIApplication sharedApplication].delegate.window.rootViewController;
    [[rootVC.view viewWithTag:1] removeFromSuperview];
    [[rootVC.view viewWithTag:2] removeFromSuperview];
    //展示广告
    [[ATAdManager sharedManager] showRewardedVideoWithPlacementID:RewardedPlacementID config:config inViewController:rootVC delegate:self];
  });
}

/// 广告位加载完成
/// - Parameter placementID: 广告位ID
- (void)didFinishLoadingADWithPlacementID:(NSString *)placementID {
    BOOL isReady = [[ATAdManager sharedManager] rewardedVideoReadyForPlacementID:placementID];
    NSLog(@"didFinishLoadingADWithPlacementID:%@ Rewarded 是否准备好:%@", placementID,isReady ? @"YES":@"NO");
    // 重置重试次数
    self.retryAttempt = 0;
}
 
/// 广告位加载失败
/// - Parameters:
///   - placementID: 广告位ID
///   - error: 错误信息
- (void)didFailToLoadADWithPlacementID:(NSString *)placementID error:(NSError *)error {
    NSLog(@"didFailToLoadADWithPlacementID:%@ error:%@", placementID, error);
    // 重试已达到 3 次，不再重试加载
    if (self.retryAttempt >= 3) {
       return;
    }
    self.retryAttempt++;
    // Calculate delay time: power of 2, maximum 8 seconds
    NSInteger delaySec = pow(2, MIN(3, self.retryAttempt));

    // Delayed retry loading ad
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, delaySec * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        [self loadAd];
    });
}

/// 获得展示收益
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)didRevenueForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra {
    NSLog(@"didRevenueForPlacementID:%@ with extra: %@", placementID,extra);
    
}

/// 激励成功
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)rewardedVideoDidRewardSuccessForPlacemenID:(NSString *)placementID extra:(NSDictionary *)extra {
  NSLog(@"rewardedVideoDidRewardSuccessForPlacemenID:%@ extra:%@",placementID,extra);
  NSString *uniqueID = getDeviceUUID();
  [self sendEventWithName:@"rewarded" body:@{@"idfv": uniqueID}];
}

NSString* getDeviceUUID() {
    NSString *service = @"com.tinybrief.app.pigeon.deviceuuid";
    NSString *account = @"uuid";

    // 1. 先从 Keychain 读取
    NSDictionary *query = @{
        (__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
        (__bridge id)kSecAttrService: service,
        (__bridge id)kSecAttrAccount: account,
        (__bridge id)kSecReturnData: @YES
    };
    
    CFTypeRef dataRef = NULL;
    if (SecItemCopyMatching((__bridge CFDictionaryRef)query, &dataRef) == errSecSuccess) {
        NSData *data = (__bridge NSData *)dataRef;
        return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    }

    // 2. 没有则创建一个新的 UUID 并写入 Keychain
    NSString *uuid = [[NSUUID UUID] UUIDString];
    NSData *uuidData = [uuid dataUsingEncoding:NSUTF8StringEncoding];

    NSDictionary *addQuery = @{
        (__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
        (__bridge id)kSecAttrService: service,
        (__bridge id)kSecAttrAccount: account,
        (__bridge id)kSecValueData: uuidData
    };

    SecItemAdd((__bridge CFDictionaryRef)addQuery, NULL);
    return uuid;
}


/// 激励广告视频开始播放
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)rewardedVideoDidStartPlayingForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoDidStartPlayingForPlacementID:%@ extra:%@", placementID, extra);
    
}
 
/// 激励广告视频播放完毕
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)rewardedVideoDidEndPlayingForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoDidEndPlayingForPlacementID:%@ extra:%@", placementID, extra);
}

/// 激励广告视频播放失败
/// - Parameters:
///   - placementID: 广告位ID
///   - error: 错误信息
///   - extra: 额外信息字典
- (void)rewardedVideoDidFailToPlayForPlacementID:(NSString*)placementID error:(NSError *)error extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoDidFailToPlayForPlacementID:%@ error:%@ extra:%@", placementID, error, extra);
    
    // 预加载
    [self loadAd];
}

/// 激励广告已关闭
/// - Parameters:
///   - placementID: 广告位ID
///   - rewarded: 是否已经激励成功，YES表示已经回调了激励成功
///   - extra: 额外信息字典
- (void)rewardedVideoDidCloseForPlacementID:(NSString *)placementID rewarded:(BOOL)rewarded extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoDidCloseForPlacementID:%@, rewarded:%@ extra:%@", placementID, rewarded ? @"yes" : @"no", extra);
    
    // 预加载
    [self loadAd];
}
 
/// 激励广告已点击
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)rewardedVideoDidClickForPlacementID:(NSString*)placementID extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoDidClickForPlacementID:%@ extra:%@", placementID, extra);
    
}

/// 激励广告已打开或跳转深链接页面
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 广告位ID
///   - success: 是否成功
- (void)rewardedVideoDidDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success {
    NSLog(@"rewardedVideoDidDeepLinkOrJumpForPlacementID:placementID:%@ with extra: %@, success:%@", placementID,extra, success ? @"YES" : @"NO");
    
}

/// 激励广告再看一个激励成功
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)rewardedVideoAgainDidRewardSuccessForPlacemenID:(NSString *)placementID extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoAgainDidRewardSuccessForPlacemenID:%@ extra:%@", placementID, extra);
}

/// 激励广告再看一个视频已开始播放
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)rewardedVideoAgainDidStartPlayingForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoAgainDidStartPlayingForPlacementID:%@ extra:%@", placementID, extra);
}

/// 激励广告再看一个视频播放完毕
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)rewardedVideoAgainDidEndPlayingForPlacementID:(NSString*)placementID extra:(NSDictionary*)extra {
    NSLog(@"rewardedVideoAgainDidEndPlayingForPlacementID:%@ extra:%@", placementID, extra);
}

/// 激励广告再看一个视频播放失败
/// - Parameters:
///   - placementID: 广告位ID
///   - error: 错误信息
///   - extra: 额外信息字典
- (void)rewardedVideoAgainDidFailToPlayForPlacementID:(NSString *)placementID error:(NSError *)error extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoAgainDidFailToPlayForPlacementID:%@ extra:%@", placementID, extra);
}

/// 激励广告再看一个已点击
/// - Parameters:
///   - placementID: 广告位ID
///   - extra: 额外信息字典
- (void)rewardedVideoAgainDidClickForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra {
    NSLog(@"rewardedVideoAgainDidClickForPlacementID:%@ extra:%@", placementID, extra);
}

@end
