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
        type: String,
        notify: true,
      },

      withButton: {
        type: Boolean,
        value: false,
      },
    };
  }

  clear() {
    this.set('value', '');
  }

  onClearTap_() {
    this.clear();
    this.onSearch_();
  }

  onValueChanged_(value) {
    this.clearTimeout_();
    if (this.delayMs > 0) {
      this.timeout = setTimeout(this.onSearch_.bind(this), this.delayMs);
    }
  }

  onSearch_() {
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
      this.onSearch_();
    } else if (event.keyCode == 27 /* Esc */) {
      this.onClearTap_();
    }
  }

  onSearchTap_() {
    this.onSearch_();
  }
}

customElements.define(DiyLiveSearch.is, DiyLiveSearch);
