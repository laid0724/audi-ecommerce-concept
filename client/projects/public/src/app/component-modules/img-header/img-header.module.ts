import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { ImgHeaderComponent } from './img-header.component';

@NgModule({
  declarations: [ImgHeaderComponent],
  imports: [CommonModule, TranslocoModule],
  exports: [ImgHeaderComponent],
})
export class ImgHeaderModule {}
