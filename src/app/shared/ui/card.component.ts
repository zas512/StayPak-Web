import { Component, input, contentChildren, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-shadow duration-200 hover:shadow-md"
         [class]="variant()">
      @if (header()) {
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <ng-content select="[slot=header]"></ng-content>
        </div>
      }
      <div class="p-6">
        <ng-content></ng-content>
      </div>
      @if (footer()) {
        <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      }
    </div>
  `,
})
export class CardComponent {
  variant = input<'default' | 'outlined' | 'elevated'>('default');
  header = input(false);
  footer = input(false);
}