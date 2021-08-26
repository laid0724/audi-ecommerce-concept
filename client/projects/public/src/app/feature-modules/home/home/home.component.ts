import { Component, OnInit } from '@angular/core';
import { HomepageService } from '@audi/data';
import { take } from 'rxjs/operators';
@Component({
  selector: 'audi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  homepageData$ = this.homepageService.getHomepage().pipe(take(1));

  constructor(private homepageService: HomepageService) {}

  ngOnInit(): void {}
}
