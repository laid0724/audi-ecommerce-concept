// see: https://fslightbox.com/javascript/documentation/how-to-use
declare module 'fslightbox';

declare class FsLightbox {
  open: (index?: number) => void;
  close: (index?: number) => void;
  props: {
    onOpen?: Function;
    onClose?: Function;
    onInit?: Function;
    onShow?: Function;
  };
}

declare function refreshFsLightbox(): void;

declare var fsLightboxInstances: {
  [key: string]: FsLightbox;
};
