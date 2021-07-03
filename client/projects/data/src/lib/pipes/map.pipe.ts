import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'map',
})
export class MapPipe implements PipeTransform {
  constructor() {}

  public transform<T, D>(value: T, iterate: (t: T) => D): D {
    return iterate(value);
  }
}
