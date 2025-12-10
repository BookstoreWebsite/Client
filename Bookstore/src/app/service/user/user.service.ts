import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;
  
  constructor(private http: HttpClient) {}

  searchUsers(query: string): Observable<User[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
  }

  follow(followerId: string, followingid: string) {
    return this.http.post<void>(`${this.apiUrl}/${followerId}/${followingid}/follow`, {});
  }
}
