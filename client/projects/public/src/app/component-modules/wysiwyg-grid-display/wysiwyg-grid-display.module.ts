import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WysiwygGridDisplayComponent } from './wysiwyg-grid-display.component';
import { PipesModule } from '@audi/data';

@NgModule({
  declarations: [WysiwygGridDisplayComponent],
  imports: [CommonModule, PipesModule],
  exports: [WysiwygGridDisplayComponent],
})
export class WysiwygGridDisplayModule {}
