import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[classSetter]',
})
export class ClassSetterDirective implements OnInit {
  @Input() className: string;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const innerNodes = this.elRef.nativeElement.children as HTMLCollection;

    Array.prototype.forEach.call(innerNodes, (el: HTMLElement) => {
      this.renderer.addClass(el, this.className);
    });
  }
}
