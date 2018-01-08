/**
 * Mixin with common functions.
 */
DiyMixinCommon = (superClass) => class extends superClass {
  /** Returns a YYYY-MM-DD date representation for a timestamp. */
  formatTimestamp(timestamp) {
    if (!timestamp) {
      return '(unavailable)';
    }
    let date = new Date(timestamp);
    let dateString = date.toISOString();
    let endIndex = dateString.indexOf('T');
    return dateString.substring(0, endIndex);
  }

  /** Formats a flavor percent value to two digits, e.g., 1.50. */
  formatPercent(value) {
    return Number(value).toFixed(2);
  }

  /** Formats a milliliter value to two digits, e.g., 1.50. */
  formatMilliliters(value) {
    return Number(value).toFixed(2);
  }

  /** Converts a string to a number. Returns NaN if invalid. */
  stringToNumber(string) {
    return /^[0-9.]+$/.test(string) ? Number(string) : NaN;
  }

  /** Deletes all undefined properties from an object. */
  deleteUndefinedProperties(object) {
    Object.keys(object).forEach(key => {
      if (object[key] === undefined) {
        delete object[key];
      }
    });
  }

  /** Deletes all empty string properties from an object. */
  deleteEmptyStringProperties(object) {
    Object.keys(object).forEach(key => {
      if (object[key] === '') {
        delete object[key];
      }
    });
  }

};
