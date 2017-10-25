class DiyContent extends Polymer.Element {
  static get is() {
    return "diy-content";
  }

  openDialog_() {
    this.$.dialog.open();
  }
}

customElements.define(DiyContent.is, DiyContent);