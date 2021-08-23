import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageManagementRoutingModule } from './homepage-management-routing.module';
import { HomepageManagementComponent } from './homepage-management/homepage-management.component';

import { PipesModule } from '@audi/data';
import { ClarityModule } from '@clr/angular';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { LanguageSelectorModule } from '../../component-modules/language-selector/language-selector.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FeaturedImageUploaderModule } from '../../component-modules/featured-image-uploader/featured-image-uploader.module';

@NgModule({
  declarations: [HomepageManagementComponent],
  imports: [
    CommonModule,
    ClarityModule,
    HomepageManagementRoutingModule,
    LanguageSelectorModule,
    FormComponentsModule,
    PipesModule,
    FeaturedImageUploaderModule,
    DragDropModule,
  ],
})
export class HomepageManagementModule {}
