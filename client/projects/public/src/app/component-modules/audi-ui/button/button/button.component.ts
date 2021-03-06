import { AfterViewInit, Component, Input } from '@angular/core';
import { AudiModuleName, initAudiModules } from '@audi/data';
import { AudiButton } from '@audi/data';

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

  btn primary with icon and text
  <audi-button type="primary" class="flex">
    <audi-icon size="small" iconName="download"></audi-icon>
    <span class="ml-2">Download</span>
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
export class ButtonComponent implements AfterViewInit {
  @Input() type: AudiButton | string = AudiButton.Primary;
  @Input() isLightTheme: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isActive: boolean = false;

  ngAfterViewInit(): void {
    initAudiModules(AudiModuleName.Response).forEach((button) =>
      setTimeout(() => {
        button.components?.upgradeElements();
      }, 0)
    );
  }
}
