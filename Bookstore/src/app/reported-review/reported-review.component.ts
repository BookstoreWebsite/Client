import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../service/report/report.service';
import { BookService } from '../service/book/book.service';
import { Review } from '../models/review';
import { TokenStorageService } from '../service/auth/token.service';
import { AppComment } from '../models/comment';

@Component({
  selector: 'app-reported-review',
  templateUrl: './reported-review.component.html',
  styleUrls: ['./reported-review.component.css']
})
export class ReportedReviewComponent implements OnInit {
  isLoading = true;
  errorMessage = '';

  review: Review | null = null;

  replyOpen = false;
  replyText = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private reportService: ReportService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.isLoading = false;
      this.errorMessage = 'Invalid review id.';
      return;
    }

    const reviewId = idParam;

    console.log('ROUTE REVIEW ID:', idParam);

    this.bookService.getReviewById(reviewId).subscribe({
      next: (r) => {
        this.review = r;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load review.';
      }
    });
  }

  toggleReply(): void {
    this.replyOpen = !this.replyOpen;
  }

  cancelReply(): void {
    this.replyText = '';
    this.replyOpen = false;
  }

  submitReply(): void {
  const text = this.replyText.trim();
  if (!text || !this.review?.id) return;

  const userId = this.tokenStorage.getUserId();
  if (!userId) return;

  const bookId =
    (this.review as any).bookId ??
    (this.review as any).book?.id;

  if (!bookId) return;

  const data: AppComment = { text };

  this.bookService.createComment(data, userId, this.review.id, bookId).subscribe({
    next: () => {
      this.replyText = '';
      this.replyOpen = false;
    },
    error: (err: any) => {
      console.log('Error while creating comment ', err);
    }
  });
}

  removeReview(): void {
    if (!this.review?.id) return;

    this.reportService.removeReview(this.review.id).subscribe({
      next: () => this.router.navigate(['/reports']),
      error: () => (this.errorMessage = 'Failed to remove review.')
    });
  }
}
