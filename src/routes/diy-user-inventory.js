class DiyUserInventory extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-user-inventory';
  }

  static get properties() {
    return {
      inventoryData: {
        type: Object,
        statePath: 'inventory',
        observer: 'onInventoryChanged_',
      },
      wishlist: Array,
      inventory: Array,
    };
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
