import { Component, input, forwardRef, signal, computed } from '@angular/core';
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
        <label [for]="id()" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex justify-between items-center">
          <span>{{ label() }}</span>
          @if (optional()) {
            <span class="text-xs text-gray-400 dark:text-gray-500 font-normal">Optional</span>
          }
        </label>
      }
      <div class="relative rounded-lg shadow-sm">
        <input
          [type]="isPassword() ? (showPassword() ? 'text' : 'password') : type()"
          [placeholder]="placeholder()"
          [value]="value"
          [disabled]="isDisabled"
          [required]="required()"
          [id]="id()"
          [name]="name()"
          [autocomplete]="autocomplete()"
          [aria-describedby]="error() ? errorId() : hint() ? hintId() : null"
          class="w-full px-3.5 py-2.5 rounded-lg border transition-all duration-200 text-sm
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
            disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
            {{ error() ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500' }}
            {{ isPassword() ? 'pr-10' : '' }}"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />
        @if (isPassword()) {
          <button
            type="button"
            (click)="togglePassword()"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
            tabindex="-1"
            [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
          >
            @if (showPassword()) {
              <!-- Eye Off -->
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            } @else {
              <!-- Eye -->
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            }
          </button>
        }
      </div>
      @if (error()) {
        <p id="{{ errorId() }}" class="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium" role="alert">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ error() }}
        </p>
      } @else if (hint()) {
        <p id="{{ hintId() }}" class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{ hint() }}</p>
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
  optional = input(false);
  id = input<string>('');
  name = input<string>('');
  autocomplete = input<string>('');
  error = input<string>('');
  hint = input<string>('');

  value = '';
  showPassword = signal(false);
  isPassword = computed(() => this.type() === 'password');

  onChange = (value: string) => {};
  onTouched = () => {};

  internalDisabled = signal(false);

  errorId = () => `${this.id()}-error`;
  hintId = () => `${this.id()}-hint`;

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

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

  protected get isDisabled(): boolean {
    return this.disabled() || this.internalDisabled();
  }
}