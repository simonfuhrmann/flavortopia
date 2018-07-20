class DiyFlavorActions extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-flavor-actions';
  }

  static get properties() {
    return {
      flavorKey: {
        type: String,
        value: '',
      },
      positionTarget: Object,

      inventory: {
        type: Object,
        statePath: 'inventory',
      },

      inNowhere: {
        type: Boolean,
        value: false,
      },
      inInventory: {
        type: Boolean,
        value: false,
      },
      inWishlist: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get observers() {
    return [
      'updateActions_(flavorKey, inventory)',
    ];
  }

  open() {
    this.$.dropdown.open();
  }

  close() {
    this.$.dropdown.close();
  }

  updateActions_(flavorKey, inventory) {
    if (!flavorKey || !inventory) return;
    const entry = inventory[flavorKey];
    this.setProperties({
      'inNowhere': entry === undefined,
      'inInventory': entry === true,
      'inWishlist': entry === false,
    });
  }

  closeDropdown_() {
    this.close();
  }

  addToInventory_() {
    const inventory = Object.assign({}, this.inventory);
    inventory[this.flavorKey] = true;
    this.persistInventory_(inventory);
  }

  addToWishlist_() {
    const inventory = Object.assign({}, this.inventory);
    inventory[this.flavorKey] = false;
    this.persistInventory_(inventory);
  }

  removeFromInventory_() {
    const inventory = Object.assign({}, this.inventory);
    delete inventory[this.flavorKey];
    this.persistInventory_(inventory);
  }

  removeFromWishlist_() {
    const inventory = Object.assign({}, this.inventory);
    delete inventory[this.flavorKey];
    this.persistInventory_(inventory);
  }

  persistInventory_(inventory) {
    this.dispatch('setInventory', inventory);
    const firebaseUser = this.getState().user.auth.firebaseUser;
    if (!firebaseUser || !firebaseUser.uid) return;

    this.$.firebaseStore.setInventory(firebaseUser.uid, inventory)
        .catch(error => {
          this.$.errorDialog.openError(
              'Error updating inventory',
              error.message);
        });
  }
}

customElements.define(DiyFlavorActions.is, DiyFlavorActions);
