import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { AudiControlType } from '../../audi-ui/enums';
import { ProjectAsFieldDirective } from '../project-as-field.directive';
import { ProjectAsFieldsDirective } from '../project-as-fields.directive';

/*
  USAGE:

    <form [formGroup]="form">
      <audi-control-grid
        [label]="'name'"
        [type]="'input'"
        [isInvalid]="form.touched && form.invalid"
      >
        <!-- TO PROJECT AS ROW -->

        <ng-container *projectAsFields>
          <div class="aui-fieldset__field">
            <audi-input-container
              formControlName="name"
              [label]="'Name'"
              [floatingLabel]="true"
            >
              <audi-control-description>lorem ipsum</audi-control-description>
              <audi-control-valid>lorem ipsum</audi-control-valid>
            </audi-input-container>
          </div>
        </ng-container>

        <!-- TO PROJECT AS COLUMN-->

        <audi-input-container
          *projectAsField
          formControlName="name"
          [label]="'Name'"
          [smallLabel]="' (optional)'"
          [isLightTheme]="false"
          [floatingLabel]="true"
        >
          <audi-control-description>lorem ipsum</audi-control-description>
          <audi-control-valid>lorem ipsum</audi-control-valid>
        </audi-input-container>

        <audi-control-error [type]="'grid'">required</audi-control-error>
      </audi-control-grid>
    </form>
*/

@Component({
  selector: 'audi-control-grid',
  templateUrl: './control-grid.component.html',
  styleUrls: ['./control-grid.component.scss'],
})
export class ControlGridComponent {
  @ContentChildren(ProjectAsFieldsDirective)
  fieldsTemplates: QueryList<ProjectAsFieldsDirective>;

  @ContentChildren(ProjectAsFieldDirective)
  fieldTemplates: QueryList<ProjectAsFieldDirective>;

  @Input() label: string;
  @Input() type: AudiControlType | string = AudiControlType.Input;
  @Input() isInvalid: boolean = false;
}
