import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDocumentsRoutingModule } from './dynamic-documents-routing.module';
import { ImgHeaderModule } from '../../component-modules/img-header/img-header.module';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';
import { SpinnerModule } from '../../component-modules/audi-ui/spinner/spinner.module';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { TranslocoModule } from '@ngneat/transloco';
import { ModalModule } from '../../component-modules/audi-ui/modal/modal.module';
import { PaginationModule } from '../../component-modules/audi-ui/pagination/pagination.module';
import { NavModule } from '../../component-modules/audi-ui/nav/nav.module';
import { FlyoutModule } from '../../component-modules/audi-ui/flyout/flyout.module';
import { WysiwygGridDisplayModule } from '../../component-modules/wysiwyg-grid-display/wysiwyg-grid-display.module';

import { DynamicDocumentsListComponent } from './dynamic-documents-list/dynamic-documents-list.component';
import { DynamicDocumentsSingleComponent } from './dynamic-documents-single/dynamic-documents-single.component';
import { DynamicDocumentsCardComponent } from './dynamic-documents-card/dynamic-documents-card.component';

const COMPONENTS = [
  DynamicDocumentsListComponent,
  DynamicDocumentsSingleComponent,
  DynamicDocumentsCardComponent,
];

const IMPORT_MODULES = [
  CommonModule,
  DynamicDocumentsRoutingModule,
  ImgHeaderModule,
  ButtonModule,
  IconModule,
  SpinnerModule,
  FormComponentsModule,
  TranslocoModule,
  ModalModule,
  PaginationModule,
  NavModule,
  FlyoutModule,
  WysiwygGridDisplayModule,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORT_MODULES],
})
export class DynamicDocumentsModule {}
