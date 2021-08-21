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
  @Input() currentItem: number = 1;
  @Output() currentItemChange: EventEmitter<number> =
    new EventEmitter<number>();

  get items(): number[] {
    if (this.totalItems) {
      return spreadNumberAsArray(this.totalItems);
    }
    return [];
  }

  ngAfterViewInit(): void {
    const audiIndicatorModules = initAudiModules(AudiModuleName.Indicator);

    audiIndicatorModules.forEach((indicatorModule: AudiComponents) => {
      indicatorModule.components.upgradeElements();
    });
  }

  onCurrentItemChange(i: number): void {
    if (this.currentItem !== i) {
      this.currentItem = i;
      this.currentItemChange.emit(this.currentItem);
    }
  }
}
