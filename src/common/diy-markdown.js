class DiyMarkdown extends Polymer.Element {
  static get is() {
    return 'diy-markdown';
  }

  static get properties() {
    return {
      text: {
        type: String,
        observer: 'onTextChanged_',
      }
    };
  }

  onTextChanged_(text) {
    this.$.content.innerHTML = marked(text || '');
  }
}

customElements.define(DiyMarkdown.is, DiyMarkdown);
