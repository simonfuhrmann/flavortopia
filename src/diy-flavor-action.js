class DiyFlavorAction extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-flavor-action';
  }

  static get properties() {
    return {
      flavor: {
        type: String,
        value: '',
      },

      userId: {  // TODO: Remove
        type: String,
        statePath: 'user.auth.firebaseUser.uid',
      },
      inventory: {
        type: Object,
        statePath: 'inventory',
      },
    };
  }

  static get observers() {
    return [
      'update_(userId, inventory, flavor)',
    ];
  }

  update_(userId, inventory, flavor) {
    if (!userId || !inventory || !flavor) {
      this.setAttribute('hidden', true);
      return;
    }

    let icon, title;
    const entry = this.inventory[this.flavor];
    switch (entry) {
      case true:
        icon = 'icons:work';
        title = 'In your inventory';
        break;

      case false:
        icon = 'icons:shopping-cart';
        title = 'In your wishlist';
        break;

      default:
        icon = 'icons:add';
        title = 'Add to inventory';
        break;
    }

    this.removeAttribute('hidden');
    this.$.button.set('icon', icon);
    this.$.button.setAttribute('title', title);
  }
}

customElements.define(DiyFlavorAction.is, DiyFlavorAction);
