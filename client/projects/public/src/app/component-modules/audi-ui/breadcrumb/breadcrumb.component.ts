import { AfterViewInit, Component, Input } from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';
import { AudiNavThemeClass } from '../enums';
import { AudiNavThemeInput } from '../nav/nav-bar/nav-bar.component';

@Component({
  selector: 'audi-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements AfterViewInit {
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

  public AudiNavThemeClass: AudiNavThemeClass | null;

  ngAfterViewInit(): void {
    const audiBreadcrumbModules = initAudiModules(AudiModuleName.Breadcrumb);

    audiBreadcrumbModules.forEach((breadcrumbModule: AudiComponents) => {
      const breadcrumbs = breadcrumbModule.components.upgradeElements();

      setTimeout(() => {
        breadcrumbs.forEach((breadcrumb: any) => breadcrumb.update());
      }, 0);
    });
  }
}
