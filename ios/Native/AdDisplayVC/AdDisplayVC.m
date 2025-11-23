#import "AdDisplayVC.h"

@interface AdDisplayVC ()

@property (nonatomic, weak) ATNativeADView *adView;
@property (nonatomic, strong) UIButton *voiceChange;
@property (nonatomic, strong) UIButton *voiceProgress;
@property (nonatomic, strong) UIButton *voicePause;
@property (nonatomic, strong) UIButton *voicePlay;
@property(nonatomic, assign) BOOL mute;
@property(nonatomic, assign) BOOL isPlaying;
@property(nonatomic, strong) ATNativeAdOffer *adOffer;
@property (assign, nonatomic) CGSize adSize;

@end

@implementation AdDisplayVC

- (instancetype)initWithAdView:(ATNativeADView *)adView offer:(ATNativeAdOffer *)offer adViewSize:(CGSize)size {
    if (self = [super init]) {
        _adOffer = offer;
        _adView = adView;
        _adSize = size;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
  self.view.backgroundColor = [UIColor colorWithRed:0.2 green:0.4 blue:0.9 alpha:1];

  UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(20, 120, 250, 40)];
  label.text = @"这是 Objective-C 原生 asd";
  label.textColor = UIColor.whiteColor;
  [self.view addSubview:label];
  [self.view addSubview:self.adView];
     
}
 
@end
