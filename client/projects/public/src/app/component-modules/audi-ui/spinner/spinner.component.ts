import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, AfterViewInit, Input } from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';

/*
  USAGE:

  <audi-spinner
    class="block my-4"
    [isLightTheme]="false"
    [isContinuous]="false"
    [progress]="50"
  ></audi-spinner>
*/

@Component({
  selector: 'audi-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements AfterViewInit, OnChanges {
  @Input() isLightTheme: boolean = false;
  @Input() isContinuous: boolean = false;
  @Input() progress: number = 0;

  spinners: any | any[];

  ngAfterViewInit(): void {
    const audiSpinnerModules = initAudiModules(AudiModuleName.Spinner);

    audiSpinnerModules.forEach((spinnerModule: AudiComponents) => {
      this.spinners = spinnerModule.components.upgradeElements();

      if (this.isContinuous) {
        this.initContinousSpinner();
      } else {
        this.updateSpinnerProgess(this.progress);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { progress, isContinuous } = changes;

    if (this.spinners) {
      if (progress.previousValue !== progress.currentValue) {
        this.updateSpinnerProgess(progress.currentValue);
      }
      if (
        isContinuous.currentValue &&
        isContinuous.previousValue !== isContinuous.currentValue
      ) {
        this.initContinousSpinner();
      }
    }
  }

  initContinousSpinner(): void {
    this.spinners.forEach((spinner: any) => {
      spinner.loop();
    });
  }

  updateSpinnerProgess(progress: number) {
    if (progress >= 0 && progress <= 100) {
      const progressRatio = progress / 100;

      this.spinners.forEach((spinner: any) => {
        spinner.progress(progressRatio);
      });
    }
  }
}
