//
//  Event.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class EventGroup, EventRevision;

@interface Event : NSManagedObject

@property (nonatomic, retain) EventGroup *eventGroup;
@property (nonatomic, retain) NSSet *revisions;
@end

@interface Event (CoreDataGeneratedAccessors)

- (void)addRevisionsObject:(EventRevision *)value;
- (void)removeRevisionsObject:(EventRevision *)value;
- (void)addRevisions:(NSSet *)values;
- (void)removeRevisions:(NSSet *)values;

@end
