import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageCode, LanguageStateService } from '@audi/data';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'audi-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  public LanguageCode: typeof LanguageCode = LanguageCode;

  language$: Observable<LanguageCode>;

  constructor(
    private languageService: LanguageStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.language$ = this.languageService.language$.pipe(
      distinctUntilChanged()
    );
  }

  onSelectLanguage(languageCode: LanguageCode): void {
    // this.languageService.selectLanguage(languageCode);
    this.router.navigate(['/', languageCode, 'home']);
  }
}
