import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
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

  create(data: any){
    return this.http.post(`${this.apiUrl}/create`, data);
  }
}
