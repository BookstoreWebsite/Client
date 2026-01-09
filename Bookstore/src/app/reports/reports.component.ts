import { Component, OnInit } from '@angular/core';
import { BookService } from '../service/book/book.service';
import { AppReport } from '../models/report';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: AppReport[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getAllReports().subscribe({
      next: (reports) => {
        this.reports = reports ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load reports', err);
        this.errorMessage = 'Failed to load reports.';
        this.isLoading = false;
      }
    });
  }

  reasonLabel(reason: number): string {
    switch (reason) {
      case 0: return 'Profanity';
      case 1: return 'Misinformation';
      case 2: return 'Irrelevant';
      case 3: return 'Violence or hate';
      case 4: return 'Spam';
      default: return `Unknown (${reason})`;
    }
  }

  targetLabel(r: AppReport): string {
    if (r.reviewId) return 'Review';
    if (r.commentId) return 'Comment';
    return 'Unknown';
  }

  targetId(r: AppReport): string {
    return r.reviewId ?? r.commentId ?? '—';
  }
}
