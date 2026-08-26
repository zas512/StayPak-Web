import { Directive, input, output, HostBinding, HostListener, computed, ElementRef, Renderer2 } from '@angular/core';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'info';
type Size = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  exportAs: 'appButton',
})
export class ButtonDirective {
  variant = input<Variant>('primary');
  size = input<Size>('md');
  disabled = input(false);
  loading = input(false);
  onClick = output<Event>();

  private classes = computed(() => {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<Variant, string> = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
      ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
      info: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    };

    const sizes: Record<Size, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });

  @HostBinding('class')
  get hostClasses() {
    return this.classes();
  }

  @HostBinding('attr.disabled')
  get hostDisabled() {
    return this.disabled() || this.loading() ? '' : null;
  }

  @HostListener('click', ['$event'])
  onHostClick(event: Event) {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onClick.emit(event);
  }

  // Apply loading state styles
  @HostBinding('style.pointerEvents')
  get pointerEvents() {
    return this.loading() ? 'none' : 'auto';
  }
}