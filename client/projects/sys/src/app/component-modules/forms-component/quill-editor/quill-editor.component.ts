import {
  Component,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
  ViewEncapsulation,
  forwardRef,
  Input,
  AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClrForm } from '@clr/angular';
import { isPlatformBrowser } from '@angular/common';
import Quill from 'quill';
import {
  QuillEditorComponent as NgxQuillEditorComponent,
  QuillModule,
} from 'ngx-quill';
import {
  QUILL_STANDARD_MODULES,
  QUILL_STANDARD_MODULES_WITH_IMAGE,
} from '../../../constants';
import { addCustomQuillImageHandler } from 'projects/sys/src/helpers';
import { ToastrService } from 'ngx-toastr';
import { PhotoService } from '@audi/data';

@Component({
  selector: 'audi-sys-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorComponent),
      multi: true,
    },
  ],
})
export class QuillEditorComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  @ViewChild(ClrForm) clrForm: ClrForm;
  @ViewChild('quillEditor', { static: false })
  quillEditor: NgxQuillEditorComponent;

  @Input() allowImage: boolean = false;

  quillModules: QuillModule;

  loading: boolean = false;
  modalOpen: boolean = false;
  wysiwygTabActive: boolean = true;
  htmlTabActive: boolean = false;

  value: string;

  innerForm: FormGroup = this.fb.group({
    content: [],
  });

  private onChangeFn: any;
  private onTouchedFn: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    if (this.allowImage && isPlatformBrowser(this.platformId)) {
      this.quillModules = QUILL_STANDARD_MODULES_WITH_IMAGE;
    } else {
      this.quillModules = QUILL_STANDARD_MODULES;
    }
  }

  ngAfterViewInit(): void {
    this.quillEditor.registerOnChange = this.onChangeFn;
    this.quillEditor.registerOnTouched = this.onTouchedFn;
  }

  writeValue(value: string): void {
    this.value = value;
    this.innerForm.get('content')?.patchValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  onEditorInit(quill: Quill) {
    // https://stackoverflow.com/questions/59607857/remove-colors-when-pasting-on-ngx-quill-field
    // prevents font color or background being applied when user pastes from clipbaord
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
      delta.forEach((e) => {
        if (e.attributes) {
          e.attributes.color = '';
          e.attributes.background = '';
        }
      });
      return delta;
    });

    /*
      HACK to solve bug: photo wont be inside content unless user hits enter or types soemthing,
      so we use manually trigger the text change handler to force quill to detect changes
    */
    const quillEditorTextChangeHandlerRef =
      this.quillEditor.textChangeHandler.bind(this.quillEditor);
    addCustomQuillImageHandler(quill, quillEditorTextChangeHandlerRef, this.photoService, this.toastr);
  }

  onEdit(): void {
    this.modalOpen = true;
    this.onTouchedFn();
    this.quillEditor?.onModelTouched();
  }

  onCancel(): void {
    this.modalOpen = false;
    this.onTouchedFn();
    this.quillEditor?.onModelTouched();
  }

  onSubmit(): void {
    this.value = this.innerForm.get('content')!.value;
    this.quillEditor?.onModelChange(this.value);
    this.onChangeFn(this.value);
    this.modalOpen = false;
  }
}
