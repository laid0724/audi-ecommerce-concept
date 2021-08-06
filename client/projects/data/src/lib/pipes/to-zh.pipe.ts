import { Pipe, PipeTransform } from '@angular/core';
import { toZhMapper } from '../helpers';

@Pipe({
  name: 'toZh',
})
export class ToZhPipe implements PipeTransform {
  transform(value: string | null | undefined | boolean, type?: string): string {
    return toZhMapper(value, type);
  }
}
