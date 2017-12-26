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

  onFocus_() {
    this.set('focused', true);
  }

  onBlur_() {
    this.set('focused', false);
  }

  hasLabel_(label) {
    return !!label;
  }
}

customElements.define(DiyTextarea.is, DiyTextarea);
