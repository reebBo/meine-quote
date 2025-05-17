import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../state/quote/quote.actions';



@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users'; 
  private apiQuotesUrl = '  https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json'; 

  constructor(private http: HttpClient) {}

  getQuote(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiQuotesUrl);
  }
}
