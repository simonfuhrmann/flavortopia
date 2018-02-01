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
      sortForScale: {
        type: Boolean,
        value: true,
      },
      customizeBase: {
        type: Boolean,
        value: false,
      },

      // Converted and/or computed values.
      volumeMl: Number,
      simpleBaseMl: Number,
      simpleBasePercent: Number,
      customBaseNicotineMl: Number,
      customBaseNicotineMg: Number,
      customBaseNicotinePercent: Number,
      customBaseWaterMl: Number,
      customBaseWaterPercent: Number,
      customBasePgMl: Number,
      customBasePgPercent: Number,
      customBaseVgMl: Number,
      customBaseVgPercent: Number,

      // Input fields.
      // TODO: Replace default values with user preferences.
      volumeInput: {
        type: String,
        value: '30',
        observer: 'onVolumeChanged_',
      },
      nicotineJuiceMgInput: {
        type: String,
        value: '3',
      },
      nicotineBaseMgInput: {
        type: String,
        value: '48',
      },
      basePgPercentInput: {
        type: String,
        value: '30',
        observer: 'onBasePgPercentInputChanged_',
      },
      baseVgPercentInput: {
        type: String,
        value: '70',
        observer: 'onBaseVgPercentInputChanged_',
      },
      baseWaterPercentInput: {
        type: String,
        value: '3',
      },
    };
  }

  static get observers() {
    return [
      'computeSimpleBase_(ingredients, volumeMl)',
      'computeCustomBase_(ingredients, volumeMl, nicotineJuiceMgInput, nicotineBaseMgInput, basePgPercentInput, baseVgPercentInput, baseWaterPercentInput)',
    ];
  }

  onVolumeChanged_(volumeInput) {
    this.set('volumeMl', this.stringToNumber(volumeInput));
  }

  onVendorTap_(event) {
    const vendor = event.model.item.vendor;
    this.$.vendorPopup.set('positionTarget', event.path[0]);
    this.$.vendorPopup.set('key', vendor.key);
    this.$.vendorPopup.open();
  }

  onActionTap_(event) {
    const flavor = event.model.item.flavor;
    if (!flavor || !flavor.key) return;
    this.$.flavorActions.set('positionTarget', event.path[0]);
    this.$.flavorActions.set('flavor', flavor.key);
    this.$.flavorActions.open();
  }

  onBasePgPercentInputChanged_(value) {
    const number = this.stringToNumber(String(value || 0));
    if (isNaN(number)) {
      return;
    }
    this.set('baseVgPercentInput', String(100.0 - number));
  }

  onBaseVgPercentInputChanged_(value) {
    const number = this.stringToNumber(String(value || 0));
    if (isNaN(number)) {
      return;
    }
    this.set('basePgPercentInput', String(100.0 - number));
  }

  ingredientsSorter_(sortForScale) {
    // If sorting for a scale is requested, provide a sort comparator.
    if (sortForScale) {
      return function(lhs, rhs) {
        return lhs.percent - rhs.percent;
      };
    }
    // Do not provide a sort function if original order is requested.
    return undefined;
  }

  mlForIngredient_(percent, volumeMl) {
    const milliliters = isNaN(volumeMl) ? 0.0 : volumeMl * percent / 100.0;
    return this.formatFixed(milliliters);
  }

  computeSimpleBase_(ingredients, volumeMl) {
    if (!ingredients || !volumeMl) return;
    const flavorPercent = this.flavorsTotalPercent_(ingredients);
    const basePercent = 100.0 - flavorPercent;
    const baseMl = isNaN(volumeMl) ? 0.0 : volumeMl * basePercent / 100.0;
    this.set('simpleBasePercent', basePercent);
    this.set('simpleBaseMl', baseMl);
  }

  computeCustomBase_(
      ingredients, volumeMl, nicotineJuiceMgInput, nicotineBaseMgInput,
      basePgPercentInput, baseVgPercentInput, baseWaterPercentInput) {
    this.resetCustomBase_();

    // Compute base ingredient percentages. Nicotine percentages are absolute
    // for the final juice. Water percentage is absolute for the base only.
    // The PG/VG ratio is applied to the remaining base.
    const nicotineBaseMg = this.stringToNumber(nicotineBaseMgInput);
    const nicotineJuiceMg = this.stringToNumber(nicotineJuiceMgInput);
    const waterPercent = this.stringToNumber(baseWaterPercentInput) / 100.0;
    const pgRatioPercent = this.stringToNumber(basePgPercentInput) / 100.0;
    const vgRatioPercent = this.stringToNumber(baseVgPercentInput) / 100.0;
    const flavorPercent = this.flavorsTotalPercent_(ingredients) / 100.0;

    // Compute percentages in the final juice.
    const finalNicotinePercent = nicotineJuiceMg / nicotineBaseMg;
    const remainingPercent = 1.0 - flavorPercent - finalNicotinePercent;
    const finalWaterPercent = remainingPercent * waterPercent;
    const remainingPgVgPercent = remainingPercent - finalWaterPercent;
    const finalPgPercent = remainingPgVgPercent * pgRatioPercent;
    const finalVgPercent = remainingPgVgPercent * vgRatioPercent;

    // Compute volumes in the final juice.
    const finalNicotineMl = volumeMl * finalNicotinePercent;
    const finalWaterMl = volumeMl * finalWaterPercent;
    const finalPgMl = volumeMl * finalPgPercent;
    const finalVgMl = volumeMl * finalVgPercent;

    this.setProperties({
      'customBaseNicotineMg': nicotineBaseMg,
      'customBaseNicotineMl': finalNicotineMl,
      'customBaseNicotinePercent': finalNicotinePercent * 100.0,
      'customBaseWaterMl': finalWaterMl,
      'customBaseWaterPercent': finalWaterPercent * 100.0,
      'customBasePgMl': finalPgMl,
      'customBasePgPercent': finalPgPercent * 100.0,
      'customBaseVgMl': finalVgMl,
      'customBaseVgPercent': finalVgPercent * 100.0,
    });
  }

  resetCustomBase_() {
    this.setProperties({
      'customBaseNicotineMl': 0.0,
      'customBaseNicotineMg': 0.0,
      'customBaseNicotinePercent': 0.0,
      'customBaseWaterMl': 0.0,
      'customBaseWaterPercent': 0.0,
      'customBasePgMl': 0.0,
      'customBasePgPercent': 0.0,
      'customBaseVgMl': 0.0,
      'customBaseVgPercent': 0.0,
    });
  }

  flavorsTotalPercent_(ingredients) {
    return ingredients.reduce((prev, curr) => {
      return prev + curr.percent;
    }, 0.0);
  }
}

customElements.define(DiyRecipeMixer.is, DiyRecipeMixer);
