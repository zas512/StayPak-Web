import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonDirective, CardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">How can we help?</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">Search our help center or browse popular topics below</p>

          <!-- Search -->
          <div class="mt-8 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for help..."
              class="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Popular Topics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          @for (topic of topics; track topic.title) {
            <app-card class="hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="topic.icon"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ topic.title }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ topic.description }}</p>
                </div>
              </div>
            </app-card>
          }
        </div>

        <!-- FAQ -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently asked questions</h2>
          <div class="space-y-4">
            @for (faq of faqs; track faq.question) {
              <app-card>
                <button
                  type="button"
                  class="w-full flex items-center justify-between text-left"
                  (click)="toggleFaq(faq.question)"
                >
                  <span class="font-medium text-gray-900 dark:text-white">{{ faq.question }}</span>
                  <svg
                    class="w-5 h-5 text-gray-400 transition-transform"
                    [class.rotate-180]="expandedFaqs().has(faq.question)"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                @if (expandedFaqs().has(faq.question)) {
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ faq.answer }}</p>
                }
              </app-card>
            }
          </div>
        </div>

        <!-- Contact -->
        <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-8 text-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Still need help?</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Our support team is available 24/7 to assist you.</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a routerLink="/messages" appButton variant="primary">Contact Support</a>
            <button appButton variant="outline" (click)="callSupport()">Call: +92 300 1234567</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HelpComponent {
  expandedFaqs = signal<Set<string>>(new Set());

  topics = [
    {
      title: 'Bookings & Reservations',
      description: 'Learn how to book, modify, or cancel your stay',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      title: 'Payments & Refunds',
      description: 'Understand pricing, payment methods, and refund policy',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      title: 'Your Account',
      description: 'Manage your profile, security, and verification',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      title: 'Hosting on StayPak',
      description: 'List your property and start earning',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
  ];

  faqs = [
    {
      question: 'How do I book a stay on StayPak?',
      answer: 'Search for a destination, select your dates and number of guests, then choose a listing. You can either book instantly (if available) or send a request to the host. Once confirmed, you\'ll receive a confirmation email and can manage your booking from the Trips page.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept JazzCash, EasyPaisa, SafePay, and major credit/debit cards. All payments are processed securely through our payment partners.',
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel from the Trips page. Refund amounts depend on the listing\'s cancellation policy (Flexible, Moderate, or Strict) and how far in advance you cancel.',
    },
    {
      question: 'How does CNIC verification work?',
      answer: 'For security, hosts and guests may need to verify their identity using their CNIC number. We validate the format and may cross-check with our verification partner. Your information is encrypted and never shared publicly.',
    },
    {
      question: 'Is my payment secure?',
      answer: 'Absolutely. We use industry-standard encryption and work only with regulated Pakistani payment gateways. StayPak never stores your full card or mobile wallet credentials.',
    },
    {
      question: 'How do I become a host?',
      answer: 'Go to the Host dashboard from your profile, complete your host verification (including CNIC), and create your first listing. Our team reviews new listings to ensure quality and safety.',
    },
  ];

  toggleFaq(question: string) {
    const current = new Set(this.expandedFaqs());
    if (current.has(question)) {
      current.delete(question);
    } else {
      current.add(question);
    }
    this.expandedFaqs.set(current);
  }

  callSupport() {
    window.location.href = 'tel:+923001234567';
  }
}