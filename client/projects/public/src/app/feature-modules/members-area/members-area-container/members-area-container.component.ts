import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageStateService, LanguageCode } from '@audi/data';

@Component({
  selector: 'audi-members-area-container',
  templateUrl: './members-area-container.component.html',
  styleUrls: ['./members-area-container.component.scss'],
})
export class MembersAreaContainerComponent implements OnInit {
  activeRoute: string = 'personal-info';
  tabRoutes = ['personal-info', 'liked-products', 'order-history'];

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  constructor(
    private router: Router,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {
    this.tabRoutes.forEach((route: string) => {
      if (this.router.url.includes(route)) {
        this.activeRoute = route;
      }
    });
  }

  onTabIndexChange(tabIndex: number): void {
    this.router.navigate([
      '/',
      this.language,
      'members-area',
      this.tabRoutes[tabIndex],
    ]);
  }
}
