import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AccountService,
  Product,
  ProductPhoto,
  ProductsService,
  User,
} from '@audi/data';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'projects/sys/src/environments/environment';
import { take } from 'rxjs/operators';
// see https://github.com/valor-software/ng2-file-upload

// TODO: add photo uploader to product category
// TODO: sort photo order

@Component({
  selector: 'audi-sys-product-photo-uploader',
  templateUrl: './product-photo-uploader.component.html',
  styleUrls: ['./product-photo-uploader.component.scss'],
})
export class ProductPhotoUploaderComponent implements OnInit {
  @Input() product: Product;
  @Output() photoChanges = new EventEmitter<ProductPhoto[]>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(
    private accountService: AccountService,
    private productsService: ProductsService,
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

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(): void {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/products/photos/${this.product.id}`,
      authToken: `Bearer ${this.user.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true, // remove from drop zone after upload has taken place
      autoUpload: false, // user must click upload after file select
      maxFileSize: 10 * 1024 * 1024, // 10mb
      parametersBeforeFiles: true,
      additionalParameter: {
        productId: this.product.id,
      },
    });

    this.uploader.onAfterAddingFile = (file) => {
      // we are already using bearer token to upload file.
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: ProductPhoto = JSON.parse(response);
        this.product.photos.push(photo);
        this.photoChanges.emit(this.product.photos);
      }
    };
  }

  setMainPhoto(photo: ProductPhoto): void {
    this.productsService
      .setMainProductPhoto(photo.id)
      .pipe(take(1))
      .subscribe(() => {
        this.toastr.success('成功 Success');
        this.product.photos.forEach((p) => {
          p.isMain = p.id === photo.id;
        });
        this.photoChanges.emit(this.product.photos);
      });
  }

  deletePhoto(photoId: number): void {
    this.productsService
      .deleteProductPhoto(photoId)
      .pipe(take(1))
      .subscribe(() => {
        this.toastr.success('成功 Success');
        this.product.photos = [
          ...this.product.photos.filter((p) => p.id !== photoId),
        ];
        this.photoChanges.emit(this.product.photos);
      });
  }
}
