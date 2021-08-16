import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { AudiComponents, AudiModuleName, initAudiModules } from '@audi/data';
import { AudiPopoverPlacement } from '../enums';

import { v4 as uuid } from 'uuid';
import { OnDestroy } from '@angular/core';
import {
  AudiPopoverComponent,
  PopoverService,
} from '../services/popover.service';
import { Renderer2 } from '@angular/core';

// TODO: rfx this into a directive?

/*
  USAGE:

  <audi-popover [placement]="'right'">
    <audi-button #triggeringElement>Popup Right</audi-button>
    <div class="aui-popover__content">
      <div class="aui-popover__media">
        <img
          src="imgUrl"
        />
      </div>
      <div class="aui-popover__text">Lorem ipsum....</div>
    </div>
  </audi-popover>
*/

@Component({
  selector: 'audi-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() placement: AudiPopoverPlacement | string =
    AudiPopoverPlacement.Bottom;

  @ContentChild('triggeringElement', { static: true, read: ElementRef })
  triggeringElement: ElementRef;

  popoverId: string;
  popover: AudiPopoverComponent | undefined = undefined;

  constructor(
    private popoverService: PopoverService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.triggeringElement != undefined) {
      const popoverId = uuid();
      this.popoverId = popoverId;

      this.renderer.setAttribute(
        this.triggeringElement.nativeElement,
        'id',
        uuid()
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.triggeringElement != undefined) {
      const audiPopoverModules = initAudiModules(AudiModuleName.Popover);

      audiPopoverModules.forEach((popoverModule: AudiComponents) => {
        const popovers = popoverModule.components.upgradeElements();

        if (popovers.length > 0) {
          this.popoverService.addPopovers(popovers);
        }

        this.popover = this.popoverService.getPopoverById(this.popoverId);
      });
    }
  }

  ngOnDestroy(): void {
    this.popoverService.deletePopover(this.popoverId);
  }
}
