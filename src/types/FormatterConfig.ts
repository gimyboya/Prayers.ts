export interface FormatterConfig extends Intl.DateTimeFormatOptions {
  /**
   * date formatter locale
   * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
   * @default 'en-US'
   * */
  locale?: string | string[];
}
