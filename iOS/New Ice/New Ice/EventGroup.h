//
//  EventGroup.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import "ServerObject.h"

@class Event, EventGroupRevision, Section;

@interface EventGroup : ServerObject

@property (nonatomic, retain) Section *section;
@property (nonatomic, retain) NSSet *revisions;
@property (nonatomic, retain) NSSet *events;
@end

@interface EventGroup (CoreDataGeneratedAccessors)

- (void)addRevisionsObject:(EventGroupRevision *)value;
- (void)removeRevisionsObject:(EventGroupRevision *)value;
- (void)addRevisions:(NSSet *)values;
- (void)removeRevisions:(NSSet *)values;

- (void)addEventsObject:(Event *)value;
- (void)removeEventsObject:(Event *)value;
- (void)addEvents:(NSSet *)values;
- (void)removeEvents:(NSSet *)values;

@end
