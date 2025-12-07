import { Injectable } from '@angular/core';
import { ACCESS_TOKEN, USER } from 'src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  saveToken(token: string, userId: string): void {

    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(USER);
    
    sessionStorage.setItem(ACCESS_TOKEN, token);
    sessionStorage.setItem(USER, userId);
  }

  getToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN);
  }

  getUserId(): string {
    const userIdString = sessionStorage.getItem(USER);
    return userIdString ? userIdString : '0';
  }

  clear(): void {
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(USER);
  }
}