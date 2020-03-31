import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[onlyNumber]'
})
export class OnlyNumberDirective {

  @Input() rowObj;
  @Input() columnName
  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^0-9.]*/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      this.rowObj[this.columnName] = this._el.nativeElement.value;
      event.stopPropagation();
    }
  }

}
