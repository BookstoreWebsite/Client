import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { Book } from '../models/book';
import { Genre } from '../models/genre';
import { BookService } from '../service/book/book.service';
import { GenreService } from '../service/genre/genre.service';

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
    amount: null,
    addTime: null,
    genres: [],
    reviews: []
  };

  genres: Genre[] = [];

  selectedGenreIds: string[] = [];
  genresTouched = false;

  isEditMode = false;
  bookId: string | null = null;

  constructor(
    private bookService: BookService,
    private router: Router,
    private genreService: GenreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.bookId;

    this.getGenres(() => {
      if (this.isEditMode && this.bookId) {
        this.loadBookForEdit(this.bookId);
      } else {
        this.selectedGenreIds = [];
        this.genresTouched = false;
      }
    });
  }

  getGenres(done?: () => void): void {
    this.genreService.getAll().subscribe({
      next: (data: Genre[]) => {
        this.genres = data;
        done?.();
      },
      error: (err) => console.error('Failed to load genres', err)
    });
  }

  loadBookForEdit(id: string): void {
    this.bookService.getById(id).subscribe({
      next: (b: Book) => {
        this.book = { ...this.book, ...b };

        this.selectedGenreIds = (b.genres ?? []).map(g => String(g.id));

        if (this.book.amount !== null && this.book.amount !== undefined) {
          this.book.amount = Math.trunc(Number(this.book.amount)) as any;
        }

        this.genresTouched = false;
      },
      error: (err) => console.error('Failed to load book', err)
    });
  }

  isGenreSelected(id: string): boolean {
    return this.selectedGenreIds.includes(String(id));
  }

  onGenreToggle(id: string, event: Event): void {
    this.genresTouched = true;

    const checked = (event.target as HTMLInputElement).checked;
    const genreId = String(id);

    if (checked) {
      if (!this.selectedGenreIds.includes(genreId)) {
        this.selectedGenreIds.push(genreId);
      }
    } else {
      this.selectedGenreIds = this.selectedGenreIds.filter(x => x !== genreId);
    }
  }

  onSubmit() {
    this.genresTouched = true;

    if (this.selectedGenreIds.length === 0) {
      console.warn('No genres selected');
      return;
    }

    if (this.book.amount !== null && this.book.amount !== undefined) {
      this.book.amount = Math.trunc(Number(this.book.amount)) as any;
    }

    if (this.isEditMode && this.bookId) {
      this.bookService.update(this.bookId, this.book, this.selectedGenreIds).subscribe({
        next: () => this.router.navigate(['/books', this.bookId]),
        error: (err) => console.error('Error while updating book', err)
      });
    } else {
      this.bookService.create(this.book, this.selectedGenreIds).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => console.error('Error while creating book', err)
      });
    }
  }

  integerValidator(model: NgModel) {
    const v = model.value;
    if (v === null || v === undefined || v === '') return null;

    const n = Number(v);
    if (!Number.isFinite(n)) return { integer: true };
    if (!Number.isInteger(n)) return { integer: true };
    return null;
  }

  coerceAmountToInt() {
    const v = this.book.amount as any;
    if (v === null || v === undefined || v === '') return;

    const n = Number(v);
    if (!Number.isFinite(n)) return;

    this.book.amount = Math.trunc(n) as any;
  }
}
