import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Quote } from '../state/quote/quote.actions';



@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private apiQuotesUrl =
    'https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json';
  private localQuotesUrl = 'assets/quotes.json';
  private quoteSource$ = new BehaviorSubject<'api' | 'local'>('api');
  private quotes$?: Observable<Quote[]>;

  constructor(private http: HttpClient) {}

  getQuote(): Observable<Quote[]> {
    if (!this.quotes$) {
      this.quotes$ = this.quoteSource$.pipe(
        switchMap((source) =>
          this.http.get<Quote[]>(
            source === 'local' ? this.localQuotesUrl : this.apiQuotesUrl
          )
        ),
        shareReplay(1)
      );
    }

    return this.quotes$;
  }

  toggleUseLocalQuotes(): void {
    if (!isDevMode()) {
      return;
    }

    const nextSource = this.quoteSource$.value === 'local' ? 'api' : 'local';
    this.quoteSource$.next(nextSource);
  }

  isUsingLocalQuotes(): boolean {
    return this.quoteSource$.value === 'local';
  }
}
