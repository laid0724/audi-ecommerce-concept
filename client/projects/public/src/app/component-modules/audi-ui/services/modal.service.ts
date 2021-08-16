import { Injectable } from '@angular/core';

export interface AudiModalComponent {
  id: string;
  open: () => void;
  close: () => void;
}

@Injectable({
  providedIn: 'any',
})
export class ModalService {
  upgradedModals: AudiModalComponent[] = [];

  getModals(): AudiModalComponent[] {
    return this.upgradedModals;
  }

  getModalById(uuid: string): AudiModalComponent | undefined {
    return this.upgradedModals.find((modal) => modal.id === uuid);
  }

  addModals(modals: AudiModalComponent | AudiModalComponent[]): void {
    if (modals != null) {
      if (Array.isArray(modals) && modals.length > 0) {
        this.upgradedModals.push(...modals);
      } else {
        this.upgradedModals.push(modals as AudiModalComponent);
      }
    }
  }

  deleteModal(uuid: string): void {
    this.upgradedModals = this.upgradedModals.filter(
      (modal) => modal.id !== uuid
    );
  }
}
