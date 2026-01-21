import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Follow } from 'src/app/models/follow';
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
    return this.http.post<void>(`${this.apiUrl}/follow/${followerId}/${followingid}`, {});
  }

  unfollow(followerId: string, followingid: string) {
    return this.http.delete<void>(`${this.apiUrl}/unfollow/${followerId}/${followingid}`);
  }

  getFollowing(userId: string): Observable<Follow[]> {
    return this.http.get<Follow[]>(`${this.apiUrl}/getFollowing/${userId}`);
  }

  getFollowers(userId: string): Observable<Follow[]> {
    return this.http.get<Follow[]>(`${this.apiUrl}/getFollowers/${userId}`);
  }

  editBio(userId: string, text: string) {
    return this.http.patch<any>(`${this.apiUrl}/editBio/${userId}`, { text });
  }

}
