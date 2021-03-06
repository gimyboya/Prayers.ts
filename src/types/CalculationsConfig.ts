import { HighLatitudeRule, PrayerAdjustments, PolarCircleResolution } from 'adhan';
import { AsrTime } from './AsrTime';
import { Methods } from './Methods';

export interface CalculationsConfig {
  // the date for the calculations
  date: Date;
  // latitude of the location
  latitude: number;
  // longitude of the location
  longitude: number;
  // method used for the calculation
  method: Methods | CustomMethod;
  /**
   * Object with custom prayer time adjustments (in minutes) for each prayer time
   * @default { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
   * */
  adjustments?: Partial<PrayerAdjustments>;
  /**
   * Value from the HighLatitudeRule object, used to set a minimum time for Fajr and a max time for Isha
   * @default HighLatitudeRule.MiddleOfTheNight
   * */
  highLatitudeRule?: HighLatitudeRule;
  /**
   * Earlier (Jumhour) or later (Hanafi) Asr time calculation
   * @default AsrTime.JUMHOUR
   * */
  asrTime?: AsrTime;
  /**
   * handle the particular cases of Midnight Sun & Polar Night days
   * see: https://github.com/batoulapps/adhan-js/pull/30
   * @default PolarCircleResolution.Unresolved
   * */
  polarCircleResolution?: PolarCircleResolution;
}

export interface CustomMethod {
  /**
   * Angle of the sun used to calculate Fajr
   * @default 18
   * */
  fajrAngle?: number;
  /**
   * Angle of the sun used to calculate Isha
   * @default 18
   * */
  ishaAngle?: number;
  /**
   * Minutes after Maghrib (if set, the time for Isha will be Maghrib plus ishaInterval)
   * @default 0
   * */
  ishaInterval?: number;
  /**
   * Angle of the sun used to calculate Fajr
   * @default 0
   * */
  maghribAngle?: number;
  /**
   * Object with custom prayer time adjustments (in minutes) specifically for the method for each prayer time
   * @default { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
   * */
  methodAdjustments?: Partial<PrayerAdjustments>;
}
