import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedImageUploaderComponent } from './featured-image-uploader.component';
import { ClarityModule } from '@clr/angular';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [FeaturedImageUploaderComponent],
  imports: [CommonModule, ClarityModule, FileUploadModule],
  exports: [FeaturedImageUploaderComponent],
})
export class FeaturedImageUploaderModule {}
