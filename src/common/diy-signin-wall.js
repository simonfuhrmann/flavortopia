/**
 * A element that displays the slotted contents signed-in property is true.
 * Otherwise a lock icon and a sign in button is shown. When the sign in button
 * is pressed, the 'signin-request' event is dispatched.
 */
class DiySigninWall extends Polymer.Element {
  static get is() {
    return 'diy-signin-wall';
  }

  static get properties() {
    return {
      signedIn: {
        type: Boolean,
        value: false,
      },
    };
  }

  onSigninTap_() {
    this.dispatchEvent(new CustomEvent('signin-request'));
  }
}

customElements.define(DiySigninWall.is, DiySigninWall);
