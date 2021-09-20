import { Component, Input } from '@angular/core';
import { AudiButtonGroup } from '@audi/data';

@Component({
  selector: 'audi-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
})
export class ButtonGroupComponent {
  @Input() type: AudiButtonGroup | string = '';
}
