import { Component } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../service/book/book.service';
import { Router } from '@angular/router';
import { GenreService } from '../service/genre/genre.service';
import { Genre } from '../models/genre';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {
  book: Book = {
    id: null as any,
    name: '',
    description: '',
    imageUrl: '',
    author: '',
    rating: null,
    price: null,
    genres: [],
    reviews: []
  };

  genres: Genre[] = [];
  selectedGenreIds: string[] = [];

  constructor(private bookService: BookService, private router: Router, private genreService: GenreService){}

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres(): void {
    this.genreService.getAll().subscribe({
      next: (data: Genre[]) => {
        this.genres = data;
      },
      error: (err) => {
        console.error('Failed to load genres', err);
      }
    });
  }

  onSubmit() {
    if (this.selectedGenreIds.length === 0) {
      console.warn('No genres selected');
      return;
  }
    this.bookService.create(this.book, this.selectedGenreIds).subscribe({
      next: (res: any) => {
        console.log('Book creation success: ', res);
        this.router.navigate(['/home'])
      },
      error: (err: any) => {
        console.error('Error while creating book', err)
      }
    })
  }
}
