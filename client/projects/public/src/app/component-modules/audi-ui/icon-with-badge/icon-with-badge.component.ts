import { Component, Input } from '@angular/core';
import { AudiColor } from '../enums';

@Component({
  selector: 'audi-icon-with-badge',
  templateUrl: './icon-with-badge.component.html',
  styleUrls: ['./icon-with-badge.component.scss'],
})
export class IconWithBadgeComponent {
  @Input() size: 'large' | 'small' = 'large';
  @Input() iconName: string;
  @Input() iconColor: AudiColor | string = AudiColor.Black;
  @Input() badgeBgColor: AudiColor | string = AudiColor.Black;
  @Input() badgeTextColor: AudiColor | string = AudiColor.White;
  @Input() badgeIsSmallText: boolean = false;
  @Input() badgeIsHidden: boolean = false;
}
