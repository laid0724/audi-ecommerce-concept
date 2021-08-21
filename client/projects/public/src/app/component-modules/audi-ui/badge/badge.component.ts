import { Component, Input } from '@angular/core';
import { AudiColor } from '../enums';

@Component({
  selector: 'audi-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() bgColor: AudiColor | string = AudiColor.Black;
  @Input() textColor: AudiColor | string = AudiColor.White;
  @Input() isSmall: boolean = false;
  @Input() isSmallText: boolean = false;
  @Input() isHidden: boolean = false;
}
