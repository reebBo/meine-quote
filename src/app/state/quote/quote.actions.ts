import { createAction, props } from '@ngrx/store';

export interface Quote {
  // id: number;
  // name: string;
  // username: string;
  // email: string;
  quoteText: string;
  quoteAuthor: string;
}

export const loadQuotes = createAction('[Quote API] Load Quotes');
export const loadQuotesSuccess = createAction(
  '[User API] Load Quotes Success',
  props<{ quote: Quote[] }>()
);
