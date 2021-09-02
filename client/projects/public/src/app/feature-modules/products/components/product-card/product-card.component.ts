import { Component, Input, OnInit } from '@angular/core';
import { Product } from '@audi/data';

@Component({
  selector: 'audi-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product;

  constructor() { }

  ngOnInit(): void {
  }

}
