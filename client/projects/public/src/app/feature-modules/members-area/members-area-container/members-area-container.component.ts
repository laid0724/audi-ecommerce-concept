import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Order,
  BusyService,
  OrdersService,
  LanguageStateService,
} from '@audi/data';
import { Subject } from 'rxjs';

@Component({
  selector: 'audi-members-area-container',
  templateUrl: './members-area-container.component.html',
  styleUrls: ['./members-area-container.component.scss'],
})
export class MembersAreaContainerComponent implements OnInit, OnDestroy {
  order: Order;

  loading = true;

  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busyService: BusyService,
    private orderService: OrdersService,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
