import {
  Component,
  Input,
  AfterViewInit,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnInit,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  initAudiModules,
  AudiModuleName,
  AudiComponents,
  isNullOrEmptyString,
} from '@audi/data';
import { AudiNavThemeClass } from '../../enums';
import { AudiNavThemeInput } from '../nav-bar/nav-bar.component';
import { NavTabComponent } from '../nav-tab/nav-tab.component';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// for reference, see: https://juristr.com/blog/2016/02/learning-ng2-creating-tab-component/

/*
  USAGE: only one active tab can be set in the beginning by default!

  <audi-nav-tabs theme="grey">
    <audi-nav-tab tabTitle="Tab 1">content 1</audi-nav-tab>
    <audi-nav-tab tabTitle="Tab 2">content 2</audi-nav-tab>
    <audi-nav-tab tabTitle="Tab 3" [isActive]="true">content 3</audi-nav-tab>
    <audi-nav-tab tabTitle="Tab 4">content 4</audi-nav-tab>
    <audi-nav-tab tabTitle="Tab 5" [isDisabled]="true">content 5</audi-nav-tab>
  </audi-nav-tabs>

*/

@Component({
  selector: 'audi-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
})
export class NavTabsComponent
  implements OnInit, AfterContentInit, AfterViewInit, OnDestroy
{
  @ContentChildren(NavTabComponent) tabs: QueryList<NavTabComponent>;

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
      default:
        this.AudiNavThemeClass = null;
        break;
    }
  }

  isDesktop: boolean;
  _breakpointObserverSubscription: Subscription;

  public AudiNavThemeClass: AudiNavThemeClass | null;

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this._breakpointObserverSubscription = this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });
  }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter((tab: NavTabComponent) => tab.isActive);

    if (activeTabs.length === 1) {
      this.onSelectTab(activeTabs[0]);
    }

    if (activeTabs.length > 1) {
      throw new Error('cannot have more than one active tab!');
    }

    if (activeTabs.length === 0) {
      this.onSelectTab(this.tabs.first);
    }
  }

  ngAfterViewInit(): void {
    const audiNavModules = initAudiModules(AudiModuleName.Nav);

    audiNavModules.forEach((navModule: AudiComponents) => {
      const navs = navModule.components.upgradeElements();

      setTimeout(() => {
        navs.forEach((nav: any) => nav.update());
      }, 0);
    });
  }

  onSelectTab(tab: NavTabComponent) {
    this.tabs
      .toArray()
      .forEach((tab: NavTabComponent) => (tab.isActive = false));

    tab.isActive = true;
  }

  ngOnDestroy(): void {
    if (this._breakpointObserverSubscription) {
      this._breakpointObserverSubscription.unsubscribe();
    }
  }
}
