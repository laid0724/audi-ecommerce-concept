import { Component, Input, AfterViewInit } from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';

/*
  USAGE:

  <audi-nav-list [isLightTheme]="true">
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
  </audi-nav-list>
*/

@Component({
  selector: 'audi-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss'],
})
export class NavListComponent implements AfterViewInit {
  @Input() isLightTheme: boolean = false;

  ngAfterViewInit(): void {
    const audiNavModules = initAudiModules(AudiModuleName.Nav);

    audiNavModules.forEach((navModule: AudiComponents) => {
      navModule.components.upgradeElements();
    });
  }
}
