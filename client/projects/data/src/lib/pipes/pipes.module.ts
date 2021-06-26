import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpacedCommaPipe } from './spaced-comma.pipe';
import { EllipsisPipe } from './ellipsis.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ToCasePipe } from './to-case.pipe';
import { StringPipe } from './string.pipe';
import { SortPipe } from './sort.pipe';
import { SlugPipe } from './slug.pipe';
import { PhoneNumberPipe } from './phone-number.pipe';
import { MapPipe } from './map.pipe';
import { LimitPipe } from './limit.pipe';
import { HtmlRemovePipe } from './html-remove.pipe';
import { FilterPipe } from './filter.pipe';
import { DurationPipe } from './duration.pipe';
import { DebouncePipe } from './debounce.pipe';
import { CountPipe } from './count.pipe';

const PIPES = [
  SpacedCommaPipe,
  EllipsisPipe,
  SafeHtmlPipe,
  ToCasePipe,
  StringPipe,
  SortPipe,
  SlugPipe,
  PhoneNumberPipe,
  MapPipe,
  LimitPipe,
  HtmlRemovePipe,
  FilterPipe,
  DurationPipe,
  DebouncePipe,
  CountPipe,
];

@NgModule({
  declarations: [...PIPES],
  imports: [CommonModule],
  exports: [...PIPES],
})
export class PipesModule {}
