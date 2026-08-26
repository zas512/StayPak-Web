import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" [class]="computedClasses()">
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  variant = input<Variant>('default');

  computedClasses = () => {
    const variants: Record<Variant, string> = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    };
    return variants[this.variant()];
  };
}