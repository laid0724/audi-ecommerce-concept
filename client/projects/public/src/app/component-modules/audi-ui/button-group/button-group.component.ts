import { Component, Input, OnInit } from '@angular/core';
import { AudiButtonGroup } from '../enums';

@Component({
  selector: 'audi-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
})
export class ButtonGroupComponent {
  @Input() type: AudiButtonGroup | string = '';
}
