import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadQuotes, loadQuotesFailure, loadQuotesSuccess } from './quote.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { QuoteService } from '../../services/quote.service';
import { of } from 'rxjs';

@Injectable()
export class QuotesEffects {
  private actions$ = inject(Actions);
  private quoteService = inject(QuoteService);

  readonly loadQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotes),
      mergeMap(() =>
        this.quoteService.getQuote().pipe(
          // tap(quotes => console.log('Quotes loaded:', quotes)),
          map((quotes) => loadQuotesSuccess({ quotes })),
          catchError((error: unknown) =>
            of(
              loadQuotesFailure({
                error:
                  error instanceof Error
                    ? error.message
                    : 'Failed to load quotes',
              })
            )
          )
        )
      )
    )
  );
}
