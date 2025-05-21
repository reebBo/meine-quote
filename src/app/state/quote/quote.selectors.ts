import { createSelector, createFeatureSelector } from '@ngrx/store';
import { QuoteState } from './quote.reducer';

export const selectQuoteFeature = createFeatureSelector<QuoteState>('quote');

export const selectAllQuotes = createSelector(
  selectQuoteFeature,
  (state) => state.quotes
);
export const selectAllQuotesLoading = createSelector(
  selectQuoteFeature,
  (state) => state.loading
);
export const selectAllQuotesError = createSelector(
  selectQuoteFeature,
  (state) => state.error
);