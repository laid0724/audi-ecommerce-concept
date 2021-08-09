import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageManagementRoutingModule } from './homepage-management-routing.module';
import { HomepageManagementComponent } from './homepage-management/homepage-management.component';

import { PipesModule } from '@audi/data';
import { ClarityModule } from '@clr/angular';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsComponentModule } from '../../component-modules/forms-component/forms-component.module';
import { LanguageSelectorModule } from '../../component-modules/language-selector/language-selector.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [HomepageManagementComponent],
  imports: [
    CommonModule,
    ClarityModule,
    HomepageManagementRoutingModule,
    LanguageSelectorModule,
    FormsComponentModule,
    PipesModule,
    FileUploadModule,
    DragDropModule,
  ],
})
export class HomepageManagementModule {}
