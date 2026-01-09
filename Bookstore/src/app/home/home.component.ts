import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../service/book/book.service';
import { AuthService } from '../service/auth/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  books: Book[] | undefined;
  constructor(private bookService: BookService){}

  ngOnInit(){
    this.getBooks();
  }


  getBooks(){
   this.bookService.getAll().subscribe(
      (data: Book[]) => {
        this.books = data;
      },
      (error) => {
        console.error('Failed to fetch books', error)
      }
   );
  }
}
