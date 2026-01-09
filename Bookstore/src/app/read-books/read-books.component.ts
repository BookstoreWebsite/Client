import { Component } from '@angular/core';
import { Book } from '../models/book';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../service/book/book.service';

@Component({
  selector: 'app-read-books',
  templateUrl: './read-books.component.html',
  styleUrls: ['./read-books.component.css']
})
export class ReadBooksComponent {
userId: string | null = null;

  books: Book[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (!this.userId) {
      this.errorMessage = 'Missing user id.';
      return;
    }

    this.loadReadBooks(this.userId);
  }

  private loadReadBooks(userId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getAllRead(userId).subscribe({
      next: (books) => {
        this.books = books ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load read books', err);
        this.errorMessage = 'Failed to load read books.';
        this.isLoading = false;
      }
    });
  }
}
