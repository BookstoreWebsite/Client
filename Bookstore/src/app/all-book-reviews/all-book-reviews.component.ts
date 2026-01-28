import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../service/book/book.service';
import { Review } from '../models/review';
import { AppComment } from '../models/comment';
import { TokenStorageService } from '../service/auth/token.service';
import { AuthService } from '../service/auth/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-all-book-reviews',
  templateUrl: './all-book-reviews.component.html',
  styleUrls: ['./all-book-reviews.component.css']
})
export class AllBookReviewsComponent implements OnInit {
  errorMessage = '';
  isLoading = false;

  bookId = '';

  allReviews: Review[] = [];
  visibleReviews: Review[] = [];

  pageSize = 10;
  pageIndex = 0; 

  isLoggedIn: boolean = false;
  currentUser: User | null = null;

  constructor(private bookService: BookService, 
              private route: ActivatedRoute, 
              private tokenStorage: TokenStorageService, 
              private authService: AuthService, 
              private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Missing book id.';
      return;
    }
    this.bookId = id;
    this.loadReviews(id);
  }

  checkLoginStatus(): void {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    })
  }

  loadReviews(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getAllBookReviews(id).subscribe({
      next: (reviews: Review[]) => {
        this.allReviews = reviews ?? [];
        this.pageIndex = 0;
        this.updateVisible();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load reviews.';
        this.isLoading = false;
      }
    });
  }

  updateVisible(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.visibleReviews = this.allReviews.slice(start, end);
  }

  get canPrev(): boolean {
    return this.pageIndex > 0;
  }

  get canNext(): boolean {
    return (this.pageIndex + 1) * this.pageSize < this.allReviews.length;
  }

  prevPage(): void {
    if (!this.canPrev) return;
    this.pageIndex--;
    this.updateVisible();
    this.resetReplyUI();
  }

  nextPage(): void {
    if (!this.canNext) return;
    this.pageIndex++;
    this.updateVisible();
    this.resetReplyUI();
  }

  trackByReviewId(index: number, r: Review): string {
    return r.id;
  }

  get totalPages(): number {
  return Math.ceil(this.allReviews.length / this.pageSize);
  }

  toggleComments(review: Review): void {
  if (review.commentsLoaded) {
    review.commentsExpanded = !review.commentsExpanded;
    return;
  }

  review.commentsLoading = true;

  this.bookService.getAllReviewComments(review.id).subscribe({
    next: (comments: AppComment[]) => {
      review.comments = comments ?? [];
      review.commentsLoaded = true;
      review.commentsExpanded = true;
      review.commentsLoading = false;
    },
    error: (err) => {
      console.error('Failed to load comments', err);
      review.commentsLoading = false;
    }
  });
}

openReplyFor: string | null = null;
replyDrafts: Record<string, string> = {};

toggleReply(reviewId: string): void {
  this.openReplyFor = this.openReplyFor === reviewId ? null : reviewId;
}

isReplyOpen(reviewId: string): boolean {
  return this.openReplyFor === reviewId;
}

cancelReply(reviewId: string): void {
  this.replyDrafts[reviewId] = '';
  if (this.openReplyFor === reviewId) this.openReplyFor = null;
}

submitReply(reviewId: string): void {
  const text = (this.replyDrafts[reviewId] ?? '').trim();
  if (!text) return;

  const data: AppComment = {text};
  this.bookService.createComment(data, this.tokenStorage.getUserId(), reviewId, this.bookId).subscribe({
    next: (res: any) => {
      this.replyDrafts[reviewId] = '';
      if (this.openReplyFor === reviewId) this.openReplyFor = null;
    },
    error: (err: any) => {
      console.log("Error while creating comment ", err);
    }
  });
}

private resetReplyUI(): void {
  this.openReplyFor = null;
  this.replyDrafts = {};
}

reportReview(reviewId: string): void {
  this.router.navigate(['/reportForm/review', reviewId]);
}

}
