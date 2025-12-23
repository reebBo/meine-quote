import { loadQuotes, loadQuotesFailure, loadQuotesSuccess, Quote } from './quote.actions';
import { initialState, quoteReducer } from './quote.reducer';

describe('quoteReducer', () => {
  it('sets loading true and clears error on loadQuotes', () => {
    const state = quoteReducer(initialState, loadQuotes());

    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('stores quotes and clears loading on loadQuotesSuccess', () => {
    const quotes: Quote[] = [{ quoteText: 'Test quote', quoteAuthor: 'Author' }];

    const state = quoteReducer(initialState, loadQuotesSuccess({ quotes }));

    expect(state.quotes).toEqual(quotes);
    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('stores error and clears loading on loadQuotesFailure', () => {
    const state = quoteReducer(initialState, loadQuotesFailure({ error: 'Boom' }));

    expect(state.loading).toBeFalse();
    expect(state.error).toBe('Boom');
  });
});
