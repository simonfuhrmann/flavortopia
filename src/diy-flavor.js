/*
 * Visual element for a single flavor.
 */
class DiyFlavor extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-flavor';
  }
  static get properties() {
    return {
      identifier: {
        type: String,
        observer: 'onIdentifierChanged_',
      },
      flavorName: String,
      vendorShort: String,
      vendorName: String,
      imageUrl: String,
    };
  }

  onIdentifierChanged_(identifier) {
    const flavor = this.allFlavors[identifier];
    if (!flavor) return;
    const vendor = this.allVendors[flavor.vendor];
    if (!vendor) return;

    this.set('flavorName', flavor.name);
    this.set('vendorShort', vendor.short);
    this.set('vendorName', vendor.name);
    this.set('imageUrl', 'images/flavors/' + identifier + '.png');
  }

  onImageError_(event) {
    event.target.setAttribute('src', 'data:image/png;base64,\
        iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/\
        AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsECCovI9dk\
        CAAAAV5JREFUWMPtmDFLw1AQx38vrVpBhwo66KCDYAcXNydnP8F9Kgc/x02d\
        VNAPYUF0EaWTOImTiTbG5QqhaEhMm2fl/SHcI3nc+3F3OXKBoKA5l6pGqhqV\
        vV9VbkqQi8Aa0DGfb8CLiCR1fUd1Imf2DEiAJ+AReLB1rKqXdQHbUwjgktnR\
        N74X/gKgK/DlvKU4d3i3YE/XZwQ/zZ4Au1aHkYGn9sLcewMUkcyWA+DU4PJ1\
        2AKOfKZ4DHoDPFubWbdrA4hF5FZV277ajDN7COzl6tJZJLdUtScio/Hexhu1\
        qvaA61yrmVQCHIjIna9G3S+Ay+zZle1vNV2D+7nU/pSdFNi0VKdNA65UKKFt\
        H29xpwLgsrc2M2sFwAAYAANgAAyAAXB+AV0T59QB/CixZzz5xT4AB8CwhP9X\
        4Py3f7rqDk07wDGwOvEBmwHvBnchIkNVdblZevaqMkrWGTuD/r2+AJ8dY6Dj\
        FTdfAAAAAElFTkSuQmCC');
  }
}

customElements.define(DiyFlavor.is, DiyFlavor);
