import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent } from './image-uploader.component';



@NgModule({
  declarations: [
    ImageUploaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageUploaderComponent
  ]
})
export class ImageUploaderModule { }
