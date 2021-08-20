import { Injectable } from '@angular/core';
import { PopoverServiceModule } from './popover-service.module';

export interface AudiPopoverComponent {
  _id: string;
}

@Injectable({
  providedIn: PopoverServiceModule,
})
export class PopoverService {
  upgradedPopovers: AudiPopoverComponent[] = [];

  getPopovers(): AudiPopoverComponent[] {
    return this.upgradedPopovers;
  }

  getPopoverById(uuid: string): AudiPopoverComponent | undefined {
    return this.upgradedPopovers.find((popover) => popover._id === uuid);
  }

  addPopovers(popovers: AudiPopoverComponent | AudiPopoverComponent[]): void {
    if (popovers != null) {
      if (Array.isArray(popovers) && popovers.length > 0) {
        this.upgradedPopovers.push(...popovers);
      } else {
        this.upgradedPopovers.push(popovers as AudiPopoverComponent);
      }
    }
  }

  deletePopover(uuid: string): void {
    this.upgradedPopovers = this.upgradedPopovers.filter(
      (popover) => popover._id !== uuid
    );
  }
}
