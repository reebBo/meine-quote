import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadQuotes, loadQuotesSuccess } from './quote.actions';
import { mergeMap, map, tap } from 'rxjs/operators';
import { QuoteService } from '../../services/quote.service';

@Injectable()
export class QuotesEffects {
 loadQuote$;

  constructor(private actions$: Actions, private QuoteService: QuoteService) {
    this.loadQuote$ = createEffect(() =>
      this.actions$.pipe(
        ofType(loadQuotes),
        mergeMap(() => this.QuoteService.getQuote().pipe(
          // tap(quotes => console.log('Quotes loaded:', quotes)),
          map(quotes => loadQuotesSuccess({ quote:quotes }))
        ))
      )
    );
  }
}