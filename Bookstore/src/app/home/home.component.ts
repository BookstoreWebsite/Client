import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../service/book/book.service';
import { TokenStorageService } from '../service/auth/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  searchTerm = '';

  recommendedBooks: Book[] = [];
  loadingRecommended = false;

  constructor(
    private bookService: BookService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    this.getBooks();

    const userId = this.tokenStorage.getUserId();
    if (userId) {
      this.getRecommendedBooks(userId);
    }
  }

  getRecommendedBooks(userId: string): void {
    this.loadingRecommended = true;

    this.bookService.getRecommendedBooks(userId).subscribe({
      next: (data: Book[]) => {
        this.recommendedBooks = data ?? [];
        this.loadingRecommended = false;
      },
      error: (err) => {
        console.error('Failed to fetch recommended books', err);
        this.recommendedBooks = [];
        this.loadingRecommended = false;
      }
    });
  }

  get filteredBooks(): Book[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.books;

    return this.books.filter(b => {
      const title = (b.name ?? '').toLowerCase();
      const author = (b.author ?? '').toLowerCase();
      return title.includes(q) || author.includes(q);
    });
  }

  get mostRecentBooks(): Book[] {
    return [...this.books]
      .sort((a: any, b: any) => {
        const ta = new Date(a.addTime ?? 0).getTime();
        const tb = new Date(b.addTime ?? 0).getTime();
        return tb - ta;
      })
      .slice(0, 5);
  }

  get topRatedBooks(): Book[] {
    return [...this.books]
      .sort((a, b) => (Number(b.rating ?? 0) - Number(a.rating ?? 0)))
      .slice(0, 5);
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  getBooks() {
    this.bookService.getAll().subscribe({
      next: (data: Book[]) => {
        this.books = data ?? [];
      },
      error: (error) => {
        console.error('Failed to fetch books', error);
      }
    });
  }
}
