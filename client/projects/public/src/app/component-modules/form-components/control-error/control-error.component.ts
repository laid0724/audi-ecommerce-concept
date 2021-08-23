import { Component, Input } from '@angular/core';
import { AudiControlType } from '../../audi-ui/enums';

@Component({
  selector: 'audi-control-error',
  templateUrl: './control-error.component.html',
  styleUrls: ['./control-error.component.scss'],
})
export class ControlErrorComponent {
  @Input() type: AudiControlType | string = AudiControlType.Input;
}
