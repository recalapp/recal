//
//  NWIAppDelegate.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <UIKit/UIKit.h>

@class NWIAuthenticator;

@interface NWIAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) NWIAuthenticator *authenticator;

@end
