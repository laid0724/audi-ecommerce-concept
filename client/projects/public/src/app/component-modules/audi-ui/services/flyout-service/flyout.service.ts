import { Injectable } from '@angular/core';
import { FlyoutServiceModule } from './flyout-service.module';

export interface AudiFlyoutComponent {
  _element: HTMLElement
  close: () => void;
}

@Injectable({
  providedIn: FlyoutServiceModule,
})
export class FlyoutService {
  upgradedFlyouts: AudiFlyoutComponent[] = [];

  getFlyouts(): AudiFlyoutComponent[] {
    return this.upgradedFlyouts;
  }

  getFlyoutById(uuid: string): AudiFlyoutComponent | undefined {
    return this.upgradedFlyouts.find((flyout => flyout._element.id === uuid));
  }

  addFlyouts(flyouts: AudiFlyoutComponent | AudiFlyoutComponent[]): void {
    if (flyouts != null) {
      if (Array.isArray(flyouts) && flyouts.length > 0) {
        this.upgradedFlyouts.push(...flyouts);
      } else {
        this.upgradedFlyouts.push(flyouts as AudiFlyoutComponent);
      }
    }
  }

  deleteFlyout(uuid: string): void {
    this.upgradedFlyouts = this.upgradedFlyouts.filter(
      (flyout) => flyout._element.id !== uuid
    );
  }
}
