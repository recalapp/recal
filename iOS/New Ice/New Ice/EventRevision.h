//
//  EventRevision.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class Event, User;

@interface EventRevision : NSManagedObject

@property (nonatomic, retain) NSString * eventTitle;
@property (nonatomic, retain) NSString * eventType;
@property (nonatomic, retain) NSDate * eventStart;
@property (nonatomic, retain) NSDate * eventEnd;
@property (nonatomic, retain) NSString * eventDescription;
@property (nonatomic, retain) NSString * eventLocation;
@property (nonatomic, retain) NSDate * modifiedTime;
@property (nonatomic, retain) NSNumber * approved;
@property (nonatomic, retain) Event *event;
@property (nonatomic, retain) User *modifiedUser;

@end
