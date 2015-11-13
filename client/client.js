Meteor.subscribe('userFeeds', { userId: 1 });

Template.Feeds.helpers({
  feeds() {
    return Feeds.find({ userId: this.userId });
  },
});

/*
Feeds.insert({ _id: 'feed1', userId: 1 });
Feeds.insert({ _id: 'feed2', userId: 1 });

FeedElements.insert({ _id: 'elem1', feedId: 'feed1' });
FeedElements.insert({ _id: 'elem2', feedId: 'feed1' });
FeedElements.insert({ _id: 'elem3', feedId: 'feed1' });
FeedElements.insert({ _id: 'elem4', feedId: 'feed2' });
FeedElements.insert({ _id: 'elem5', feedId: 'feed2' });

FeedElements.update('elem2', { $set: { submitted: true } });
FeedElements.update('elem5', { $set: { submitted: true } });
*/
