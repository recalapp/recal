//
//  Course.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import "ServerObject.h"

@class Section, Semester;

@interface Course : ServerObject

@property (nonatomic, retain) NSString * title;
@property (nonatomic, retain) NSString * desc;
@property (nonatomic, retain) NSString * professor;
@property (nonatomic, retain) NSString * registrarID;
@property (nonatomic, retain) NSString * courseListings;
@property (nonatomic, retain) Semester *semester;
@property (nonatomic, retain) NSSet *sections;
@end

@interface Course (CoreDataGeneratedAccessors)

- (void)addSectionsObject:(Section *)value;
- (void)removeSectionsObject:(Section *)value;
- (void)addSections:(NSSet *)values;
- (void)removeSections:(NSSet *)values;

@end
