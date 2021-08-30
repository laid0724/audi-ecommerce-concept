import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import {  Router } from '@angular/router';
import { LanguageCode, LanguageStateService } from '@audi/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @ViewChild('expandedMenu') menu: ElementRef<HTMLDivElement>;

  isPristine = true;
  menuIsOpen = false;

  language$: Observable<LanguageCode> = this.languageService.language$;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private languageService: LanguageStateService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  toggleMenuState(isOpen?: boolean): void {
    if (this.isPristine) {
      this.isPristine = false;
    }

    this.menuIsOpen = isOpen ?? !this.menuIsOpen;

    this.menuIsOpen
      ? this.renderer.addClass(this.document.body, 'scroll-disabled')
      : this.renderer.removeClass(this.document.body, 'scroll-disabled');
  }

  directToLogin(): void {
    this.router.navigate(
      ['/', this.languageService.getCurrentLanguage(), 'login'],
      {
        queryParams: { redirectTo: this.router.routerState.snapshot.url },
      }
    );
  }
}
