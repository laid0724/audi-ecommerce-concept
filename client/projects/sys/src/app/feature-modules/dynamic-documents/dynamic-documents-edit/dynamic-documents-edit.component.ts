import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import {
  DynamicDocumentsService,
  DynamicDocumentType,
  LanguageCode,
  LanguageStateService,
  Event,
  News,
  Faq,
  WysiwygRowType,
  BusyService,
  getAllErrors,
  formatClrDateToUTCString,
  formatServerTimeToClrDate,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  addWysiwygRow,
  wysiwygGridValidatorBuilderFn,
} from '../../../component-modules/forms-component/wysiwyg-grid/wysiwyg-grid.component';
import {
  DynamicDocumentData,
  DynamicDocumentFormField,
  DynamicDocumentFormSettings,
  DynamicDocumentSettings,
} from '../interfaces';

export const dynamicDocumentFormBuilderFn = (
  fb: FormBuilder,
  settings: DynamicDocumentFormSettings
): FormGroup =>
  Object.keys(settings.fields).reduce((fg: FormGroup, key: string) => {
    const field = (settings.fields as unknown as any)[
      key
    ] as DynamicDocumentFormField;

    if (field) {
      if (field.type === 'wysiwyg') {
        fg.addControl(
          field.key,
          fb.group({
            rows: fb.array([]),
          })
        );
        if (Array.isArray(field.validators) && field.validators.length > 0) {
          fg.get('wysiwyg')?.setValidators(
            wysiwygGridValidatorBuilderFn([...field.validators])
          );
        }
        return fg;
      }

      if (field.type === 'faqitems') {
        fg.addControl(field.key, fb.array([]));
        return fg;
      }

      fg.addControl(
        field.key,
        Array.isArray(field.validators) && field.validators.length > 0
          ? fb.control(null, [...field.validators])
          : fb.control(null)
      );

      if (field.key === 'isVisible') {
        fg.get('isVisible')?.setValue(false);
      }
    }

    return fg;
  }, fb.group({}));

export function isDynamicDocumentFaq(
  dynamicDocument: News | Event | Faq
): dynamicDocument is Faq {
  const { type } = dynamicDocument;
  return type === DynamicDocumentType.Faq && 'faqItems' in dynamicDocument;
}

@Component({
  selector: 'audi-sys-dynamic-documents-edit',
  templateUrl: './dynamic-documents-edit.component.html',
  styleUrls: ['./dynamic-documents-edit.component.scss'],
})
export class DynamicDocumentsEditComponent implements OnInit, OnDestroy {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  dynamicDocumentId: number;
  dynamicDocument: News | Event | Faq;
  dynamicDocumentType: DynamicDocumentType;
  dynamicDocumentSettings: DynamicDocumentSettings;

  title: { zh: string; en: string };
  form: FormGroup;

  destroy$ = new Subject<boolean>();

  get isFaq(): boolean {
    return this.router.url.split('/').includes('faq');
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dynamicDocumentsService: DynamicDocumentsService,
    private languageService: LanguageStateService,
    private busyService: BusyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.languageService.language$
      .pipe(
        switchMap((lang: LanguageCode) =>
          this.route.data.pipe(
            distinctUntilChanged((prev: Data, curr: Data) => {
              const previous = prev as DynamicDocumentData;
              const current = curr as DynamicDocumentData;
              return (
                previous.dynamicDocumentSettings.type ===
                current.dynamicDocumentSettings.type
              );
            }),
            filter((data: Data) => {
              const isValidType = this.isValidDynamicDocumentType(
                data.dynamicDocumentSettings.type
              );
              if (!isValidType) {
                console.error('dynamic document type does not exist!');
              }
              return isValidType;
            }),
            map((data: Data) => {
              const dynamicDocumentData = data as DynamicDocumentData;

              const { dynamicDocumentSettings } = dynamicDocumentData;

              const { form, type, typeName } = dynamicDocumentSettings;

              this.dynamicDocumentType = type;
              this.dynamicDocumentSettings = dynamicDocumentSettings;
              this.title = typeName;
              this.form = dynamicDocumentFormBuilderFn(this.fb, form);

              return dynamicDocumentData;
            }),
            switchMap((data: DynamicDocumentData) => this.route.paramMap),
            filter((pm: ParamMap) => pm.has('dynamicDocumentId') || this.isFaq),
            switchMap((pm: ParamMap) => {
              if (pm.has('dynamicDocumentId')) {
                this.dynamicDocumentId = parseInt(
                  pm.get('dynamicDocumentId') as string
                );
                // @ts-ignore
                return this.dynamicDocumentsService[
                  this.dynamicDocumentType
                ].getOne(this.dynamicDocumentId);
              }

              if (this.isFaq) {
                return this.dynamicDocumentsService.faq.getOne();
              }

              return of(null);
            }),
            tap((res: Event | News | Faq | null) => {
              if (res !== null) {
                if (res.type === 'faq') {
                  this.dynamicDocumentId = res.id as number;
                }

                this.dynamicDocument = res;

                if (
                  !isDynamicDocumentFaq(res) &&
                  this.isFormFieldAvailable('wysiwyg') &&
                  res.wysiwyg != null
                ) {
                  const { wysiwyg } = res;
                  const wysiwygControl = this.form.get('wysiwyg');

                  if (wysiwygControl) {
                    const rowsFA: FormArray = wysiwygControl.get(
                      'rows'
                    ) as FormArray;

                    rowsFA.clear();

                    if (
                      Array.isArray(wysiwyg?.rows) &&
                      wysiwyg?.rows?.length > 0
                    ) {
                      wysiwyg.rows.forEach((row) => {
                        const widthLayout = row.columns
                          .map(({ width }) => width)
                          .toString()
                          .replace(',', '-') as WysiwygRowType;
                        addWysiwygRow(this.fb, rowsFA, widthLayout);
                      });
                      wysiwygControl.patchValue(wysiwyg);
                    }
                  }
                }

                if (
                  isDynamicDocumentFaq(res) &&
                  this.isFaq &&
                  this.isFormFieldAvailable('faqItems')
                ) {
                  const { faqItems } = res;
                  const faqItemsControl = this.form.get(
                    'faqItems'
                  ) as FormArray;

                  faqItemsControl.clear();

                  if (Array.isArray(faqItems) && faqItems.length > 0) {
                    faqItems.forEach((faq) =>
                      faqItemsControl.push(
                        this.fb.group({
                          question: [null, Validators.required],
                          answer: [null, Validators.required],
                        })
                      )
                    );
                  }
                }

                this.form.patchValue(res);

                if (
                  !isDynamicDocumentFaq(res) &&
                  this.isFormFieldAvailable('date')
                ) {
                  this.form
                    .get('date')
                    ?.patchValue(formatServerTimeToClrDate(res.date as Date));
                }
              }
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((_) => this.busyService.idle());
  }

  isValidDynamicDocumentType(type: string): boolean {
    return Object.keys(this.dynamicDocumentsService).includes(type);
  }

  isFormFieldAvailable(formFieldName: string): boolean {
    return this.dynamicDocumentSettings.form.fields
      .map(({ key }) => key)
      .includes(formFieldName);
  }

  getFormField(formFieldName: string): DynamicDocumentFormField | undefined {
    return this.dynamicDocumentSettings.form.fields.find(
      (f) => f.key === formFieldName
    );
  }

  onSave(): void {
    if (this.form.invalid) {
      this.clrForm.markAsTouched();
      this.form.markAllAsTouched();
      console.log(getAllErrors(this.form));
      this.toastr.error('儲存失敗 Saving failed');
      return;
    }

    let formValue = {
      ...this.form.value,
    };

    if (this.isFormFieldAvailable('date')) {
      const { date } = formValue;

      formValue = {
        ...formValue,
        date: formatClrDateToUTCString(date),
      };
    }

    // @ts-ignore
    (this.dynamicDocumentsService[this.dynamicDocumentType] as any)
      .update(formValue)
      .pipe(take(1))
      .subscribe((res: News | Event | Faq) => {
        this.dynamicDocument = res;
        this.toastr.success('更新成功 Updated successfully');
      });
  }

  onCreate(): void {
    if (this.form.invalid) {
      this.clrForm.markAsTouched();
      this.form.markAllAsTouched();
      console.log(getAllErrors(this.form));
      this.toastr.error('儲存失敗 Saving failed');
      return;
    }

    let formValue = {
      ...this.form.value,
    };

    if (this.isFormFieldAvailable('date')) {
      const { date } = formValue;

      formValue = {
        ...formValue,
        date: formatClrDateToUTCString(date),
      };
    }

    // @ts-ignore
    (this.dynamicDocumentsService[this.dynamicDocumentType] as any)
      .add(formValue)
      .pipe(take(1))
      .subscribe((res: News | Event | Faq) => {
        this.router.navigate([`/manage/${this.dynamicDocumentType}/${res.id}`]);
        this.toastr.success('建立成功 Created successfully');
      });
  }

  onImageChange(image: any): void {
    this.dynamicDocument.featuredImage = image;
  }

  deleteFeaturedImageFn(dynamicDocumentId: number): () => Observable<null> {
    const fn = () =>
      this.dynamicDocumentsService[
        this.dynamicDocumentType
      ].deleteFeaturedImage(dynamicDocumentId);

    return fn;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
