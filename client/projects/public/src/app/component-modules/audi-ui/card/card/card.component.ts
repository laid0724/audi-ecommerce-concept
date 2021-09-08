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
  @Input() textAlign: 'left' | 'center' | 'right' = 'left';
  @Input() headerSize: number = 5;
  @Input() header: string = '';
  @Input() headerSmallCaption: string | null = '';
  @Input() headerPreviewCaption: string | null = '';
  @Input() isClickable: boolean = false;
  @Input() backgroundImageUrl: string = '';
  @Input() coverImageUrl: string = '';
  @Input() isBordered: boolean = false;
  @Input() imageBordered: boolean = false;
  @Input() borderColor: AudiColor | string = AudiColor.Grey1;
  @Input() isDisabled: boolean = false;

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;
}
