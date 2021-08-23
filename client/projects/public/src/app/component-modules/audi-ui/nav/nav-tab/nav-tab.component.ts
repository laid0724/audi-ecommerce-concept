import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'audi-nav-tab',
  templateUrl: './nav-tab.component.html',
  styleUrls: ['./nav-tab.component.scss'],
})
export class NavTabComponent {
  @HostBinding('class.block') displayBlock: boolean = true;
  @Input() isActive: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() tabTitle: string = 'Tab';
}
