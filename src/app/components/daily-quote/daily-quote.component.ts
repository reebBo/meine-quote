import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { Quote, loadQuotes } from '../../state/quote/quote.actions';
import {
  selectAllQuotes,
  selectAllQuotesLoading,
} from '../../state/quote/quote.selectors';
import { ShareButtonComponent } from '../share-button/share-button.component';

@Component({
  selector: 'app-daily-quote',
  standalone: true,
  imports: [CommonModule, ShareButtonComponent],
  templateUrl: './daily-quote.component.html',
  styleUrl: './daily-quote.component.scss',
})
export class DailyQuoteComponent {
  loading$: Observable<boolean>;
  quoteOfTheDay$!: Observable<Quote>;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectAllQuotesLoading);
    this.quoteOfTheDay$ = this.store.select(selectAllQuotes).pipe(
      map((quotes) => this.getQuoteOfTheDay(quotes)),
      filter((quote): quote is Quote => quote !== undefined)
    );
  }

private getQuoteOfTheDay(quotes: Quote[]): Quote | undefined {
  if (!quotes || quotes.length === 0) return undefined;

  const today = new Date();

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
