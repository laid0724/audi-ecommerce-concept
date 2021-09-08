import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WysiwygGrid } from '@audi/data';

@Component({
  selector: 'audi-wysiwyg-grid-display',
  templateUrl: './wysiwyg-grid-display.component.html',
  styleUrls: ['./wysiwyg-grid-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WysiwygGridDisplayComponent {
  @Input()
  wysiwygGrid: WysiwygGrid;
}
