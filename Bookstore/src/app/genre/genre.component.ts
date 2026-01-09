import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from '../models/book';
import { BookService } from '../service/book/book.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit, OnDestroy {
  books: Book[] | undefined;
  private routeSub?: Subscription;

  constructor(private bookService: BookService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const genreId = params.get('id');

      if (genreId) {
        this.getAllGenreBooks(genreId);
      } else {
        this.books = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  getAllGenreBooks(genreId: string) {
    this.bookService.getAllGenreBooks(genreId).subscribe(
      (data: Book[]) => {
        this.books = data;
      },
      (error: any) => {
        console.error('Failed to fetch books', error);
      }
    );
  }
}
