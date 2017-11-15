class DiyPaperInput extends Polymer.Element {
  static get is() {
    return 'diy-paper-input';
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
      focused: {
        type: Boolean,
        value: false,
        notify: true,
      },
      boundOnFocus_: {
        type: Function,
        value: function() {
          return this.onFocus_.bind(this);
        },
      },
      boundOnBlur_: {
        type: Function,
        value: function() {
          return this.onBlur_.bind(this);
        }
      },
    };
  }

  connectedCallback() {
    this.addEventListener('focus', this.boundOnFocus_, true);
    this.addEventListener('blur', this.boundOnBlur_, true);
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

customElements.define(DiyPaperInput.is, DiyPaperInput);
