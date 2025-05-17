import { createReducer, on } from '@ngrx/store';
import { loadQuotes, loadQuotesSuccess, Quote } from './quote.actions';

export interface QuoteState {
  quotes: Quote[];
  loading: boolean;
}

export const initialState: QuoteState = {
  quotes: [],
  loading: false
};

export const quoteReducer = createReducer(
  initialState,
  on(loadQuotes, (state) => ({ ...state, loading: true })),
  on(loadQuotesSuccess, (state, { quote }) => ({ ...state, quotes: quote, loading: false })))
