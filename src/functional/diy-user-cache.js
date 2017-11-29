/**
 * Component to map user IDs to user names.
 * When the 'uid' property is set, the component checks the cache if the user
 * name for the ID is already available. If not, it requests the name from the
 * Firestore. Once a name is available, the 'name' property is set.
 *
 * Usage:
 *   <diy-user-cache uid="[[userId]]" name="{{userName}}" />
 */
class DiyUserCache extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-user-cache';
  }

  static get properties() {
    return {
      uid: {
        type: String,
        observer: 'onUidChanged_',
      },
      name: {
        type: String,
        notify: true,
      },
      userCache: {
        type: Object,
        statePath: 'userCache',
        observer: 'onUserCacheChanged_',
      }
    };
  }

  onUidChanged_(uid) {
    const cache = this.getState().userCache;
    if (!cache) {
      console.error('User cache not available!');
      return;
    }

    // Check if the ID is already in the Redux store.
    if (cache[uid]) {
      this.set('name', cache[uid]);
      return;
    }

    // Check if the name has already been requested.
    // The 'null' value is used to indicate that a request is already made.
    if (cache[uid] === null) {
      return;
    }

    // Mark the user ID as being requested.
    this.dispatch('cacheUser', { uid, name: null });

    // Request the user name from the
    this.$.firebaseStore.getUserDoc(uid)
        .then(snapshot => {
          let name = '(unknown)';
          if (snapshot && snapshot.exists && snapshot.data().name) {
            name = snapshot.data().name;
          }
          this.dispatch('cacheUser', { uid, name });
          return snapshot;
        })
        .catch(error => {
          console.warn('Error loading user name: ' + error.message);
          this.dispatch('cacheUser', { uid, name: '(error)' });
        });
  }

  onUserCacheChanged_(cache) {
    if (!this.name && this.uid && cache[this.uid]) {
      this.set('name', cache[this.uid]);
    }
  }
}

customElements.define(DiyUserCache.is, DiyUserCache);
