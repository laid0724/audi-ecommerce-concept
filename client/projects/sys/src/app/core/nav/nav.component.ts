import { Component, OnInit } from '@angular/core';
import { User } from "@audi/data";

@Component({
  selector: 'audi-sys-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  user: Partial<User> = {
    userName: 'admin',
    email: 'admin@audi.com.tw',
  }

  constructor() { }

  ngOnInit(): void {
  }

}
