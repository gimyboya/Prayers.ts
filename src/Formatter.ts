import { FormattedTimeObject, RawTimeObject } from 'TimeObject';
import { FormatterConfig } from './types/FormatterConfig';

export class Formatter {
  private _formatter!: Intl.DateTimeFormat;

  constructor(config?: FormatterConfig) {
    // date formatter initialization
    if (config) {
      // TODO: pull the timezone from coordinates
      const { locale, ...options } = config;
      this._formatter = new Intl.DateTimeFormat(
        locale || 'en-US',
        options || {
          // timeZone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }
      );
    } else {
      this._formatter = new Intl.DateTimeFormat('en-US', {
        // timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  }

  public format(prayerTimeObject: unknown): FormattedTimeObject {
    // clone the object that is passed to prevent mutation
    const formattedTimeObject = Object.assign({}, prayerTimeObject);
    Object.keys(formattedTimeObject).forEach(
      (key) => (formattedTimeObject[key] = this._formatter.format(formattedTimeObject[key]))
    );
    return formattedTimeObject;
  }
}
