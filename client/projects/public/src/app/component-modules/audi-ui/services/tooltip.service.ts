import { Injectable } from '@angular/core';

export interface AudiTooltipComponent {
  _id: string;
}

@Injectable({
  providedIn: 'any',
})
export class TooltipService {
  upgradedTooltips: AudiTooltipComponent[] = [];

  getTooltips(): AudiTooltipComponent[] {
    return this.upgradedTooltips;
  }

  getTooltipById(uuid: string): AudiTooltipComponent | undefined {
    return this.upgradedTooltips.find((tooltip) => tooltip._id === uuid);
  }

  addTooltips(tooltips: AudiTooltipComponent | AudiTooltipComponent[]): void {
    if (tooltips != null) {
      if (Array.isArray(tooltips) && tooltips.length > 0) {
        this.upgradedTooltips.push(...tooltips);
      } else {
        this.upgradedTooltips.push(tooltips as AudiTooltipComponent);
      }
    }
  }

  deleteTooltip(uuid: string): void {
    this.upgradedTooltips = this.upgradedTooltips.filter(
      (tooltip) => tooltip._id !== uuid
    );
  }
}
