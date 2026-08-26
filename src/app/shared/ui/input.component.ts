import { Component, input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full">
      @if (label()) {
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label() }}</label>
      }
      <input
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="value"
        [disabled]="disabled()"
        [required]="required()"
        [id]="id()"
        [name]="name()"
        [aria-describedby]="error() ? errorId() : hint() ? hintId() : null"
        class="w-full px-4 py-2.5 rounded-lg border transition-colors duration-200
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
          {{ error() ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500' }}"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      @if (error()) {
        <p id="{{ errorId() }}" class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{{ error() }}</p>
      } @else if (hint()) {
        <p id="{{ hintId() }}" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ hint() }}</p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  disabled = input(false);
  required = input(false);
  id = input<string>('');
  name = input<string>('');
  error = input<string>('');
  hint = input<string>('');

  value = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  // Internal disabled state for ControlValueAccessor
  internalDisabled = signal(false);

  errorId = () => `${this.id()}-error`;
  hintId = () => `${this.id()}-hint`;

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  // Combine external disabled input with internal disabled state
  protected get isDisabled(): boolean {
    return this.disabled() || this.internalDisabled();
  }
}