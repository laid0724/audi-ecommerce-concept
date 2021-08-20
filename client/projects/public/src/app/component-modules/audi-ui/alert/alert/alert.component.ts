import { AfterViewInit, Component, Input } from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';
import { AudiAlertType, AudiColor } from '../../enums';

@Component({
  selector: 'audi-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements AfterViewInit {
  @Input() openDelay: number | null = null;
  @Input() timeOut: number | null = null;
  @Input() type: AudiAlertType | string = AudiAlertType.Default;
  @Input() audiStyle: 'dark' | 'light' = 'light';
  @Input() bgColor: AudiColor | string = AudiColor.White;
  @Input() textColor: AudiColor | string = AudiColor.Black;

  ngAfterViewInit(): void {
    console.log(this.audiStyle);
    const alert = initAudiModules(AudiModuleName.Alert);

    alert.forEach((m: AudiComponents) => {
      const alertComponents = m.components.upgradeElements();

      // HACK: we are pushing audi's native js functions to the back of the event loop so that
      // ui animation changes are in sync with angular, or else the alert container's height gets buggy
      setTimeout(() => {
        alertComponents.forEach((c: any) => c.update());
      }, this.openDelay ?? 0);

      if (this.timeOut !== null) {
        alertComponents.forEach((n: any) => {
          setTimeout(() => {
            n.close();
          }, this.timeOut as number);
        });
      }
    });
  }
}
