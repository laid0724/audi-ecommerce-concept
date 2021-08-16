import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  OnChanges,
  AfterViewInit,
  Output,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { AudiModuleName, initAudiModules, AudiComponents } from '@audi/data';
import { AudiColor, AudiModalType } from '../enums';
import { AudiModalComponent, ModalService } from '../services/modal.service';

import { v4 as uuid } from 'uuid';

/*
  USAGE:
  <audi-modal
    [(isOpen)]="modalOpen"
    [header]="'Modal Title'"
    [headerSize]="3"
    [bgColor]="'white'"
    [textColor]="'black'"
    [type]="'default'"
    [isClosable]="true"
  >
    CONTENT HERE
  </audi-modal>
*/

@Component({
  selector: 'audi-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() type: AudiModalType | string = AudiModalType.Default;
  @Input() isClosable: boolean = true;
  @Input() header: string = '';
  @Input() headerSize: number = 3;
  @Input() bgColor: AudiColor | string = AudiColor.Black;
  @Input() textColor: AudiColor | string = AudiColor.White;

  modalId: string;
  modal: AudiModalComponent | undefined = undefined;

  _isOpen: boolean = false;

  get isOpen(): boolean {
    return this._isOpen;
  }

  @Input('isOpen')
  set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;

    isOpen ? this.openModal() : this.closeModal();
  }

  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  get bgColorClass(): string {
    return `background-color-${this.bgColor}`;
  }

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    const modalId = uuid();
    this.modalId = modalId;
  }

  ngAfterViewInit(): void {
    const audiModalModules = initAudiModules(AudiModuleName.Modal);

    audiModalModules.forEach((modalModule: AudiComponents) => {
      const modals = modalModule.components.upgradeElements();

      if (modals.length > 0) {
        this.modalService.addModals(modals);
      }

      this.modal = this.modalService.getModalById(this.modalId);

      if (this.isOpen) {
        this.modal?.open();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { isOpen } = changes;
    this.isOpen = isOpen.currentValue;
  }

  toggleAndEmitIsOpen() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  openModal(): void {
    if (this.modal !== undefined) {
      this.modal.open();
    }
  }

  closeModal(): void {
    if (this.modal !== undefined) {
      this.modal.close();
    }
  }

  ngOnDestroy(): void {
    this.modalService.deleteModal(this.modalId);
  }
}
