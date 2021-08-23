import { Component, Input, AfterViewInit } from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';

/*
  NOTE:
    this is not intended to be used as a form control, since none of the
    form control features of a control value accessor are implemented,
    e.g., on select event listener, disabled state, touch/dirty state, etc.

    writing these on my own is not worth the trouble since audi ui already provides
    a form selection component. i dont want to dig into their javascript and debug
    it. a lot of things are simply either broken, missing / partially implemented,
    or poorly documented.

    use this as a navigation component, e.g., for router link navigations.

  ISSUES:
    - click outside drop down to close expanded state not implemented
      - when multiple dropdowns are init, clicking another drop down wont close
        the expanded one
    - cant set active item on init, must be done via user click
*/

/*
  USAGE:

  <audi-nav-dropdown [isLightTheme]="false">
    <audi-nav-item [iconName]="'car'" [iconSize]="'large'">item 1</audi-nav-item>
    <audi-nav-item
      [iconName]="'car'"
      [iconSize]="'large'"
      [routerLink]="['']"
      routerLinkActive
      #rla="routerLinkActive"
      [isActive]="rla.isActive"
      >item 2</audi-nav-item
    >
    <audi-nav-item [iconName]="'car'" [iconSize]="'small'">item 3</audi-nav-item>
    <audi-nav-item>item 4</audi-nav-item>
  </audi-nav-dropdown>
*/

@Component({
  selector: 'audi-nav-dropdown',
  templateUrl: './nav-dropdown.component.html',
  styleUrls: ['./nav-dropdown.component.scss'],
})
export class NavDropdownComponent implements AfterViewInit {
  @Input() isLightTheme: boolean = false;

  ngAfterViewInit(): void {
    const audiNavModules = initAudiModules(AudiModuleName.Nav);

    audiNavModules.forEach((navModule: AudiComponents) => {
      navModule.components.upgradeElements();
    });
  }
}
