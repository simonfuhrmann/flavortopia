class DiyDialog extends Polymer.Element {
  static get is() {
    return 'diy-dialog';
  }

  static get properties() {
    return {
      dialogTitle: String,
      dialogMessage: String,
      dialogIcon: String,
      dialogStyle: String,
    };
  }

  openError(title, message, icon = 'icons:error') {
    this.setProperties({
      dialogTitle: title,
      dialogMessage: message,
      dialogIcon: icon,
      dialogStyle: 'error-dialog',
    })
    this.$.errorDialog.open();
  }
}

customElements.define(DiyDialog.is, DiyDialog);
