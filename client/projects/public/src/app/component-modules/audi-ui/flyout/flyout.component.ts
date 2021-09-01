import {
  Component,
  AfterViewInit,
  Input,
  ContentChild,
  ElementRef,
} from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';

// TODO: implement close on click optional input

/*
  USAGE:

  when the trigger element is an angular host element:

  <audi-flyout position="center" [isLightTheme]="true">
    <audi-button
      type="icon-large"
      #triggeringElement
      flyoutTriggerSetter
      [applyToInnerElement]="true"
    >
      <audi-icon size="large" iconName="system-download"></audi-icon>
    </audi-button>
    <div class="flyout-content">
      <audi-nav-list [isLightTheme]="true">
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 1</audi-nav-item
        >
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 2</audi-nav-item
        >
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 3</audi-nav-item
        >
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 4</audi-nav-item
        >
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 5</audi-nav-item
        >
      </audi-nav-list>
    </div>
  </audi-flyout>

  when the triggering element is just an html element:

  <audi-flyout position="center">
    <button
      class="aui-button aui-button--primary flex"
      #triggeringElement
      flyoutTriggerSetter
    >
      <audi-icon size="small" iconName="download"></audi-icon>
      <span class="ml-2">Download</span>
    </button>
    <div class="flyout-content">
      <audi-nav-list>
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 1</audi-nav-item
        >
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 2</audi-nav-item
        >
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 3</audi-nav-item
        >
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 4</audi-nav-item
        >
        <audi-nav-item [iconName]="'download'" [iconSize]="'small'"
          >item 5</audi-nav-item
        >
      </audi-nav-list>
    </div>
  </audi-flyout>
*/

@Component({
  selector: 'audi-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.scss'],
})
export class FlyoutComponent implements AfterViewInit {
  @Input() isLightTheme: boolean = false;
  @Input() position: 'center' | 'right';

  @ContentChild('triggeringElement', { static: true, read: ElementRef })
  triggeringElement: ElementRef;

  ngAfterViewInit(): void {
    if (this.triggeringElement != undefined) {
      const audiFlyoutModules = initAudiModules(AudiModuleName.Flyout);

      audiFlyoutModules.forEach((flyoutModule: AudiComponents) => {
        setTimeout(() => {
          flyoutModule.components.upgradeElements();
        }, 0);
      });
    }
  }
}
