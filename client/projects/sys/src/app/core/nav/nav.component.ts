import { Component, OnInit } from '@angular/core';
import { AccountService, User } from "@audi/data";
import { Observable } from "rxjs";

@Component({
  selector: 'audi-sys-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.user$ = this.accountService.currentUser$
  }

  logout(): void {
    this.accountService.logout();
  }

}
