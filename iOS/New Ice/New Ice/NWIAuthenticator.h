//
//  NWIAuthenticator.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>

@protocol NWIAuthenticationViewControllerDelegate;

@interface NWIAuthenticator : NSObject<NWIAuthenticationViewControllerDelegate>

-(BOOL)authenticated;
-(void)showAuthenticationViewIfNeeded;

@end
