import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, isDevMode } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Quote, loadQuotes } from '../../state/quote/quote.actions';
import {
  selectAllQuotes,
  selectAllQuotesError,
  selectAllQuotesLoading,
} from '../../state/quote/quote.selectors';
import { ShareButtonComponent } from '../share-button/share-button.component';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-daily-quote',
  standalone: true,
  imports: [CommonModule, ShareButtonComponent],
  templateUrl: './daily-quote.component.html',
  styleUrl: './daily-quote.component.scss',
})
export class DailyQuoteComponent {
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  currentQuote$: Observable<Quote | undefined>;
  readonly isDevMode = isDevMode();
  private isBrowser: boolean;
  useLocalQuotes = false;
  quoteOffsetDays = 0;
  private quoteOffsetDays$ = new BehaviorSubject<number>(0);
  constructor(
    private store: Store,
    private quoteService: QuoteService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loading$ = this.store.select(selectAllQuotesLoading);
    this.error$ = this.store.select(selectAllQuotesError);
    this.currentQuote$ = combineLatest([
      this.store.select(selectAllQuotes),
      this.quoteOffsetDays$,
    ]).pipe(
      map(([quotes, offsetDays]) =>
        this.getQuoteForDayOffset(quotes, offsetDays)
      )
    );
    this.useLocalQuotes = this.quoteService.isUsingLocalQuotes();
    if (this.isBrowser) {
      const params = new URLSearchParams(window.location.search);
      const offsetParam = params.get('offset');
      const parsedOffset = Number.parseInt(offsetParam ?? '', 10);
      if (!Number.isNaN(parsedOffset) && parsedOffset >= 0 && parsedOffset <= 5) {
        this.quoteOffsetDays = parsedOffset;
        this.quoteOffsetDays$.next(parsedOffset);
      }
    }
  }

  retryLoadQuotes(): void {
    this.store.dispatch(loadQuotes());
  }

  toggleQuoteSource(): void {
    this.quoteService.toggleUseLocalQuotes();
    this.useLocalQuotes = this.quoteService.isUsingLocalQuotes();
    this.store.dispatch(loadQuotes());
  }

  goToPreviousQuote(): void {
    if (this.quoteOffsetDays >= 5) {
      return;
    }

    this.quoteOffsetDays += 1;
    this.quoteOffsetDays$.next(this.quoteOffsetDays);
  }

  goToNextQuote(): void {
    if (this.quoteOffsetDays <= 0) {
      return;
    }

    this.quoteOffsetDays -= 1;
    this.quoteOffsetDays$.next(this.quoteOffsetDays);
  }

  getOffsetLabel(): string {
    if (this.quoteOffsetDays === 0) {
      return 'Today';
    }
    if (this.quoteOffsetDays === 1) {
      return 'Yesterday';
    }
    return `${this.quoteOffsetDays} days ago`;
  }

  private getQuoteForDayOffset(
    quotes: Quote[],
    offsetDays: number
  ): Quote | undefined {
    if (!Array.isArray(quotes) || quotes.length === 0) return undefined;

    const today = new Date();
    today.setDate(today.getDate() - offsetDays);

    const offsetMinutes = today.getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60;

    const shiftedTime = today.getTime() + offsetHours * 60 * 60 * 1000;

    const dayNumber = Math.floor(shiftedTime / (1000 * 60 * 60 * 24));
    const index = dayNumber % quotes.length;

    return quotes[index];
  }
}
// The original calculation was based on UTC time, so the "day" would change at midnight UTC,
// which may be several hours different from local midnight. This could cause the daily quote
// to switch earlier or later than expected depending on the user's timezone.

// today.getTime() returns the number of milliseconds since January 1, 1970 UTC.

// Dividing by (1000 * 60 * 60 * 24) converts this to the number of days since that date.

// Math.floor rounds down to the nearest whole number, ensuring we get an integer day count.

// The modulo operator (%) wraps the day count around the length of the quotes array,
// so the quotes cycle repeatedly over days.

// ---
// Updated implementation shifts the UTC timestamp by the local timezone offset (in hours)
// dynamically calculated from the user's environment via getTimezoneOffset().
// This ensures that the "day" number is aligned with the user's local midnight,
// including automatic handling of daylight saving time changes.

// This way, the daily quote switches exactly at local midnight, no matter the user's timezone,
// and adjusts automatically for daylight saving time without manual changes.
