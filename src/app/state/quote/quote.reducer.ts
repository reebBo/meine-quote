import { createReducer, on } from '@ngrx/store';
import { loadQuotes, loadQuotesSuccess, Quote } from './quote.actions';

export interface QuoteState {
  quotes: Quote[];
  loading: boolean;
  error: Error | null;
}

export const initialState: QuoteState = {
  quotes: [],
  loading: false,
  error: null,
};

export const quoteReducer = createReducer(
  initialState,
  on(loadQuotes, (state) => ({ ...state, loading: true })),
  on(loadQuotesSuccess, (state, { quote }) => ({
    ...state,
    quotes: quote,
    loading: false,
    error: null,
  }))
);
