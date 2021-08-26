import {
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  Component,
} from '@angular/core';
import {
  initAudiModules,
  AudiModuleName,
  AudiComponents,
  spreadNumberAsArray,
} from '@audi/data';

/*
  USAGE:

  <audi-indicator
    [totalItems]="10"
    [(currentItem)]="currentItem"
    [isLightTheme]="false"
    [isShadowed]="false"
    [isImageBackground]="true"
  ></audi-indicator>
*/

@Component({
  selector: 'audi-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss'],
})
export class IndicatorComponent implements AfterViewInit {
  @Input() isImageBackground: boolean = false;
  @Input() isLightTheme: boolean = false;
  @Input() isShadowed: boolean = false;

  @Input() totalItems: number;

  _currentItem: number = 0;

  get currentItem(): number {
    return this._currentItem;
  }

  @Input('currentItem')
  set currentItem(value: number) {
    this._currentItem = value;

    this.updateCurrentIndicator();
  }

  @Output() currentItemChange: EventEmitter<number> =
    new EventEmitter<number>();

  get items(): number[] {
    if (this.totalItems) {
      return spreadNumberAsArray(this.totalItems);
    }
    return [];
  }

  indicators: any;

  ngAfterViewInit(): void {
    const audiIndicatorModules = initAudiModules(AudiModuleName.Indicator);

    audiIndicatorModules.forEach((indicatorModule: AudiComponents) => {
      this.indicators = indicatorModule.components.upgradeElements();

      this.updateCurrentIndicator();
    });
  }

  onCurrentItemChange(i: number): void {
    if (this.currentItem !== i) {
      this.currentItem = i;
      this.currentItemChange.emit(this.currentItem);
    }
  }

  updateCurrentIndicator(): void {
    setTimeout(() => {
      this.indicators.forEach((indicator: any) =>
        indicator.select(this.currentItem)
      );
    }, 0);
  }
}
