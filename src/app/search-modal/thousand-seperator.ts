import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appThousandSeparator]'
})
export class ThousandSeparatorDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const value = event.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
    const formattedValue = new Intl.NumberFormat('en-US').format(Number(value));

    if (value === '') {
      this.renderer.setProperty(this.el.nativeElement, 'value', ''); // Clear the input value
      return; // Exit the function early
    }

    // Remove commas from formatted value before updating the input value
    const numericValue = Number(formattedValue.replace(/,/g, ''));

    // Check if the parsed numeric value is not NaN before updating the input value
    if (!isNaN(numericValue)) {
      // Update the input value with the formatted value
      this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
    } else {
      // Clear the input value
      this.renderer.setProperty(this.el.nativeElement, 'value', '');
    }
  }
}
