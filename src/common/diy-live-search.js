/**
 * A search bar which emits a signal with the current search term when no
 * new input has been received for a while (for rate throttling).
 */
class DiyLiveSearch extends Polymer.Element {
  static get is() {
    return 'diy-live-search';
  }

  static get properties() {
    return {
      value: {
        type: String,
        observer: 'onValueChanged_',
      },

      delayMs: {
        type: Number,
        value: 500,
      },

      search: {
        value: String,
        notify: true,
      }
    };
  }

  onClearTap_() {
    this.set('value', '');
    this.onTimeout_();
  }

  onValueChanged_(value) {
    this.clearTimeout_();
    this.timeout = setTimeout(this.onTimeout_.bind(this), this.delayMs);
  }

  onTimeout_() {
    this.clearTimeout_();
    this.set('search', this.value);
  }

  clearTimeout_() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }

  handleKey_(event) {
    if (event.keyCode == 13 /* Enter */) {
      this.onTimeout_();
    } else if (event.keyCode == 27 /* Esc */) {
      this.onClearTap_();
    }
  }
}

customElements.define(DiyLiveSearch.is, DiyLiveSearch);
