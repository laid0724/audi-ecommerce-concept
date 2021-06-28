import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClarityModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FormsComponentModule {}
