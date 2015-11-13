    // When setting `submitted` field, automatically set `submittedAt` field
    FeedElements.before.update((userId, elem, fieldNames, modifier) => {
      if (modifier.$set.submitted) {
        modifier.$set.submittedAt = new Date();
      }
    });

    function getLastActivity(feedId) {
      const lastSubmittedElem = FeedElements.findOne(
        {
          feedId,
          submitted: true,
        },
        {
          sort: { submittedAt: -1 }
        }
      );

      return lastSubmittedElem ? lastSubmittedElem.submittedAt : null;
    }

    Meteor.publish('userFeeds', function({ userId }) {
      const elemsObservers = {};

      // Observe all user feeds
      var feedObserver = Feeds.find({ userId: userId }).observeChanges({
        added: (feedId, fields) => {
          // Observe feed elements of the feed
          elemsObservers[feedId] = FeedElements.find({ feedId }).observeChanges({
            changed: (elemId, fields) => {
              // Update `lastActivity` field when new element is submitted
              if (fields.submitted) {
                this.changed('feeds', feedId, { lastActivity: fields.submittedAt });
              }
            },
          });

          fields.lastActivity = getLastActivity(feedId);

          this.added('feeds', feedId, fields);
        },

        changed: (feedId, fields) => {
          this.changed('feeds', feedId, fields);
        },

        removed: (feedId) => {
          elemsObservers[feedId].stop();
          delete elemsObservers[feedId];

          this.removed('feeds', feedId);
        },
      });

      this.ready();

      this.onStop(function() {
        feedObserver.stop();

        for (const feedId in elemsObservers) {
          elemsObservers[feedId].stop();
        }
      });
    });
