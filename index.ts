// export * from './src';

import { Methods } from './src/types/Methods';
import { PrayerTimesCalculator } from './src';
import { Formatter } from './src/Formatter';

// Cyberjaya location
const calculator = new PrayerTimesCalculator({
  date: new Date(),
  latitude: 2.9213,
  longitude: 101.6559,
  method: Methods.SINGAPORE,
  adjustments: { dhuhr: 3, asr: 3, isha: 2 },
});

const formatter = new Formatter({
  locale: 'en-US',
  timeZone: 'Asia/Kuala_Lumpur',
  weekday: 'long',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

console.log('calculator object', formatter.format(calculator.getAllPrayerTimes()));

console.log('Qibla direction is:', calculator.getQiblaDirection());

calculator.listenToAdhan().subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});
