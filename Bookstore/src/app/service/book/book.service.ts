import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { AppComment } from 'src/app/models/comment';
import { AppReport } from 'src/app/models/report';
import { Review } from 'src/app/models/review';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }
  private apiUrl = `${environment.apiUrl}/book`;

  getAll(): Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl);
  }
  create(data: any, genreIds: string[]){
    return this.http.post(`${this.apiUrl}/create`, {bookDto: data, genreIds: genreIds});
  }
  getAllGenreBooks(genreId: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/genreBooks/${genreId}`);
  }
  getById(bookId: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${bookId}`);
  }
  getAllBookReviews(bookId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/getAllBookReviews/${bookId}`);
  }
  createReview(data: any, bookId: string, userId: string){
    return this.http.post<void>(`${this.apiUrl}/createReview/${bookId}/${userId}`, data);
  }
  getAllReviewComments(reviewId: string): Observable<AppComment[]>{
    return this.http.get<AppComment[]>(`${this.apiUrl}/getAllReviewComments/${reviewId}`);
  }
  createComment(data: any, userId: string, reviewId: string, bookId: string, parentCommentId: string | null = null) {
    const url = parentCommentId
      ? `${this.apiUrl}/createComment/${userId}/${reviewId}/${bookId}/${parentCommentId}`
      : `${this.apiUrl}/createComment/${userId}/${reviewId}/${bookId}`;
    return this.http.post<void>(url, data);
  }
  getCommentReplies(parentCommentId: string): Observable<AppComment[]>{
    return this.http.get<AppComment[]>(`${this.apiUrl}/getAllCommentReplies/${parentCommentId}`);
  }
  createReport(data: any, userId: string, parentId: string){
    return this.http.post<void>(`${this.apiUrl}/createReport/${userId}/${parentId}`, data)
  }
  getAllReports(): Observable<AppReport[]>{
    return this.http.get<AppReport[]>(`${this.apiUrl}/getAllReports`);
  }
  getAllWished(userId: string): Observable<Book[]>{
    return this.http.get<Book[]>(`${this.apiUrl}/getAllWished/${userId}`);
  }
  getAllRead(userId: string): Observable<Book[]>{
    return this.http.get<Book[]>(`${this.apiUrl}/getAllRead/${userId}`);
  }
  addBookToWished(userId: string, bookId: string){
    return this.http.post<void>(`${this.apiUrl}/addBookToWished/${userId}/${bookId}`, {});
  }
  addBookToRead(userId: string, bookId: string){
    return this.http.post<void>(`${this.apiUrl}/addBookToRead/${userId}/${bookId}`, {});
  }
  removeBookFromWished(userId: string, bookId: string){
    return this.http.delete<void>(`${this.apiUrl}/removeBookFromWished/${userId}/${bookId}`, {});
  }
  removeBookFromRead(userId: string, bookId: string){
    return this.http.delete<void>(`${this.apiUrl}/removeBookFromRead/${userId}/${bookId}`, {});
  }
  isBookInRead(userId: string, bookId: string) {
    return this.http.get<boolean>(`${this.apiUrl}/isBookInRead/${userId}/${bookId}`);
  }
  isBookInWished(userId: string, bookId: string) {
    return this.http.get<boolean>(`${this.apiUrl}/isBookInWished/${userId}/${bookId}`);
  }
  update(id: string, book: Book, genreIds: string[]) {
    return this.http.put(`${this.apiUrl}/${id}`, { bookDto: book, genreIds: genreIds });
  }
  getRecommendedBooks(userId: string): Observable<Book[]>{
    return this.http.get<Book[]>(`${this.apiUrl}/getRecommendedBooks/${userId}`);
  }
}
