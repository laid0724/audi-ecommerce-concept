import { Component, Input, OnInit } from '@angular/core';
import { Event, News } from '@audi/data';

@Component({
  selector: 'audi-dynamic-documents-card',
  templateUrl: './dynamic-documents-card.component.html',
  styleUrls: ['./dynamic-documents-card.component.scss'],
})
export class DynamicDocumentsCardComponent implements OnInit {
  @Input() dynamicDocument: Event | News;

  constructor() {}

  ngOnInit(): void {}
}
