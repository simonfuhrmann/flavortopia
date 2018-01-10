class DiyRecipeMixer extends DiyMixinCommon(Polymer.Element) {
  static get is() {
    return 'diy-recipe-mixer';
  }

  static get properties() {
    return {
      ingredients: {
        type: Array,
        value: () => [],
      },
      volumeString: {
        type: String,
        value: '30',
        observer: 'onVolumeChanged_',
      },
      volume: {
        type: Number,
        value: 30,
      },
      sortForScale: {
        type: Boolean,
        value: true,
        observer: 'onSortingChanged_',
      },
      customizeBase: {
        type: Boolean,
        value: false,
      },
    };
  }

  onVolumeChanged_(volumeString) {
    this.set('volume', this.stringToNumber(volumeString));
  }

  onSortingChanged_(sorting) {
  }

  mlForIngredient_(percent, volume) {
    const milliliters = isNaN(volume) ? 0.0 : volume * percent / 100.0;
    return this.formatMilliliters(milliliters);
  }

  mlForBase_(ingredients, volume) {
    const percent = this.percentForBase_(ingredients);
    const milliliters = isNaN(volume) ? 0.0 : volume * percent / 100.0;
    return this.formatMilliliters(milliliters);
  }

  percentForBase_(ingredients) {
    const totalPercent = ingredients.reduce((prev, curr) => {
      return prev + curr.percentValue;
    }, 0.0);
    return this.formatPercent(100.0 - totalPercent);
  }

}

customElements.define(DiyRecipeMixer.is, DiyRecipeMixer);
