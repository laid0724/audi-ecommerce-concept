import { Component, AfterViewInit } from '@angular/core';
import { AudiComponents, AudiModuleName, initAudiModules } from '@audi/data';

@Component({
  selector: 'audi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const audiHeaderModules = initAudiModules(AudiModuleName.Header);

    audiHeaderModules.forEach((headerModule: AudiComponents) => {
      headerModule.components.upgradeElements();
    });
  }
}
