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

  /** Formats a number to a fixed representation, e.g., 1.50. */
  formatFixed(value, digits = 2) {
    return Number(value).toFixed(2);
  }

  /** Trims white spaces and replaces commas with periods. */
  sanitizeNumber(string) {
    return string.trim().replace(',', '.');
  }

  /** Converts a string to a number. Returns NaN if invalid. */
  stringToNumber(string) {
    const sanitized = this.sanitizeNumber(string);
    return /^[0-9.]+$/.test(sanitized) ? Number(sanitized) : NaN;
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
