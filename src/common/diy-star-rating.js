class DiyStarRating extends Polymer.Element {
  static get is() {
    return 'diy-star-rating';
  }

  static get properties() {
    return {
      rating: {
        type: Number,
        value: 0,
      },

      numRatings: {
        type: Number,
        value: 0,
      },

      detailed: {
        type: Boolean,
        value: false,
      },

      editable: {
        type: Boolean,
        value: false,
      },
    };
  }

  constructor() {
    super();
    this.mouseOverRef_ = 0;
    this.starElements_ = [];
  }

  connectedCallback() {
    this.starElements_.push(this.$.star1);
    this.starElements_.push(this.$.star2);
    this.starElements_.push(this.$.star3);
    this.starElements_.push(this.$.star4);
    this.starElements_.push(this.$.star5);
  }

  starMouseOver_(event) {
    if (!this.editable) return;
    const elem = event.path[0];
    const elemIndex = this.starElements_.findIndex(e => e === elem);
    if (elemIndex < 0) return;
    this.mouseOverRef_ += 1;
    for (let i = 0; i <= elemIndex; ++i) {
      this.starElements_[i].setAttribute('hover', true);
    }
  }

  starMouseOut_(event) {
    if (!this.editable) return;
    const elem = event.path[0];
    const elemIndex = this.starElements_.findIndex(e => e === elem);
    if (elemIndex < 0) return;
    this.mouseOverRef_ -= 1;
    if (this.mouseOverRef_ > 0) return;
    this.starElements_.forEach(e => e.removeAttribute('hover'));
  }

  starClick_(event) {
    if (!this.editable) return;
    const elem = event.path[0];
    const elemIndex = this.starElements_.findIndex(e => e === elem);
    if (elemIndex < 0) return;
    const newRating = elemIndex + 1;
    if (newRating == this.rating) {
      this.set('rating', 0);
    } else {
      this.set('rating', newRating);
    }
  }

  starIcon_(rating, starId) {
    if (starId <= rating) {
      return 'icons:star';
    } else if (starId <= Math.ceil(rating)) {
       return 'icons:star-half';
    } else {
      return 'icons:star-border';
    }
  }
}

customElements.define(DiyStarRating.is, DiyStarRating);
