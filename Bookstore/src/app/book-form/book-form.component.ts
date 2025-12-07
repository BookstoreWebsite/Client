import { Component } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../service/book/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {
  book: Book = {
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    author: '',
    rating: null
  };

  constructor(private bookService: BookService, private router: Router){}

  onSubmit() {
    this.bookService.create(this.book).subscribe({
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
