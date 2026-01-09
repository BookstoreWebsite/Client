import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../service/book/book.service';
import { Review } from '../models/review';
import { forkJoin } from 'rxjs';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';
import { TokenStorageService } from '../service/auth/token.service';
import { AppComment } from '../models/comment';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css']
})
export class BookPageComponent implements OnInit {
  book: Book | null = null;
  isLoading = false;
  errorMessage = '';
  id = this.route.snapshot.paramMap.get('id');
  constructor(private route: ActivatedRoute, private bookService: BookService, private router: Router, private shoppingCartService: ShoppingCartService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    if (!this.id) {
      this.errorMessage = 'Missing book id.';
      return;
    }
    this.loadBook(this.id);
  }

  private loadBook(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      book: this.bookService.getById(id),
      reviews: this.bookService.getAllBookReviews(id)
      }).subscribe({
        next: ({ book, reviews }) => {
          this.book = {
            ...book,
            reviews
          };
          this.isLoading = false;
          const top3 = this.displayedReviews;
          top3.forEach(r => this.loadCommentsForReview(r));
        },
        error: err => {
          console.error(err);
          this.errorMessage = 'Failed to load book.';
          this.isLoading = false;
        }
      });
  }

  leaveReview(): void {
    this.router.navigate(['/createReview', this.id])
  }

  viewAllReviews(): void {
    console.log('View all reviews clicked');
    this.router.navigate(['/allBookReviews', this.id])
  }

  addToCart(): void {
    console.log('Add to cart clicked');
    if(this.id != null){
      this.shoppingCartService.addToCart(this.tokenStorage.getUserId(), this.id).subscribe({
        next: (res: any) => {
          console.log("Added to shopping cart!", res);
        },
        error: (err: any) => {
          console.log("Error while adding to shopping cart!", err);
        }
      })
    }
  }

  get displayedReviews() {
    return (this.book?.reviews ?? []).slice(0, 3);
  }

  trackByReviewId(index: number, r: Review): string {
  return r.id;
}

loadCommentsForReview(review: Review): void {
  if (review.commentsLoaded) return;

  review.commentsLoading = true;

  this.bookService.getAllReviewComments(review.id).subscribe({
    next: (comments) => {
      review.comments = comments ?? [];
      review.commentsLoaded = true;
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
  if (this.openReplyFor === reviewId) {
    this.openReplyFor = null;
  }
}

submitReply(reviewId: string): void {
  const text = (this.replyDrafts[reviewId] ?? '').trim();
  if (!text) return;

  const data: AppComment = {text};
  if(this.id != null){
  this.bookService.createComment(data, this.tokenStorage.getUserId(), reviewId, this.id).subscribe({
    next: (res: any) => {
      this.replyDrafts[reviewId] = '';
      if (this.openReplyFor === reviewId) this.openReplyFor = null;
      const review = this.displayedReviews.find(r => r.id === reviewId);
      if (review) this.reloadCommentsForReview(review);
    },
    error: (err: any) => {
      console.log("Error while creating comment ", err);
    }
  });
}
}

reloadCommentsForReview(review: Review): void {
  review.commentsLoading = true;

  this.bookService.getAllReviewComments(review.id).subscribe({
    next: (comments) => {
      review.comments = comments ?? [];
      review.commentsLoaded = true;
      review.commentsLoading = false;
    },
    error: (err) => {
      console.error('Failed to load comments', err);
      review.commentsLoading = false;
    }
  });
}

submitCommentReply(
  event: { parentId: string; text: string },
  reviewId: string
): void {
  const data: AppComment = { text: event.text, hasReplies: false };

  if (!this.id) return;

  this.bookService.createComment(data, this.tokenStorage.getUserId(), reviewId, this.id, event.parentId).subscribe({
    next: () => {
      const review = this.displayedReviews.find(r => r.id === reviewId);
      if (review) this.reloadCommentsForReview(review);
    },
    error: err => console.error('Reply failed', err)
  });
}

reportReview(reviewId: string): void {
  this.router.navigate(['/reportForm/review', reviewId]);
}

addToWishlist(): void {
  const userId = this.tokenStorage.getUserId();
  const bookId = this.id;

  if (!userId || !bookId) return;

  this.bookService.addBookToWished(userId, bookId).subscribe({
    next: () => console.log('Added to wishlist'),
    error: (err) => console.error('Failed to add to wishlist', err)
  });
}

addToRead(): void {
  const userId = this.tokenStorage.getUserId();
  const bookId = this.id;

  if (!userId || !bookId) return;

  this.bookService.addBookToRead(userId, bookId).subscribe({
    next: () => console.log('Added to read'),
    error: (err) => console.error('Failed to add to read', err)
  });
}


}
