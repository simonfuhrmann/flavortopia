class DiyAllFlavors extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-all-flavors';
  }

  static get properties() {
    return {
      flavors: {
        type: Object,
        statePath: 'flavors',
      },
    };
  }

  static get actions() {
    return {
      initFlavors(data) {
        return { type: 'INIT_FLAVORS', data };
      },
      initVendors(data) {
        return { type: 'INIT_VENDORS', data };
      },
    };
  }

  onLoadDataTap_() {
    this.$.firebaseStore.getVendors()
        .then(snapshot => {
          if (!snapshot) return;
          const data = {};
          snapshot.docs.forEach(doc => {
            data[doc.id] = doc.data();
          });
          this.dispatch('initVendors', data);
        })
        .catch(error => {
          console.log('error loading vendors', error);
        });

    this.$.firebaseStore.getFlavors()
        .then(snapshot => {
          if (!snapshot) return;
          const data = {};
          snapshot.docs.forEach(doc => {
            data[doc.id] = doc.data();
          });
          this.dispatch('initFlavors', data);
        })
        .catch(error => {
          console.log('error loading vendors', error);
        });
  }

  onLogStoreTap_() {
    console.log(this.getState());
  }

  toFlavorsArray_(flavors) {
    return Object.keys(flavors);
  }

  databaseTest_() {
    const uid = this.getState().user.auth.firebaseUser.uid;
    console.log('user', uid);
    this.$.firebaseStore.getUserAdminRecord(uid + 's')
        .then(snapshot => {
          console.log('is admin: ', snapshot.exists);
        })
        .catch(error => {
          console.log('admin error', error);
        });
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
