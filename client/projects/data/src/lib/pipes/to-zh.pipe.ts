import { Pipe, PipeTransform } from '@angular/core';
import { LanguageCode } from '@audi/data';

@Pipe({
  name: 'toZh',
})
export class ToZhPipe implements PipeTransform {
  transform(value: string | null | undefined | boolean, type?: string): string {
    if (type === 'withEnglishBoolean') {
      switch (value) {
        case true:
          return '是 Yes';
        case false:
          return '否 No';
        default:
          return '';
      }
    }

    if (type === 'isVisible') {
      switch (value) {
        case true:
          return '顯示 Visible';
        case false:
          return '隱藏 Hidden';
        default:
          return '';
      }
    }

    if (type === 'isDiscounted') {
      switch (value) {
        case true:
          return '折扣中 Discounted';
        case false:
          return '原價 No Discount';
        default:
          return '';
      }
    }

    switch (value) {
      case null || undefined || '':
        return '';
      case LanguageCode.Zh:
        return '中文';
      case LanguageCode.En:
        return '英文';

      // case Gender.Male:
      //   return '男';
      // case Gender.Female:
      //   return '女';

      case true:
        return '是';
      case false:
        return '否';

      default:
        return '';
    }
  }
}
