import {
  Component,
  AfterViewInit,
  Input,
  ContentChild,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';
import {
  AudiFlyoutComponent,
  FlyoutService,
} from '../services/flyout-service/flyout.service';

import { v4 as uuid } from 'uuid';

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

  when you want only a specific element to close the flyout on click,
  add the 'close-flyout-trigger' class to the element projected inside 'flyout-content'

  if it is an angular element, you need to use the [classSetter] directive to set the class of the inner element

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
      <button class="close-flyout-trigger">Click Me To Close!</button>
      <audi-button
        type="primary"
        classSetter
        className="close-flyout-trigger"
        >Click Me To Close!</audi-button
      >
    </div>
  </audi-flyout>
*/

@Component({
  selector: 'audi-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.scss'],
})
export class FlyoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ContentChild('triggeringElement', { static: true, read: ElementRef })
  triggeringElement: ElementRef;

  @Input() isLightTheme: boolean = false;
  @Input() position: 'center' | 'right';
  @Input() closeOnClick: boolean = true;

  flyoutId: string;
  flyout: AudiFlyoutComponent | undefined = undefined;

  constructor(
    private flyoutService: FlyoutService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.triggeringElement != undefined) {
      const flyoutId = uuid();
      this.flyoutId = flyoutId;

      this.renderer.setAttribute(
        this.triggeringElement.nativeElement,
        'id',
        uuid()
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.triggeringElement != undefined) {
      const audiFlyoutModules = initAudiModules(AudiModuleName.Flyout);

      audiFlyoutModules.forEach((flyoutModule: AudiComponents) => {
        setTimeout(() => {
          const flyouts = flyoutModule.components.upgradeElements();

          if (flyouts.length > 0) {
            this.flyoutService.addFlyouts(flyouts);
          }

          this.flyout = this.flyoutService.getFlyoutById(this.flyoutId);

          if (this.flyout && this.closeOnClick) {
            const flyoutContent =
              this.flyout._element.querySelector('.flyout-content');

            const navItems = flyoutContent?.querySelectorAll('audi-nav-item');

            if (navItems && navItems?.length > 0) {
              navItems?.forEach((item) => {
                this.renderer.listen(item, 'click', (event: Event) => {
                  this.closeFlyout();
                });
              });
            }

            const customCloseTrigger = flyoutContent?.querySelector(
              '.close-flyout-trigger'
            );

            if (customCloseTrigger) {
              this.renderer.listen(
                customCloseTrigger,
                'click',
                (event: Event) => {
                  this.closeFlyout();
                }
              );
            }
          }
        }, 0);
      });
    }
  }

  closeFlyout(): void {
    this.flyout?.close();
  }

  ngOnDestroy(): void {
    this.flyoutService.deleteFlyout(this.flyoutId);
  }
}
