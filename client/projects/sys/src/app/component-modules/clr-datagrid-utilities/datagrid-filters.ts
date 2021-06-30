import {
  ClrDatagridFilterInterface,
  ClrDatagridStringFilterInterface,
} from '@clr/angular';

import { Subject } from 'rxjs';

export class ClrServerSideStringFilter
  implements ClrDatagridFilterInterface<any> {
  changes = new Subject<any>();
  value: string | null = null;

  property: string;

  isActive(): boolean {
    return this.value != null && this.value !== '';
  }

  accepts(item: any): boolean {
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

export class ClrChineseBooleanFilter
  implements ClrDatagridStringFilterInterface<any> {
  constructor(private objProperty: string) {}
  accepts(thingBeingSearched: any, searchWordInput: '是' | '否'): boolean {
    if (thingBeingSearched[this.objProperty] && searchWordInput === '是') {
      return true;
    }
    if (!thingBeingSearched[this.objProperty] && searchWordInput === '否') {
      return true;
    }
    return false;
  }
}

export class ClrBooleanBtnFilter implements ClrDatagridFilterInterface<any> {
  property: string;

  value: boolean;

  changes = new Subject<any>();

  isActive(): boolean {
    if (this.value === true || this.value === false) {
      return true;
    }
    return false;
  }

  accepts(item: any): boolean {
    return item[this.property] === this.value;
  }

  constructor(propertyName: string) {
    this.property = propertyName;
  }
}
