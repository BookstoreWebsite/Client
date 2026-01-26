import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../service/report/report.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-reported-comment',
  templateUrl: './reported-comment.component.html',
  styleUrls: ['./reported-comment.component.css']
})
export class ReportedCommentComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  comment: any | null = null;

  private commentId!: string;
  private reportId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const reportId = this.route.snapshot.paramMap.get('reportId');

    if (!id) {
      this.isLoading = false;
      this.errorMessage = 'Invalid comment id.';
      return;
    }

    this.commentId = id;
    this.reportId = reportId ?? '';

    this.reportService.getCommentById(this.commentId).subscribe({
      next: (c) => {
        this.comment = c;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load comment.';
      }
    });
  }

  onRemove(commentId: string): void {
    this.reportService.removeComment(commentId).pipe(
      switchMap(() => {
        if (!this.reportId) return of(null);
        return this.reportService.removeReport(this.reportId);
      })
    ).subscribe({
      next: () => this.router.navigate(['/reports']),
      error: () => (this.errorMessage = 'Failed to remove comment/report.')
    });
  }
}
