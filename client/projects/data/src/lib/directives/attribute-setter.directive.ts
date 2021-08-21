import { Input, OnInit } from '@angular/core';
import {
  Directive,
  ElementRef,
  Renderer2,
} from '@angular/core';

/*
  USAGE:
  <audi-button
    attributeSetter
    [attributeName]="'data-close'"
    [applyToInnerNode]="true"
  >
    Primary
  </audi-button>
*/

@Directive({
  selector: '[attributeSetter]',
})
export class AttributeSetterDirective implements OnInit {
  @Input() attributeName: string;
  @Input() attributeValue: any = '';
  @Input() applyToInnerNode: boolean = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.applyToInnerNode) {
      const innerNodes = this.elRef.nativeElement.children as HTMLCollection;

      Array.prototype.forEach.call(innerNodes, (el: HTMLElement) => {
        this.renderer.setAttribute(el, this.attributeName, this.attributeValue);
      });
    } else {
      this.renderer.setAttribute(
        this.elRef.nativeElement,
        this.attributeName,
        this.attributeValue
      );
    }
  }
}
