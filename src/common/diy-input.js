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
      selectOnFocus: {
        type: Boolean,
        value: false,
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

  select() {
    const input = this.$.nativeInput;
    input.setSelectionRange(0, input.value.length);
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
    if (this.selectOnFocus) {
      this.select();
    }
  }

  onBlur_() {
    this.set('focused', false);
  }
}

customElements.define(DiyInput.is, DiyInput);
