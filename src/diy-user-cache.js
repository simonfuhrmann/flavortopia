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
    // Check if the ID is already in the redux store.
    const cache = this.getState().userCache;
    if (cache && cache[uid]) {
      console.log('Using cached user for ' + uid + ': ' + cache[uid]);
      return cache[uid];
    }

    // Request the user name from the
    console.log('requesting user details for ' + uid);
    this.set('name', '(requesting)');
    this.$.firebaseStore.getUserRecord(uid)
        .then(snapshot => {
          if (!snapshot || !snapshot.exists) {
            this.set('name', '(unknown)');
            return;
          }
          this.onNameForUidAvailable_(snapshot.data().name);
        })
        .catch(error => {
          console.warn('Error loading user name: ' + error.message);
          this.set('name', '(unknown)');
        });
  }

  onNameForUidAvailable_(name) {
    if (!name) {
      this.set('name', '(unknown)');
    }
    this.set('name', name);
    this.dispatch('cacheUser', { uid, name: data.name });
    return;
  }
}

customElements.define(DiyUserCache.is, DiyUserCache);
