import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon/icon.module';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavListComponent } from './nav-list/nav-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavTabComponent } from './nav-tab/nav-tab.component';
import { NavDropdownComponent } from './nav-dropdown/nav-dropdown.component';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';

const COMPONENTS = [
  NavItemComponent,
  NavListComponent,
  NavDropdownComponent,
  NavBarComponent,
  NavTabsComponent,
  NavTabComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, IconModule],
  exports: [...COMPONENTS],
})
export class NavModule {}
