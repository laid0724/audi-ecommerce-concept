import { Component, Input } from '@angular/core';
import { AudiColor } from '@audi/data';

@Component({
  selector: 'audi-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() bgColor: AudiColor | string = AudiColor.Black;
  @Input() textColor: AudiColor | string = AudiColor.White;
  @Input() isSmall: boolean = false;
  @Input() isSmallAndAnimated: boolean = false;
  @Input() isSmallText: boolean = false;
  @Input() isHidden: boolean = false;
}
