//
//  EventGroupRevision.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class EventGroup, User;

@interface EventGroupRevision : NSManagedObject

@property (nonatomic, retain) NSDate * startDate;
@property (nonatomic, retain) NSDate * endDate;
@property (nonatomic, retain) NSDate * modifiedTime;
@property (nonatomic, retain) NSNumber * approved;
@property (nonatomic, retain) NSString * recurrenceDays;
@property (nonatomic, retain) NSNumber * recurrenceInterval;
@property (nonatomic, retain) EventGroup *eventGroup;
@property (nonatomic, retain) User *modifiedUser;

@end
