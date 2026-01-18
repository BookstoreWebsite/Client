import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from '../models/book';
import { BookService } from '../service/book/book.service';
import { GenreService } from '../service/genre/genre.service';
import { Genre } from '../models/genre';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  genreName = '';

  private routeSub?: Subscription;

  constructor(
    private bookService: BookService,
    private genreService: GenreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const genreId = params.get('id');

      if (genreId) {
        this.getGenreName(genreId);
        this.getAllGenreBooks(genreId);
      } else {
        this.books = [];
        this.genreName = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private getGenreName(genreId: string) {
    this.genreService.getById(genreId).subscribe({
      next: (g: Genre) => (this.genreName = g?.name ?? ''),
      error: (err) => {
        console.error('Failed to load genre name', err);
        this.genreName = '';
      }
    });
  }

  getAllGenreBooks(genreId: string) {
    this.bookService.getAllGenreBooks(genreId).subscribe({
      next: (data: Book[]) => {
        this.books = data ?? [];
      },
      error: (error: any) => {
        console.error('Failed to fetch books', error);
        this.books = [];
      }
    });
  }
}
