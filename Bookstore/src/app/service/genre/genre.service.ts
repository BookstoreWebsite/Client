import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Genre } from 'src/app/models/genre';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient) { }
    private apiUrl = `${environment.apiUrl}/genre`;

    private genresChangedSubject = new Subject<void>();
    genresChanged$ = this.genresChangedSubject.asObservable();

    notifyGenresChanged(): void {
      this.genresChangedSubject.next();
    }
    getAll(): Observable<Genre[]>{
      return this.http.get<Genre[]>(this.apiUrl);
    }
    create(data: any){
      return this.http.post<void>(`${this.apiUrl}/create`, data);
    }
    getById(id: string): Observable<Genre>{
      return this.http.get<Genre>(`${this.apiUrl}/${id}`);
    }
    addGenresToFavorites(userId: string, genreIds: string[]){
      return this.http.post<void>(`${this.apiUrl}/addGenresToFavorites/${userId}`, genreIds);
    }
}
