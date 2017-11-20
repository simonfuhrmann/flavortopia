/**
 * Component to map user IDs to user names.
 * When the 'uid' property is set, the component checks the cache if the user
 * name for the ID is already available. If not, it requests the name from the
 * Firestore. Once a name is available, the 'name' property is set.
 *
 * Usage:
 *   <diy-user-cache uid="[[userId]]" name="{{userName}}" />
 *
 * TODO:
 *   Make requesting the same UID multiple times more efficient.
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
    };
  }

  static get actions() {
    return {
      cacheUser(data) {
        return { type: 'CACHE_USER', data };
      },
    };
  }

  onUidChanged_(uid) {
    // Check if the ID is already in the Redux store.
    const cache = this.getState().userCache;
    if (cache && cache[uid]) {
      console.log('Using cache for ' + uid + ' -> ' + cache[uid]);
      return cache[uid];
    }

    // Request the user name from the
    console.log('Requesting user name for: ' + uid);
    this.set('name', '(requesting)');
    this.$.firebaseStore.getUserRecord(uid)
        .then(snapshot => {
          if (!snapshot || !snapshot.exists) {
            this.set('name', '(unknown)');
            return snapshot;
          }
          this.onNameForUidAvailable_(snapshot.data().name);
          return snapshot;
        })
        .catch(error => {
          console.warn('Error loading user name: ' + error.message);
          this.set('name', '(error)');
          throw error;
        });
  }

  onNameForUidAvailable_(name) {
    if (!name) {
      this.set('name', '(unknown)');
      return;
    }
    this.set('name', name);
    this.dispatch('cacheUser', { uid, name: data.name });
    return;
  }
}

customElements.define(DiyUserCache.is, DiyUserCache);
