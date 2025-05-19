import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectAllQuotes, selectAllQuotesLoading } from './state/quote/quote.selectors';
import { Quote, loadQuotes } from './state/quote/quote.actions';
import { DailyQuoteComponent } from './components/daily-quote/daily-quote.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DailyQuoteComponent, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'meine-quote';

  quotes$: Observable<Quote[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.quotes$ = this.store.select(selectAllQuotes);
    this.loading$ = this.store.select(selectAllQuotesLoading); 
  }

  ngOnInit(): void {
    this.store.dispatch(loadQuotes());
  }
}
