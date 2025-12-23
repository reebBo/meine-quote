import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Quote } from '../state/quote/quote.actions';



@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private apiQuotesUrl =
    'https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json';
  private quotes$?: Observable<Quote[]>;

  constructor(private http: HttpClient) {}

  getQuote(): Observable<Quote[]> {
    if (!this.quotes$) {
      this.quotes$ = this.http
        .get<Quote[]>(this.apiQuotesUrl)
        .pipe(shareReplay(1));
    }

    return this.quotes$;
  }
}
