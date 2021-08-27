import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { PaginationComponent } from './pagination.component';

const COMPONENTS = [PaginationComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, TranslocoModule],
  exports: [...COMPONENTS],
})
export class PaginationModule {}
