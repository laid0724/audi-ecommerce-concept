import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'audi-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  menuIsOpen = false;

  constructor() {}

  ngOnInit(): void {}

  toggleMenuState(): void {
    this.menuIsOpen = !this.menuIsOpen;
  }
}
