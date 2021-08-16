import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';
import {
  AudiTooltipComponent,
  TooltipService,
} from '../services/tooltip.service';

import { v4 as uuid } from 'uuid';

/*
  USAGE:

  <audi-tooltip [isDarkTheme]="false">
    <a class="aui-textlink" #triggeringElement>tool tip example</a>
    <img class="aui-tooltip__media" src="imgUrl" />
    <span class="aui-tooltip__text">Lorem ipsum....</span>
  </audi-tooltip>

  <audi-tooltip [isDarkTheme]="false">
    <a class="aui-textlink" #triggeringElement>tool tip example</a>
    <span class="aui-tooltip__text">Lorem ipsum....</span>
  </audi-tooltip>

  <audi-tooltip [isDarkTheme]="true">
    <a class="aui-textlink" #triggeringElement>tool tip example</a>
    <img class="aui-tooltip__media" src="imgUrl" />
    <span class="aui-tooltip__text">Lorem ipsum....</span>
  </audi-tooltip>

  <audi-tooltip [isDarkTheme]="true">
    <a class="aui-textlink" #triggeringElement>tool tip example</a>
    <span class="aui-tooltip__text">Lorem ipsum....</span>
  </audi-tooltip>
*/

@Component({
  selector: 'audi-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit, OnDestroy {
  @Input() isDarkTheme: boolean = false;

  @ContentChild('triggeringElement', { static: true, read: ElementRef })
  triggeringElement: ElementRef;

  tooltipId: string;
  tooltip: AudiTooltipComponent | undefined = undefined;

  constructor(
    private tooltipService: TooltipService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.triggeringElement != undefined) {
      const tooltipId = uuid();
      this.tooltipId = tooltipId;

      this.renderer.setAttribute(
        this.triggeringElement.nativeElement,
        'id',
        uuid()
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.triggeringElement != undefined) {
      const audiTooltipModules = initAudiModules(AudiModuleName.Tooltip);

      audiTooltipModules.forEach((tooltipModule: AudiComponents) => {
        const tooltips = tooltipModule.components.upgradeElements();

        if (tooltips.length > 0) {
          this.tooltipService.addTooltips(tooltips);
        }

        this.tooltip = this.tooltipService.getTooltipById(this.tooltipId);
      });
    }
  }

  ngOnDestroy(): void {
    this.tooltipService.deleteTooltip(this.tooltipId);
  }
}
