//
//  NWIAuthenticationViewController.m
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import "NWIAuthenticationViewController.h"
#import "NWIAuthenticator.h"

@interface NWIAuthenticationViewController ()
@property (weak, nonatomic) IBOutlet UIWebView *webView;

@end

@implementation NWIAuthenticationViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://localhost:8000"]];
    [self.webView loadRequest:request];
    [self.webView setDelegate:self];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

-(void)webViewDidFinishLoad:(UIWebView *)webView
{
    NSString *netid = [webView stringByEvaluatingJavaScriptFromString:@"$.cookie('netid')"];
    if (netid)
    {
        if ([self.authDelegate authenticationViewController:self didLoginWithUserName:netid])
            [self dismissViewControllerAnimated:YES completion:nil];
    }
}

@end
