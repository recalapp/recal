//
//  NWIViewController.m
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import "NWIViewController.h"

@interface NWIViewController ()

@end

@implementation NWIViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
	// Do any additional setup after loading the view, typically from a nib.
}

- (void)viewDidAppear:(BOOL)animated
{
    [[NSNotificationCenter defaultCenter] postNotificationName:NOTIF_VIEW_VISIBLE object:self];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)launch:(UIButton *)sender {
}
@end
