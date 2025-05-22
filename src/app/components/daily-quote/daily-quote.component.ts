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

    this.loading$ = this.store.select(selectAllQuotesLoading);
    this.quoteOfTheDay$ = this.store.select(selectAllQuotes).pipe(
      map((quotes) => this.getQuoteOfTheDay(quotes)),
      filter((quote): quote is Quote => quote !== undefined)
    );
  }

  private getQuoteOfTheDay(quotes: Quote[]): Quote | undefined {
    if (!quotes || quotes.length === 0) return undefined;
    const today = new Date();
    const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const index = dayNumber % quotes.length;
    return quotes[index];
  }
}

//the calculation is based on UTC time, so the "day" may change at midnight UTC, not local time.

//today.getTime() returns the number of milliseconds since January 1, 1970.

//Dividing by (1000 * 60 * 60 * 24) converts this to the number of days since that date.

//The Math.floor function rounds down to the nearest whole number, ensuring that we get an integer index.

//The modulo operator (%) is used to ensure that the index wraps around if it exceeds the length of the quotes array. This way, if there are more days than quotes, it will start again from the beginning of the array.
// This ensures that the same quote is shown for the same day each year, regardless of how many quotes are in the array.

