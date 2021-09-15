import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isNullOrEmptyString } from '@audi/data';

@Component({
  selector: 'audi-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
})
export class NavItemComponent implements OnChanges {
  @Input() isActive: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() externalLink: string;
  @Input() iconName: string;
  @Input() iconSize: 'large' | 'small' = 'small';

  navBarRef: any = null;

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;

  ngOnChanges(changes: SimpleChanges): void {
    const { isActive } = changes;

    if (
      this.navBarRef !== null &&
      Array.isArray(this.navBarRef) &&
      this.navBarRef.length > 0 &&
      isActive.currentValue
    ) {
      setTimeout(() => {
        this.navBarRef.forEach((navbar: any) => navbar.update());
      }, 0);
    }
  }
}
