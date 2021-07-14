import { OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User, AccountService } from '@audi/data';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'projects/sys/src/environments/environment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-featured-image-uploader',
  templateUrl: './featured-image-uploader.component.html',
  styleUrls: ['./featured-image-uploader.component.scss'],
})
export class FeaturedImageUploaderComponent implements OnInit, OnChanges {
  @Input() modelIdKey: string;
  @Input() modelIdValue: number;
  @Input() featuredImage: any;
  @Input() addFeaturedImageEndpoint: string;
  @Input() deleteFeaturedImageHttpMethod: () => Observable<any>;
  @Output() imageChanges = new EventEmitter<any>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user: User | null) => {
        if (user != null) {
          this.user = user;
        }
      });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      featuredImage,
      modelIdValue,
      addFeaturedImageEndpoint,
      deleteFeaturedImageHttpMethod,
    } = changes;

    const changesToTrack: SimpleChange[] = [
      featuredImage,
      modelIdValue,
      addFeaturedImageEndpoint,
      deleteFeaturedImageHttpMethod,
    ];

    if (changesToTrack.every((c: SimpleChange) => c !== undefined)) {
      const shouldRefreshUploader: boolean = changesToTrack
        .map((c: SimpleChange) => c.currentValue !== c.previousValue)
        .every((isChanged: boolean) => isChanged);

      if (shouldRefreshUploader) {
        this.initializeUploader();
      }
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(): void {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/${this.addFeaturedImageEndpoint}`,
      authToken: `Bearer ${this.user.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true, // remove from drop zone after upload has taken place
      autoUpload: false, // user must click upload after file select
      maxFileSize: 10 * 1024 * 1024, // 10mb
      parametersBeforeFiles: true,
      additionalParameter: {
        [this.modelIdKey]: this.modelIdValue,
      },
    });

    this.uploader.onAfterAddingFile = (file) => {
      // we are already using bearer token to upload file.
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const image = JSON.parse(response);
        this.imageChanges.emit(image);
      }
    };
  }

  onFileSelected(event: any): void {
    const queue = this.uploader.getNotUploadedItems();

    if (queue.length > 1) {
      this.uploader.removeFromQueue(queue[0]);
    }
  }

  deleteFeaturedImage(): void {
    this.deleteFeaturedImageHttpMethod()
      .pipe(take(1))
      .subscribe(() => {
        this.toastr.success('成功 Success');
        this.imageChanges.emit(null);
      });
  }
}
