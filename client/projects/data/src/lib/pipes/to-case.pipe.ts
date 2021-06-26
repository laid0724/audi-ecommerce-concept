import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

/**
 * Change the casing of a text input
 * Types available: Pascal, upper, lower, kebab
 */
@Pipe({
  name: 'toCase',
})
export class ToCasePipe implements PipeTransform {
  transform(value: string, type?: 'pascal' | 'upper' | 'lower' | 'kebab'): any {
    if (value && typeof value === 'string') {
      switch (type) {
        case 'pascal':
          return _.upperFirst(_.camelCase(value))
        case 'upper':
          return value.toUpperCase();
        case 'lower':
          return value.toLowerCase();
        case 'kebab':
          return _.kebabCase(value);
        default:
          return _.capitalize(value);
      }
    }

    return value;
  }
}
