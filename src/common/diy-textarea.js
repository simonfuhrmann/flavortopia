class DiyTextarea extends Polymer.Element {
  static get is() {
    return 'diy-textarea';
  }

  static get properties() {
    return {
      value: {
        type: String,
        notify: true
      },
      label: {
        type: String,
        value: '',
      },
      placeholder: {
        type: String,
        value: undefined,
      },
      rows: {
        type: Number,
        value: 2,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focus', this.onFocus_.bind(this), true);
    this.addEventListener('blur', this.onBlur_.bind(this), true);
  }

  focus() {
    this.$.nativeInput.focus();
  }

  hasLabel_(label) {
    return !!label;
  }

  onFocus_() {
    this.set('focused', true);
  }

  onBlur_() {
    this.set('focused', false);
  }
}

customElements.define(DiyTextarea.is, DiyTextarea);
