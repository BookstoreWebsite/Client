import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { TokenStorageService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {
    const userId = this.tokenStorage.getUserId();
    this.currentUserSubject = new BehaviorSubject<any>(userId)
    this.currentUser = this.currentUserSubject.asObservable();
    if(userId) {
      this.getById(userId).subscribe(
        (user: User) => {
          this.currentUserSubject.next(user);        },
        (error) => {
          console.error('Error fetching user', error);
        }
      );
    }
   }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string) : Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {email, password});
  }

  logout() {
    this.tokenStorage.clear();
    this.currentUserSubject.next(null);
  }

  getById(id: string) : Observable<User> {
    return this.http.get<User>( `${environment.apiUrl}/user/${id}`);
  }

  isAuthenticated(): boolean {
    const token = this.tokenStorage.getToken();
    if (!token) return false;

    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return false;

      const payloadJson = atob(payloadPart);
      const payload = JSON.parse(payloadJson);

      const exp = payload.exp;
      if (!exp) return false;

      const now = Math.floor(Date.now() / 1000);
      return exp > now;
    } catch (e) {
      return false;
    }
  }

  handleLoginResponse(response: any): void {
    console.log(response);
    this.tokenStorage.saveToken(response.accessToken, response.userId);
    this.getById(response.userId).subscribe(
      (user: User) => {
        console.log(user)
        this.currentUserSubject.next(user);
      },
      (error) => {
        console.error('Error fetching user after login', error);
      }
    );
  }

}
