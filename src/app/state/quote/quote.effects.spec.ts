import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, Subject, throwError } from 'rxjs';
import { QuoteService } from '../../services/quote.service';
import {
  loadQuotes,
  loadQuotesFailure,
  loadQuotesSuccess,
  Quote,
} from './quote.actions';
import { QuotesEffects } from './quote.effects';

describe('QuotesEffects', () => {
  let actions$: Subject<Action>;
  let effects: QuotesEffects;
  let quoteService: jasmine.SpyObj<QuoteService>;

  beforeEach(() => {
    actions$ = new Subject<Action>();
    quoteService = jasmine.createSpyObj('QuoteService', ['getQuote']);

    TestBed.configureTestingModule({
      providers: [
        QuotesEffects,
        provideMockActions(() => actions$ as Observable<Action>),
        { provide: QuoteService, useValue: quoteService },
      ],
    });

    effects = TestBed.inject(QuotesEffects);
  });

  it('dispatches loadQuotesSuccess on success', (done) => {
    const quotes: Quote[] = [{ quoteText: 'Test', quoteAuthor: 'Author' }];
    quoteService.getQuote.and.returnValue(of(quotes));

    effects.loadQuote$.subscribe((action) => {
      expect(action).toEqual(loadQuotesSuccess({ quotes }));
      done();
    });

    actions$.next(loadQuotes());
  });

  it('dispatches loadQuotesFailure on error', (done) => {
    quoteService.getQuote.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    effects.loadQuote$.subscribe((action) => {
      expect(action).toEqual(loadQuotesFailure({ error: 'Network error' }));
      done();
    });

    actions$.next(loadQuotes());
  });
});
