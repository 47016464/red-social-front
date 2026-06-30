import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

// Directiva 1: Resaltar al hacer hover
@Directive({
  selector: '[appResaltar]',
  standalone: true,
})
export class ResaltarDirective {
  @Input('appResaltar') colorResaltado: string = 'rgba(124,110,247,0.1)';
  @Input() color: string = 'rgba(124,110,247,0.1)';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.colorResaltado);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.2s');
  }

  @HostListener('mouseleave') onLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
  }
}

// Directiva 2: Auto-focus al aparecer
@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    setTimeout(() => this.el.nativeElement.focus(), 100);
  }
}

// Directiva 3: Solo números en inputs
@Directive({
  selector: '[appSoloNumeros]',
  standalone: true,
})
export class SoloNumerosDirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
}