//
//  User.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class UserSectionTable;

@interface User : NSManagedObject

@property (nonatomic, retain) NSString * netid;
@property (nonatomic, retain) NSString * name;
@property (nonatomic, retain) NSDate * lastActivityTime;
@property (nonatomic, retain) NSSet *enrollment;
@end

@interface User (CoreDataGeneratedAccessors)

- (void)addEnrollmentObject:(UserSectionTable *)value;
- (void)removeEnrollmentObject:(UserSectionTable *)value;
- (void)addEnrollment:(NSSet *)values;
- (void)removeEnrollment:(NSSet *)values;

@end
