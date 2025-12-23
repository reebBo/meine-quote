import {
  selectAllQuotes,
  selectAllQuotesError,
  selectAllQuotesLoading,
  selectQuoteFeature,
} from './quote.selectors';
import { QuoteState } from './quote.reducer';

describe('quote selectors', () => {
  const state: QuoteState = {
    quotes: [{ quoteText: 'Test quote', quoteAuthor: null }],
    loading: true,
    error: 'Oops',
  };

  it('selects the quote feature state', () => {
    expect(selectQuoteFeature({ quote: state })).toEqual(state);
  });

  it('selects all quotes', () => {
    expect(selectAllQuotes.projector(state)).toEqual(state.quotes);
  });

  it('selects loading flag', () => {
    expect(selectAllQuotesLoading.projector(state)).toBeTrue();
  });

  it('selects error', () => {
    expect(selectAllQuotesError.projector(state)).toBe('Oops');
  });
});
