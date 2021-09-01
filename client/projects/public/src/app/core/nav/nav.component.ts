import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountService,
  LanguageCode,
  LanguageStateService,
  User,
} from '@audi/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'audi-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  @ViewChild('expandedMenu') menu: ElementRef<HTMLDivElement>;

  menuIsPristine = true;
  menuIsOpen = false;

  language$: Observable<LanguageCode> = this.languageService.language$;

  isLoggedIn$: Observable<boolean> = this.accountService.currentUser$.pipe(
    map((user: User | null) => !!user)
  );

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private languageService: LanguageStateService,
    private accountService: AccountService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  toggleMenuState(isOpen?: boolean): void {
    if (this.menuIsPristine) {
      this.menuIsPristine = false;
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

  logout(): void {
    this.accountService.logout();
  }
}
