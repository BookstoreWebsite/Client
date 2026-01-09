import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../service/book/book.service';
import { Book } from '../models/book';

@Component({
  selector: 'app-wished-books',
  templateUrl: './wished-books.component.html',
  styleUrls: ['./wished-books.component.css']
})
export class WishedBooksComponent implements OnInit {
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

    this.loadWishedBooks(this.userId);
  }

  private loadWishedBooks(userId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getAllWished(userId).subscribe({
      next: (books) => {
        this.books = books ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load wished books', err);
        this.errorMessage = 'Failed to load wished books.';
        this.isLoading = false;
      }
    });
  }
}
