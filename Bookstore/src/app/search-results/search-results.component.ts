import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from '../models/book';
import { BookService } from '../service/book/book.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  searchTerm = '';

  allBooks: Book[] = [];
  results: Book[] = [];

  loading = false;
  private subs = new Subscription();

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.route.queryParamMap.subscribe((params) => {
        const q = (params.get('q') ?? '').trim();

        if (!q) {
          this.router.navigate(['/home']);
          return;
        }

        this.searchTerm = q;

        if (this.allBooks.length === 0) this.fetchBooksAndFilter(q);
        else this.applyFilter(q);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSearchChange(value: string): void {
    const q = (value ?? '').trim();

    if (!q) {
      this.clearSearch();
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q },
      replaceUrl: true
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.results = [];
    this.router.navigate(['/home']);
  }

  private fetchBooksAndFilter(q: string): void {
    this.loading = true;

    this.bookService.getAll().subscribe({
      next: (data: Book[]) => {
        this.allBooks = data ?? [];
        this.applyFilter(q);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch books for search', error);
        this.allBooks = [];
        this.results = [];
        this.loading = false;
      }
    });
  }

  private applyFilter(q: string): void {
    const query = q.toLowerCase();

    this.results = (this.allBooks ?? []).filter((b) => {
      const title = (b.name ?? '').toLowerCase();
      const author = (b.author ?? '').toLowerCase();
      return title.includes(query) || author.includes(query);
    });
  }

  submitSearch(): void {
  const q = (this.searchTerm ?? '').trim();
  if (!q) return;

  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { q },
    replaceUrl: true
  });
}

}
