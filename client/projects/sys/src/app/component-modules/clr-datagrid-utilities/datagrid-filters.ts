import { DATE_REGEX, isNullOrEmptyString } from '@audi/data';
import { ClrDatagridFilterInterface } from '@clr/angular';

import { Subject } from 'rxjs';

export class ClrServerSideStringFilter
  implements ClrDatagridFilterInterface<string>
{
  changes = new Subject<any>();
  value: string | null = null;

  property: string;

  isActive(): boolean {
    return this.value != null && this.value !== '';
  }

  accepts(input: string): boolean {
    return true;
  }

  constructor(propertyName: string) {
    this.property = propertyName;
  }
}

export class ClrServerSideNumberFilter
  implements ClrDatagridFilterInterface<number>
{
  changes = new Subject<any>();
  value: number | null = null;

  property: string;

  isActive(): boolean {
    return this.value != null;
  }

  accepts(input: number): boolean {
    return true;
  }

  constructor(propertyName: string) {
    this.property = propertyName;
  }
}

export class ClrCustomBtnFilter implements ClrDatagridFilterInterface<any> {
  property: string;

  value: any;

  changes = new Subject<any>();

  isActive(): boolean {
    return !!this.value;
  }

  accepts(item: any): boolean {
    return item[this.property] === this.value;
  }

  constructor(propertyName: string) {
    this.property = propertyName;
  }
}

export class ClrMinMaxRangeFilter implements ClrDatagridFilterInterface<any> {
  property: string;

  value: any[] = [null, null];

  changes = new Subject<any>();

  isActive(): boolean {
    const [minValue, maxValue] = this.value;
    if (
      (minValue != null && minValue > 0) ||
      (maxValue != null && maxValue > 0)
    ) {
      if (minValue != null && maxValue == null) return true;
      if (maxValue != null && minValue == null) return true;
      if (maxValue >= minValue) return true;
    }
    return false;
  }

  accepts(item: any): boolean {
    return true;
  }

  constructor(propertyName: string) {
    this.property = propertyName;
  }
}

export class ClrDateRangeFilter implements ClrDatagridFilterInterface<any> {
  property: string;

  value: any[] = [null, null];

  changes = new Subject<any>();

  isActive(): boolean {
    const [dateStart, dateEnd] = this.value;
    const validDateFormatRegex = new RegExp(DATE_REGEX);
    if (
      (!isNullOrEmptyString(dateStart) &&
        validDateFormatRegex.test(dateStart)) ||
      (!isNullOrEmptyString(dateEnd) && validDateFormatRegex.test(dateEnd))
    ) {
      if (!isNullOrEmptyString(dateStart) && isNullOrEmptyString(dateEnd))
        return true;
      if (!isNullOrEmptyString(dateEnd) && isNullOrEmptyString(dateStart))
        return true;
      if (new Date(dateEnd) >= new Date(dateStart)) return true;
    }
    return false;
  }

  accepts(item: any): boolean {
    return true;
  }

  constructor(propertyName: string) {
    this.property = propertyName;
  }
}
