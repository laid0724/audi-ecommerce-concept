import { Component, Input } from '@angular/core';
import { AudiControlType } from '@audi/data';

@Component({
  selector: 'audi-control-description',
  templateUrl: './control-description.component.html',
  styleUrls: ['./control-description.component.scss'],
})
export class ControlDescriptionComponent {
  @Input() type: AudiControlType | string = AudiControlType.Input;
}
