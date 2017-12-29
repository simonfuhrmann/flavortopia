class DiyInput extends Polymer.Element {
  static get is() {
    return 'diy-input';
  }

  static get properties() {
    return {
      value: {
        type: String,
        notify: true,
      },
      label: {
        type: String,
        value: '',
      },
      error: {
        type: String,
        value: '',
      },
      type: {
        type: String,
        value: 'text',
      },
      maxlength: {
        type: Number,
        value: undefined,
      },
      placeholder: {
        type: String,
        value: undefined,
      },
      focused: {
        type: Boolean,
        value: false,
        notify: true,
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

  setError(errorMessage) {
    this.set('error', errorMessage);
  }

  hasLabel_(label) {
    return !!label;
  }

  hasError_(error) {
    return !!error;
  }

  onFocus_() {
    this.set('focused', true);
  }

  onBlur_() {
    this.set('focused', false);
  }
}

customElements.define(DiyInput.is, DiyInput);
