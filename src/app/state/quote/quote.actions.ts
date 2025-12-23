import { createAction, props } from '@ngrx/store';

export interface Quote {
  // id: number;
  // name: string;
  // username: string;
  // email: string;
  quoteText: string;
  quoteAuthor?: string | null;
}

export const loadQuotes = createAction('[Quote API] Load Quotes');
export const loadQuotesSuccess = createAction(
  '[Quote API] Load Quotes Success',
  props<{ quotes: Quote[] }>()
);
export const loadQuotesFailure = createAction(
  '[Quote API] Load Quotes Failure',
  props<{ error: string }>()
);
