import { Pipe, PipeTransform } from '@angular/core';
import { utcToZonedTime } from 'date-fns-tz';

@Pipe({
  name: 'toLocalTime',
})
export class ToLocalTimePipe implements PipeTransform {
  transform(date: string | Date): Date | null {
    if (date == null) {
      return null;
    }

    const jsDateObject = new Date(date);
    const timeZone = 'Asia/Taipei';
    const zonedDate = utcToZonedTime(jsDateObject, timeZone);

    return zonedDate;
  }
}
