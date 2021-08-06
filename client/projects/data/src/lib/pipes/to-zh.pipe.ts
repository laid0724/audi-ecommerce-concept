import { Pipe, PipeTransform } from '@angular/core';
import { Gender, LanguageCode } from '../enums';

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

    if (type === 'isVisibleWithEn') {
      switch (value) {
        case true:
          return '顯示 Visible';
        case false:
          return '隱藏 Hidden';
        default:
          return '';
      }
    }

    if (type === 'isDisabledWithEn') {
      switch (value) {
        case true:
          return '停權中 Disabled';
        case false:
          return '開啟中 Enabled';
        default:
          return '';
      }
    }

    if (type === 'emailConfirmedWithEn') {
      switch (value) {
        case true:
          return '已認證 Confirmed';
        case false:
          return '未認證 Not Confirmed';
        default:
          return '';
      }
    }

    if (type === 'isDiscountedWithEn') {
      switch (value) {
        case true:
          return '折扣中 Discounted';
        case false:
          return '原價 No Discount';
        default:
          return '';
      }
    }

    if (type === 'genderWithEn') {
      switch (value) {
        case Gender.Male:
          return '男 Male';
        case Gender.Female:
          return '女 Female';
        case Gender.Other:
          return '其他 Other';
      }
    }

    switch (value) {
      case null || undefined || '':
        return '';
      case LanguageCode.Zh:
        return '中文';
      case LanguageCode.En:
        return '英文';

      case Gender.Male:
        return '男';
      case Gender.Female:
        return '女';
      case Gender.Other:
        return '其他';

      case true:
        return '是';
      case false:
        return '否';

      default:
        return '';
    }
  }
}
