import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../component-modules/audi-ui/header/header.module';
import { ButtonModule } from '../component-modules/audi-ui/button/button.module';
import { IconModule } from '../component-modules/audi-ui/icon/icon.module';
import { NavModule } from '../component-modules/audi-ui/nav/nav.module';
import { LanguageSelectorModule } from './language-selector/language-selector.module';

import { NotFoundComponent } from './not-found/not-found.component';
import { NavComponent } from './nav/nav.component';

const COMPONENTS = [NotFoundComponent, NavComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    RouterModule,
    HeaderModule,
    ButtonModule,
    IconModule,
    NavModule,
    LanguageSelectorModule
  ],
  exports: [...COMPONENTS],
})
export class CoreModule {}
