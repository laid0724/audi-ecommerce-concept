import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[flyoutTriggerSetter]',
})
export class FlyoutTriggerSetterDirective implements OnInit {
  @Input() applyToInnerElement: boolean = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.applyToInnerElement) {
      const innerElement = this.elRef.nativeElement.children[0];

      if (innerElement) {
        this.renderer.addClass(innerElement, 'aui-flyout__toggle');
      }
    } else {
      this.renderer.addClass(this.elRef.nativeElement, 'aui-flyout__toggle');
    }
  }
}
