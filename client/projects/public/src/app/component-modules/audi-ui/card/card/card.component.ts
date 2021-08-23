import { Component, Input } from '@angular/core';
import { isNullOrEmptyString } from '@audi/data';
import { AudiColor } from '../../enums';

@Component({
  selector: 'audi-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() bgColor: AudiColor | string = AudiColor.White;
  @Input() textColor: AudiColor | string = AudiColor.Black;
  @Input() headerSize: number = 5;
  @Input() header: string = '';
  @Input() headerSmallCaption: string = '';
  @Input() headerPreviewCaption: string = '';
  @Input() isClickable: boolean = false;
  @Input() backgroundImageUrl: string = '';
  @Input() coverImageUrl: string = '';

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;
}
