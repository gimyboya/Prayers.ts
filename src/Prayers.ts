import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  Prayer,
  PrayerTimes,
} from 'adhan';
import { AsrTime } from './types/AsrTime';
import { Methods } from './types/Methods';
import { CalculationsConfig, CustomMethod } from 'CalculationsConfig';
import { RawTimeObject } from './types/TimeObject';
import { Observable, defer } from 'rxjs';

export class PrayerTimesCalculator {
  // TODO: add a proxy to the config to detect changes and react

  private _prayerTimesCalculator!: PrayerTimes;
  private _config!: CalculationsConfig;

  constructor(config: CalculationsConfig) {
    this._initializer(config);
  }

  private _initializer(config: CalculationsConfig) {
    this._config = config;
    const { date, latitude, longitude, ...paramsOptions } = this._config as CalculationsConfig;
    // create a coordinate object
    const coordinates = new Coordinates(latitude, longitude);
    // create calculation params based on the method name
    let calculationParams: CalculationParameters;
    if (paramsOptions.method === Methods.UMM_AL_QURA) {
      calculationParams = CalculationMethod.UmmAlQura();
    } else if (paramsOptions.method === Methods.MUSLIM_WORLD_LEAGUE) {
      calculationParams = CalculationMethod.MuslimWorldLeague();
    } else if (paramsOptions.method === Methods.MOONSIGHTING_COMMITTEE) {
      calculationParams = CalculationMethod.MoonsightingCommittee();
    } else if (paramsOptions.method === Methods.KUWAIT) {
      calculationParams = CalculationMethod.Kuwait();
    } else if (paramsOptions.method === Methods.QATAR) {
      calculationParams = CalculationMethod.Qatar();
    } else if (paramsOptions.method === Methods.EGYPTIAN) {
      calculationParams = CalculationMethod.Egyptian();
    } else if (paramsOptions.method === Methods.KARACHI) {
      calculationParams = CalculationMethod.Karachi();
    } else if (paramsOptions.method === Methods.DUBAI) {
      calculationParams = CalculationMethod.Dubai();
    } else if (paramsOptions.method === Methods.SINGAPORE) {
      calculationParams = CalculationMethod.Singapore();
    } else if (paramsOptions.method === Methods.NORTH_AMERICA) {
      calculationParams = CalculationMethod.NorthAmerica();
      // } else if (paramsOptions.method === Methods.TEHRAN) {
      //   calculationParams = CalculationMethod.Tehran();
      // } else if (paramsOptions.method === Methods.TURKEY) {
      //   calculationParams = CalculationMethod.Turkey();
    } else if (typeof paramsOptions.method === 'object') {
      // if we receive an object for custom calculation method
      calculationParams = this._pramsFromCustomMethod(paramsOptions.method);
    } else {
      // default is umm al qura
      calculationParams = CalculationMethod.UmmAlQura();
    }
    // assigning adjustments
    if (paramsOptions.adjustments) {
      Object.assign(calculationParams.adjustments, paramsOptions.adjustments);
    }
    // assigning asr time calculation method
    if (paramsOptions.asrTime === AsrTime.HANAFI) {
      calculationParams.madhab = Madhab.Hanafi;
    }
    // assigning high latitude rule
    calculationParams.highLatitudeRule =
      paramsOptions.highLatitudeRule || HighLatitudeRule.MiddleOfTheNight;
    this._prayerTimesCalculator = new PrayerTimes(coordinates, date, calculationParams);
  }

  private _pramsFromCustomMethod(config: CustomMethod): CalculationParameters {
    const calculationParams = new CalculationParameters(
      config.fajrAngle || 18,
      config.ishaAngle || 18,
      'Other',
      config.ishaInterval || 0
    );
    if (config.methodAdjustments) {
      // assigning method adjustments
      Object.assign(calculationParams, {
        methodAdjustments: config.methodAdjustments,
      });
    }
    // return the params of the custom method
    return calculationParams;
  }

  public getCurrentPrayerName(): Prayer {
    return this._prayerTimesCalculator.currentPrayer();
  }

  public getNextPrayerName(): Prayer {
    return this._prayerTimesCalculator.nextPrayer();
  }

  public getCurrentPrayerTime(): RawTimeObject {
    return {
      [this._prayerTimesCalculator.currentPrayer()]: this._prayerTimesCalculator.timeForPrayer(
        this._prayerTimesCalculator.currentPrayer()
      ),
    };
  }

  public getNextPrayerTime(): RawTimeObject {
    return {
      [this._prayerTimesCalculator.nextPrayer()]: this._prayerTimesCalculator.timeForPrayer(
        this._prayerTimesCalculator.nextPrayer()
      ),
    };
  }

  public getAllPrayerTimes(): RawTimeObject {
    return {
      [Prayer.Fajr]: this._prayerTimesCalculator.fajr,
      [Prayer.Sunrise]: this._prayerTimesCalculator.sunrise,
      [Prayer.Dhuhr]: this._prayerTimesCalculator.dhuhr,
      [Prayer.Asr]: this._prayerTimesCalculator.asr,
      [Prayer.Maghrib]: this._prayerTimesCalculator.maghrib,
      [Prayer.Isha]: this._prayerTimesCalculator.isha,
    };
  }

  public getPrayerTime(prayer: Prayer): RawTimeObject {
    return { [prayer]: this._prayerTimesCalculator.timeForPrayer(prayer) };
  }

  public getCalculationOptions(): CalculationsConfig {
    return this._config;
  }

  public setCalculationOptions(newConfig: Partial<CalculationsConfig>) {
    this._config = Object.assign(this._config, newConfig);
    this._initializer(this._config);
  }

  // ListenToAdhan (all prayers)

  public listenToAdhan(): Observable<any> {
    const prayerTimes = this.getAllPrayerTimes();
    // we use defer to trigger the observable creation (factory) at subscription time
    return defer(() => {
      return new Observable((subscriber) => {
        let tooLate = true;
        const prayerTimesKeys = Object.keys(prayerTimes);
        const timeAtSubscription = new Date();
        console.log('subscribing at:', timeAtSubscription.getTime());
        prayerTimesKeys.forEach((prayer, i) => {
          // calculate the delay needed to issue an prayer event starting from now
          const delay = prayerTimes[prayer].getTime() - timeAtSubscription.getTime();
          // if the delay is positive (in the future)
          console.log(`delay for ${prayer} is: ${delay}`);
          if (delay >= 0) {
            tooLate = false;
            // we create an event of the the prayer based on the delay
            setTimeout(() => {
              subscriber.next(prayer);
              // if it's the last prayer we complete
              if (prayer === 'isha') subscriber.complete();
            }, delay);
          }

          if (tooLate && i === prayerTimesKeys.length) {
            subscriber.next(Prayer.None);
            subscriber.complete();
          }
        });
      });
    });
  }
}
