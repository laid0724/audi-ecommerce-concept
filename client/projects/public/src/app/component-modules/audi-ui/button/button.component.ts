import { Component, Input, OnInit } from '@angular/core';
import { AudiModuleName, initAudiModules } from '@audi/data';
import { AudiButton } from '../enums';

/*
  USAGE:

  icon btn:
  <audi-button type="icon">
    <audi-icon size="small" iconName="system-download"></audi-icon>
  </audi-button>

  large icon btn:
  <audi-button type="icon-large">
    <audi-icon size="large" iconName="system-download"></audi-icon>
  </audi-button>

  btn primary
  <audi-button type="primary">
    Button
  </audi-button>

  btn secondary
  <audi-button type="secondary">
    Button
  </audi-button>

  btn text
  <audi-button type="text">
    Button
  </audi-button>

  btn active
  <audi-button type="primary" [isActive]="true">
    Button
  </audi-button>

  btn disabled
  <audi-button type="primary" [isDisabled]="true">
    Button
  </audi-button>

  btn light theme
  <audi-button type="primary" [isLightTheme]="true">
    Button
  </audi-button>
*/

@Component({
  selector: 'audi-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() type: AudiButton | string = AudiButton.Primary;
  @Input() isLightTheme: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isActive: boolean = false;

  ngOnInit(): void {
    initAudiModules(AudiModuleName.Response).forEach((button) =>
      button.components?.upgradeElements()
    );
  }
}
