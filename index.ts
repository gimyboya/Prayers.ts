// export * from './src';

import { Methods } from './src/types/Methods';
import { PrayerTimesCalculator } from './src';
import { Formatter } from './src/Formatter';

const calculator = new PrayerTimesCalculator({
  date: new Date(),
  latitude: 35.78056,
  longitude: -78.6389,
  method: Methods.UMM_AL_QURA,
  adjustments: { fajr: 2 },
});

const formatter = new Formatter({
  locale: 'en-US',
  timeZone: 'Asia/Riyadh',
  weekday: 'long',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

console.log('calculator object', formatter.format(calculator.getAllPrayerTimes()));
