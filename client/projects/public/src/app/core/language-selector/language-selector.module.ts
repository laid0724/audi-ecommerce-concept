import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { FlyoutModule } from '../../component-modules/audi-ui/flyout/flyout.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';
import { NavModule } from '../../component-modules/audi-ui/nav/nav.module';
import { LanguageSelectorComponent } from './language-selector.component';
import { RouterModule } from '@angular/router';

const COMPONENTS = [LanguageSelectorComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    FlyoutModule,
    NavModule,
    RouterModule,
  ],
  exports: [...COMPONENTS],
})
export class LanguageSelectorModule {}
