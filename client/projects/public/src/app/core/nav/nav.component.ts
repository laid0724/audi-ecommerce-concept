import { Component, OnInit } from '@angular/core';
import { LanguageCode, LanguageStateService } from '@audi/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  menuIsOpen = false;

  language$: Observable<LanguageCode> = this.languageService.language$;

  constructor(private languageService: LanguageStateService) {}

  ngOnInit(): void {}

  toggleMenuState(): void {
    this.menuIsOpen = !this.menuIsOpen;
  }
}
