class DiyContent extends DiyMixinRedux(DiyMixinRouter(Polymer.Element)) {
  static get is() {
    return 'diy-content';
  }

  static get properties() {
    return {
      signedIn: {
        type: String,
        statePath: 'user.auth.signedIn',
      },
    };
  }
}

customElements.define(DiyContent.is, DiyContent);
