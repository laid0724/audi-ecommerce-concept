import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressFgComponent } from './address-fg.component';
import { FormComponentsModule } from '../form-components/form-components.module';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [AddressFgComponent],
  imports: [CommonModule, FormComponentsModule, TranslocoModule],
  exports: [AddressFgComponent],
})
export class AddressFgModule {}
