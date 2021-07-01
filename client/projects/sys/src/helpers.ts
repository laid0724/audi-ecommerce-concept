import { PhotoService } from '@audi/data';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';

// see: https://github.com/quilljs/quill/issues/1400, and
// see: https://github.com/quilljs/quill/issues/863
export function addCustomQuillImageHandler(
  quill: Quill,
  photoService: PhotoService,
  toastr: ToastrService
) {
  /**
   * Step1. select local image
   *
   */
  function selectLocalImage() {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg');
    fileInput.click();

    // Listen upload local image and save to server
    fileInput.onchange = () => {
      if (fileInput.files != null && fileInput.files[0] != null) {
        const file = fileInput.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
          saveToServer(file);
        } else {
          toastr.warning('請選擇圖片 Only images are allowed');
        }
      }
    };
  }

  /**
   * Step2. save to server
   *
   * @param {File} file
   */
  function saveToServer(file: File) {
    photoService
      .uploadPhoto(file)
      .subscribe((photoUrl: string) => insertToEditor(photoUrl));
  }

  /**
   * Step3. insert image url to rich editor.
   *
   * @param {string} url
   */
  function insertToEditor(url: string) {
    // push image url to rich editor.
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', `${url}`);
  }

  // quill editor add image handler
  quill.getModule('toolbar').addHandler('image', () => {
    selectLocalImage();
  });
}
