import { Component, Input } from '@angular/core';
import { AudiControlType } from '../../audi-ui/enums';

@Component({
  selector: 'audi-control-valid',
  templateUrl: './control-valid.component.html',
  styleUrls: ['./control-valid.component.scss'],
})
export class ControlValidComponent {
  @Input() type: AudiControlType | string = AudiControlType.Input;
}
