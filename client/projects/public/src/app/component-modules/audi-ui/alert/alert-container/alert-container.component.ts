import { Component, Input, OnInit } from '@angular/core';
import { AudiAlertStyle, AudiColor } from '../../enums';

/*
  USAGE:

  <audi-alert-container
    [alertStyle]="'default'"
    [openDelay]="500"
    [timeOut]="3000"
    class="my-3 block"
  >
    <p>lorem ipsum....</p>

    <audi-button-group class="mt-4 block">
      <audi-button
        [type]="'primary'"
        applyAttribute
        [attributeName]="'data-close'"
        [applyToInnerNode]="true"
        >Primary</audi-button
      >
      <audi-button [type]="'secondary'">Secondary</audi-button>
    </audi-button-group>
  </audi-alert-container>

*/

export interface AlertConfig {
  audiStyle: 'dark' | 'light';
  bgColor: AudiColor | string;
  textColor: AudiColor | string;
}

@Component({
  selector: 'audi-alert-container',
  templateUrl: './alert-container.component.html',
  styleUrls: ['./alert-container.component.scss'],
})
export class AlertContainerComponent implements OnInit {
  @Input() openDelay: number | null = null;
  @Input() timeOut: number | null = null;
  @Input() alertStyle: AudiAlertStyle | string = AudiAlertStyle.Default;

  alertStyleConfig: AlertConfig = {
    audiStyle: 'light',
    bgColor: AudiColor.White,
    textColor: AudiColor.Black,
  };

  constructor() {}

  ngOnInit(): void {
    switch (this.alertStyle) {
      case AudiAlertStyle.Default:
        this.alertStyleConfig.audiStyle = 'light';
        this.alertStyleConfig.bgColor = AudiColor.White;
        this.alertStyleConfig.textColor = AudiColor.Black;
        break;
      case AudiAlertStyle.Success:
        this.alertStyleConfig.audiStyle = 'light';
        this.alertStyleConfig.bgColor = AudiColor.White;
        this.alertStyleConfig.textColor = AudiColor.Success;
        break;
      case AudiAlertStyle.Warning:
        this.alertStyleConfig.audiStyle = 'dark';
        this.alertStyleConfig.bgColor = AudiColor.Black;
        this.alertStyleConfig.textColor = AudiColor.Warning;
        break;
      case AudiAlertStyle.Danger:
        this.alertStyleConfig.audiStyle = 'dark';
        this.alertStyleConfig.bgColor = AudiColor.Error;
        this.alertStyleConfig.textColor = AudiColor.White;
        break;
      default:
        this.alertStyleConfig.audiStyle = 'light';
        this.alertStyleConfig.bgColor = AudiColor.White;
        this.alertStyleConfig.textColor = AudiColor.Black;
        break;
    }
  }
}
