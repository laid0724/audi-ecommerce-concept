import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from './language-selector.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [LanguageSelectorComponent],
  imports: [CommonModule, ClarityModule],
  exports: [LanguageSelectorComponent],
})
export class LanguageSelectorModule {}
