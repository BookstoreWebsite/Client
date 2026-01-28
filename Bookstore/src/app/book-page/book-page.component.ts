import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../service/book/book.service';
import { Review } from '../models/review';
import { forkJoin } from 'rxjs';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';
import { TokenStorageService } from '../service/auth/token.service';
import { AppComment } from '../models/comment';
import { User } from '../models/user';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css']
})
export class BookPageComponent implements OnInit {
  book: Book | null = null;
  isLoading = false;
  errorMessage = '';
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  id = this.route.snapshot.paramMap.get('id');
  isInRead = false;
  isInWished = false;
  showAddedMessage = false;
  isSubscribed = false;
  isTogglingSubscription = false;

  constructor(private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private tokenStorage: TokenStorageService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    if (!this.id) {
      this.errorMessage = 'Missing book id.';
      return;
    }
    this.loadBook(this.id);
  }

  checkLoginStatus(): void {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      const userId = this.tokenStorage.getUserId();
      if (this.isLoggedIn && userId && this.id) {
        this.loadUserBookFlags(userId, this.id);
      }

    })
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
    if ((this.book?.amount ?? 0) <= 0) return;
    console.log('Add to cart clicked');
    if(this.id != null){
      this.shoppingCartService.addToCart(this.tokenStorage.getUserId(), this.id).subscribe({
        next: (res: any) => {
          this.showAddedMessage = true;
          setTimeout(() => (this.showAddedMessage = false), 2000);
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
    next: () => {
      console.log('Added to wishlist');
      this.isInWished = true;
    },
    error: (err) => console.error('Failed to add to wishlist', err)
  });
}

addToRead(): void {
  const userId = this.tokenStorage.getUserId();
  const bookId = this.id;

  if (!userId || !bookId) return;

  this.bookService.addBookToRead(userId, bookId).subscribe({
    next: () => {
      console.log('Added to read');
      this.isInRead = true;
    },
    error: (err) => console.error('Failed to add to read', err)
  });
}

removeFromWished(): void {
  const userId = this.tokenStorage.getUserId();
  const bookId = this.id;
  if (!userId || !bookId) return;

  this.bookService.removeBookFromWished(userId, bookId).subscribe({
    next: () => {
      this.isInWished = false;
      console.log('Removed from wished');
    },
    error: (err) => console.error('Failed to remove from wished', err)
  });
}

removeFromRead(): void {
  const userId = this.tokenStorage.getUserId();
  const bookId = this.id;
  if (!userId || !bookId) return;

  this.bookService.removeBookFromRead(userId, bookId).subscribe({
    next: () => {
      this.isInRead = false;
      console.log('Removed from read');
    },
    error: (err) => console.error('Failed to remove from read', err)
  });
}


private loadUserBookFlags(userId: string, bookId: string): void {
  forkJoin({
    inRead: this.bookService.isBookInRead(userId, bookId),
    inWished: this.bookService.isBookInWished(userId, bookId),
    isSubscribed: this.bookService.isReaderSubscribed(userId, bookId)
  }).subscribe({
    next: ({ inRead, inWished, isSubscribed }) => {
      this.isInRead = !!inRead;
      this.isInWished = !!inWished;
      this.isSubscribed = !!isSubscribed;
    },
    error: (err) => {
      console.error('Failed to load read/wished/subscription flags', err);
    }
  });
}

toggleSubscription(): void {
  const userId = this.tokenStorage.getUserId();
  const bookId = this.id;

  if (!this.isLoggedIn || this.currentUser?.type !== 2) return;
  if (!userId || !bookId) return;
  if ((this.book?.amount ?? 0) !== 0) return;

  this.isTogglingSubscription = true;

  const req$ = this.isSubscribed
    ? this.bookService.unsubscribe(userId, bookId)
    : this.bookService.subscribe(userId, bookId);

  req$.subscribe({
    next: () => {
      this.isSubscribed = !this.isSubscribed;
      this.isTogglingSubscription = false;
    },
    error: (err) => {
      console.error('Subscription toggle failed', err);
      this.isTogglingSubscription = false;
    }
  });
}


}
