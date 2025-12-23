import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DailyQuoteComponent } from './daily-quote.component';
import {
  selectAllQuotes,
  selectAllQuotesError,
  selectAllQuotesLoading,
} from '../../state/quote/quote.selectors';
import { Quote } from '../../state/quote/quote.actions';
import { QuoteService } from '../../services/quote.service';

describe('DailyQuoteComponent', () => {
  let component: DailyQuoteComponent;
  let fixture: ComponentFixture<DailyQuoteComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyQuoteComponent],
      providers: [
        provideMockStore(),
        provideAnimations(),
        {
          provide: QuoteService,
          useValue: {
            isUsingLocalQuotes: () => false,
            toggleUseLocalQuotes: () => {},
          },
        },
      ],
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    fixture = TestBed.createComponent(DailyQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('shows loading state', async () => {
    store.overrideSelector(selectAllQuotesLoading, true);
    store.overrideSelector(selectAllQuotesError, null);
    store.overrideSelector(selectAllQuotes, []);

    fixture = TestBed.createComponent(DailyQuoteComponent);
    component = fixture.componentInstance;
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading quotes...');
  });

  it('shows error message and retry button when load fails', () => {
    store.overrideSelector(selectAllQuotesLoading, false);
    store.overrideSelector(selectAllQuotesError, 'Nope');
    store.overrideSelector(selectAllQuotes, []);

    fixture = TestBed.createComponent(DailyQuoteComponent);
    component = fixture.componentInstance;
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('load today');
    expect(compiled.querySelector('button.retry-button')).toBeTruthy();
  });

  it('renders quote text and fallback author', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2025-01-02T12:00:00Z'));

    const quotes: Quote[] = [{ quoteText: 'Test quote', quoteAuthor: null }];
    store.overrideSelector(selectAllQuotesLoading, false);
    store.overrideSelector(selectAllQuotesError, null);
    store.overrideSelector(selectAllQuotes, quotes);

    fixture = TestBed.createComponent(DailyQuoteComponent);
    component = fixture.componentInstance;
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test quote');
    expect(compiled.textContent).toContain('Unknown');

    jasmine.clock().uninstall();
  });

  it('allows navigating to previous quote', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2025-01-05T12:00:00Z'));

    const quotes: Quote[] = [
      { quoteText: 'Q1', quoteAuthor: 'A1' },
      { quoteText: 'Q2', quoteAuthor: 'A2' },
      { quoteText: 'Q3', quoteAuthor: 'A3' },
    ];

    store.overrideSelector(selectAllQuotesLoading, false);
    store.overrideSelector(selectAllQuotesError, null);
    store.overrideSelector(selectAllQuotes, quotes);

    fixture = TestBed.createComponent(DailyQuoteComponent);
    component = fixture.componentInstance;
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Today');

    const prevButton = compiled.querySelector(
      'button[aria-label="Show previous quote"]'
    ) as HTMLButtonElement;
    prevButton.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Yesterday');

    jasmine.clock().uninstall();
  });
});
