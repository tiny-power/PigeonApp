#import "MyViewController.h"

@interface MyViewController ()

@end

@implementation MyViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.view.backgroundColor = [UIColor colorWithRed:0.2 green:0.4 blue:0.9 alpha:1];

    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(20, 120, 250, 40)];
    label.text = @"这是 Objective-C 原生 UIViewController";
    label.textColor = UIColor.whiteColor;
    [self.view addSubview:label];
}

@end
