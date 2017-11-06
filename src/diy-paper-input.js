class DiyPaperInput extends Polymer.Element {
  static get is() {
    return 'diy-paper-input';
  }

  static get properties() {
    return {
      value: String,
      label: String,
      type: String,
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

  hasLabel_() {
    return this.label.length > 0;
  }

  onFocus_() {
    this.set('focused', true);
  }

  onBlur_() {
    this.set('focused', false);
  }
}

customElements.define(DiyPaperInput.is, DiyPaperInput);
