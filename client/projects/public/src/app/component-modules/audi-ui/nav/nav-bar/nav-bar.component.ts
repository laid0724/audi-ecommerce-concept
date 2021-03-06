import {
  Component,
  Input,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  initAudiModules,
  AudiModuleName,
  AudiComponents,
  AudiNavThemeClass,
} from '@audi/data';
import { Subject } from 'rxjs';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { takeUntil } from 'rxjs/operators';

/*

  USAGE:

  <audi-nav-bar class="block my-4" [isSmall]="false" [theme]="'white'">
    <audi-nav-item [isActive]="false">item 1</audi-nav-item>
    <audi-nav-item [isDisabled]="true">item 2</audi-nav-item>
    <audi-nav-item
      [routerLink]="['']"
      routerLinkActive
      #rla="routerLinkActive"
      [isActive]="rla.isActive"
      >item 3</audi-nav-item
    >
    <audi-nav-item>item 4</audi-nav-item>
    <audi-nav-item>item 5</audi-nav-item>
  </audi-nav-bar>

*/

export type AudiNavThemeInput =
  | 'white'
  | 'black'
  | 'red'
  | 'silver'
  | 'warm-silver'
  | 'grey'
  | 'default';

@Component({
  selector: 'audi-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ContentChildren(NavItemComponent) items: QueryList<NavItemComponent>;

  @Input() isSmall: boolean = false;

  _theme: AudiNavThemeInput;

  get theme(): AudiNavThemeInput {
    return this._theme;
  }

  @Input('theme')
  set theme(value: AudiNavThemeInput) {
    this._theme = value;

    switch (value) {
      case 'white':
        this.AudiNavThemeClass = AudiNavThemeClass.White;
        break;
      case 'black':
        this.AudiNavThemeClass = AudiNavThemeClass.Black;
        break;
      case 'red':
        this.AudiNavThemeClass = AudiNavThemeClass.Red;
        break;
      case 'silver':
        this.AudiNavThemeClass = AudiNavThemeClass.Silver;
        break;
      case 'warm-silver':
        this.AudiNavThemeClass = AudiNavThemeClass.WarmSilver;
        break;
      case 'grey':
        this.AudiNavThemeClass = AudiNavThemeClass.Grey;
        break;
      case 'default':
        this.AudiNavThemeClass = AudiNavThemeClass.Default;
        break;
      default:
        this.AudiNavThemeClass = null;
        break;
    }
  }

  isDesktop: boolean;

  destroy$ = new Subject<boolean>();

  public AudiNavThemeClass: AudiNavThemeClass | null;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });
  }

  ngAfterViewInit(): void {
    const audiNavModules = initAudiModules(AudiModuleName.Nav);

    audiNavModules.forEach((navModule: AudiComponents) => {
      const navBarComponents = navModule.components.upgradeElements();

      const navItemComponents = this.items.toArray();

      navItemComponents.forEach((c) => (c.navBarRef = navBarComponents));

      setTimeout(() => {
        navBarComponents.forEach((navbar: any) => navbar.update());
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
