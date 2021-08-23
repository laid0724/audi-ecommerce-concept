import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, AfterViewInit, Input } from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';

/*
  USAGE:

  <audi-progress-bar
    class="block my-4"
    [isLightTheme]="false"
    [isContinuous]="false"
    [progress]="50"
  ></audi-progress-bar>
*/

@Component({
  selector: 'audi-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements AfterViewInit, OnChanges {
  @Input() isLightTheme: boolean = false;
  @Input() isContinuous: boolean = false;
  @Input() progress: number = 0;

  progressBars: any | any[];

  ngAfterViewInit(): void {
    const audiProgressModules = initAudiModules(AudiModuleName.Progress);

    audiProgressModules.forEach((progressModule: AudiComponents) => {
      this.progressBars = progressModule.components.upgradeElements();

      this.updateProgressBar(this.progress);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { progress } = changes;

    if (this.progressBars) {
      if (progress.previousValue !== progress.currentValue) {
        this.updateProgressBar(progress.currentValue);
      }
    }
  }

  updateProgressBar(progress: number) {
    if (progress >= 0 && progress <= 100) {
      const progressRatio = progress / 100;

      this.progressBars.forEach((bar: any) => {
        bar.progress(progressRatio);
      });
    }
  }
}
