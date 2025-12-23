import { createReducer, on } from '@ngrx/store';
import {
  loadQuotes,
  loadQuotesFailure,
  loadQuotesSuccess,
  Quote,
} from './quote.actions';

export interface QuoteState {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
}

export const initialState: QuoteState = {
  quotes: [],
  loading: false,
  error: null,
};

export const quoteReducer = createReducer(
  initialState,
  on(loadQuotes, (state) => ({ ...state, loading: true, error: null })),
  on(loadQuotesSuccess, (state, { quote }) => ({
    ...state,
    quotes: quote,
    loading: false,
    error: null,
  })),
  on(loadQuotesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
