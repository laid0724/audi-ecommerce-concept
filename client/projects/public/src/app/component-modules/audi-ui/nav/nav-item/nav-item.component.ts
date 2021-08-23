import { Component, Input } from '@angular/core';
import { isNullOrEmptyString } from '@audi/data';

@Component({
  selector: 'audi-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
})
export class NavItemComponent {
  @Input() isActive: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() externalLink: string;
  @Input() iconName: string;
  @Input() iconSize: 'large' | 'small' = 'small';

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;
}
