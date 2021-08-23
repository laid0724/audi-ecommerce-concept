import { Component, Input } from '@angular/core';

/*

  USAGE:

  <audi-breadcrumb>
    <li class="aui-breadcrumb__item" audiBreadCrumbItem>
      Audi
    </li>

    <li class="aui-breadcrumb__item" audiBreadCrumbItem>
      Kundenbereich
    </li>

    <li class="aui-breadcrumb__item" audiBreadCrumbItem>
      Reparatur und Service
    </li>

    <li class="aui-breadcrumb__item" audiBreadCrumbItem">
      Audi Original Staub- und Pollenfilter
    </li>
  </audi-breadcrumb>

*/

@Component({
  // this allows the rendering of the template without its host element wrapper
  // i am doing this because the js for audi ui gets messed up if aui-breadcrumb__item
  // is wrapped around another container element
  // see: https://stackoverflow.com/questions/38716105/angular2-render-a-component-without-its-wrapping-tag
  selector: '[audiBreadCrumbItem]',
  templateUrl: './breadcrumb-item.component.html',
  styleUrls: ['./breadcrumb-item.component.scss'],
})
export class BreadcrumbItemComponent {}
