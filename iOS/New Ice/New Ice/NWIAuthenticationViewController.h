//
//  NWIAuthenticationViewController.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <UIKit/UIKit.h>

@class NWIAuthenticator;

@protocol NWIAuthenticationViewControllerDelegate;


@interface NWIAuthenticationViewController : UIViewController <UIWebViewDelegate>

@property (nonatomic, weak) id<NWIAuthenticationViewControllerDelegate> authDelegate;

@end

@protocol NWIAuthenticationViewControllerDelegate <NSObject>

-(BOOL)authenticationViewController:(NWIAuthenticationViewController *)authVC didLoginWithUserName:(NSString *)userName;

@end