import { QuillModule } from 'ngx-quill';

export const QUILL_STANDARD_MODULES: QuillModule = {
  toolbar: [
    ['bold', 'italic', 'underline'], // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, false] }],
    ['clean'], // remove formatting button
    ['link'], // link and image, video
  ],
};

export const QUILL_STANDARD_MODULES_WITH_IMAGE: QuillModule = {
  toolbar: [
    ['bold', 'italic', 'underline'], // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, false] }],
    ['clean'], // remove formatting button
    ['link', 'image'], // link and image, video
  ],
};
