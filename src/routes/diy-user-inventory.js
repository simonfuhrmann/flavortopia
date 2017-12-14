class DiyUserInventory extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-user-inventory';
  }

  static get properties() {
    return {
      userId: {
        type: String,
        statePath: 'user.auth.firebaseUser.uid',
        observer: 'onUserIdChanged_',
      },
      isLoading: Boolean,
      loadingError: String,
      inventoryData: {
        type: Object,
        observer: 'onInventoryChanged_',
      },
      wishlist: Array,
      inventory: Array,
    };
  }

  onUserIdChanged_(userId) {
    this.$.firebaseGet.loadUserInventory(userId);
  }

  onInventoryChanged_(data) {
    let inventory = [];
    let wishlist = [];
    Object.keys(data).forEach(key => {
      const isInventory = data[key];
      if (isInventory) {
        inventory.push(key);
      } else {
        wishlist.push(key);
      }
    });
    this.set('inventory', inventory);
    this.set('wishlist', wishlist);
  }
}

customElements.define(DiyUserInventory.is, DiyUserInventory);
