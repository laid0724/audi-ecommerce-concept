import { Component, Input } from '@angular/core';

@Component({
  selector: 'audi-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() size: 'small' | 'large' = 'small';
  // for audi icon names, see, e.g.,: https://www.audi.com/ci/en/guides/user-interface/icon-library.html
  @Input() iconName: string;
}
