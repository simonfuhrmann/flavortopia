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
      'updateIcon_(userId, inventory, flavor)',
    ];
  }

  updateIcon_(userId, inventory, flavor) {
    if (!userId || !inventory || !flavor) {
      this.setAttribute('hidden', true);
      return;
    }
    this.removeAttribute('hidden');
    this.$.button.set('icon', this.iconForFlavor_());
  }

  iconForFlavor_() {
    const entry = this.inventory[this.flavor];
    switch (entry) {
      case true: return 'icons:work';
      case false: return 'icons:shopping-cart';
    }
    return 'icons:add';
  }
}

customElements.define(DiyFlavorAction.is, DiyFlavorAction);
