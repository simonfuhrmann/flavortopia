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
    this.$.dialog.removeAttribute('with-backdrop');
    this.$.dialog.setAttribute('modal', true);
    this.openDialog_(title, message, icon, 'error-dialog');
  }

  openInfo(title, message, icon = 'icons:info-outline') {
    this.$.dialog.removeAttribute('modal');
    this.$.dialog.setAttribute('with-backdrop', true);
    this.openDialog_(title, message, icon, 'info-dialog');
  }

  openDialog_(title, message, icon, style) {
    this.setProperties({
      dialogTitle: title,
      dialogMessage: message,
      dialogIcon: icon,
      dialogStyle: style,
    })
    this.$.dialog.open();
  }
}

customElements.define(DiyDialog.is, DiyDialog);
