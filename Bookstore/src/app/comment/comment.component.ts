import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AppComment } from '../models/comment';
import { BookService } from '../service/book/book.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { TokenStorageService } from '../service/auth/token.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment!: AppComment;
  @Input() level = 0;

  repliesVisible = false;
  loadingReplies = false;

  @Output() reply = new EventEmitter<{ parentId: string; text: string }>();

  showReplyForm = false;
  replyText = '';

  @Input() showRemove = false;
  @Output() remove = new EventEmitter<string>();

  userType?: number;

  constructor(
    private bookService: BookService,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    const userId = this.tokenStorage.getUserId();
    if (!userId) return;

    this.authService.getById(userId).subscribe({
      next: (u: any) => (this.userType = u?.type),
      error: () => (this.userType = undefined)
    });
  }

  get canReport(): boolean {
    return this.userType === 2;
  }

  get canRemove(): boolean {
    return this.userType === 0 && this.showRemove;
  }

  toggleReplyForm(): void {
    this.showReplyForm = !this.showReplyForm;
  }

  cancelReply(): void {
    this.replyText = '';
    this.showReplyForm = false;
  }

  submitReply(): void {
    const text = this.replyText.trim();
    if (!text) return;

    if (!this.comment?.id) return;

    this.reply.emit({
      parentId: this.comment.id,
      text
    });

    this.replyText = '';
    this.showReplyForm = false;
  }

  toggleReplies(): void {
    if (this.repliesVisible) {
      this.repliesVisible = false;
      return;
    }

    if (!this.comment?.id) return;

    if (!this.comment.comments) {
      this.loadingReplies = true;

      this.bookService.getCommentReplies(this.comment.id).subscribe({
        next: (replies) => {
          this.comment.comments = replies ?? [];
          this.repliesVisible = true;
          this.loadingReplies = false;
        },
        error: () => {
          this.loadingReplies = false;
        }
      });
    } else {
      this.repliesVisible = true;
    }
  }

  reportComment(): void {
    if (!this.comment?.id) return;
    this.router.navigate(['/reportForm/comment', this.comment.id]);
  }

  onRemoveClick(): void {
    if (!this.comment?.id) return;
    this.remove.emit(this.comment.id);
  }
}
