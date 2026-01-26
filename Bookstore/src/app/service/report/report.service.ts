import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {

  private apiUrl = `${environment.apiUrl}/report`;

  constructor(private http: HttpClient) {}

  removeComment(commentId: string){
    return this.http.put(`${this.apiUrl}/removeComment/${commentId}`, {});
  }
  getCommentById(commentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${commentId}`);
  }
  removeReview(reviewId: string){
    return this.http.delete(`${this.apiUrl}/removeReview/${reviewId}`)
  }
  removeReport(reportId: string){
    return this.http.delete(`${this.apiUrl}/removeReport/${reportId}`)
  }
}
