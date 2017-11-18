class DiyUserRecipes extends Polymer.Element {
  static get is() {
    return 'diy-user-recipes';
  }

  static get properties() {
    return {
      testvalue: {
        type: String,
        observer: 'onValueChanged_',
      }
    };
  }

  onValueChanged_(value) {
    console.log('value', value);
  }

  onSaveTap_() {
    this.set('testvalue', "asdfasdf 123");
  }
}

customElements.define(DiyUserRecipes.is, DiyUserRecipes);
