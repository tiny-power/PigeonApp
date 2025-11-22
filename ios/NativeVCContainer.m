#import "NativeVCContainer.h"
#import "MyViewController.h"

@implementation NativeVCContainer {
    UIViewController *_embeddedVC;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self embedVC];
    }
    return self;
}

- (instancetype)init {
    if (self = [super init]) {
        [self embedVC];
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    _embeddedVC.view.frame = self.bounds;
}

- (void)embedVC {

    if (_embeddedVC != nil) return;

    // 创建要嵌入的 VC
  MyViewController *vc = [MyViewController new];

    // 获取最顶层 VC 作为 parent
    UIViewController *rootVC = UIApplication.sharedApplication.keyWindow.rootViewController;
    if (!rootVC) return;

    [rootVC addChildViewController:vc];

    // 加入 UIView
    vc.view.frame = self.bounds;
    vc.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self addSubview:vc.view];

    [vc didMoveToParentViewController:rootVC];

    _embeddedVC = vc;
}

@end
