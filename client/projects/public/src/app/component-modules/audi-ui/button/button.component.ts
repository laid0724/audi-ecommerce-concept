import { Component, Input, OnInit } from '@angular/core';
import { AudiModuleName, initAudiModules } from '@audi/data';
import { AudiButton } from '../enums';

@Component({
  selector: 'audi-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() type: AudiButton | string = AudiButton.Primary;
  @Input() isLightTheme: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isActive: boolean = false;

  ngOnInit(): void {
    initAudiModules(AudiModuleName.Response);
  }
}
