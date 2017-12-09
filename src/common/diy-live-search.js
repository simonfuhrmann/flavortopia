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
    };
  }

  onClearTap_() {
    this.set('value', '');
    this.onTimeout_();
  }

  onValueChanged_(value) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.onTimeout_.bind(this), this.delayMs);
  }

  onTimeout_() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.dispatchEvent(new CustomEvent('search', { detail: this.value }));
  }
}

customElements.define(DiyLiveSearch.is, DiyLiveSearch);
