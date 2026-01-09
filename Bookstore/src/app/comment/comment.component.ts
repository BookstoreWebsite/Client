import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppComment } from '../models/comment';
import { BookService } from '../service/book/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment!: AppComment;
  @Input() level = 0; 

  repliesVisible = false;
  loadingReplies = false;

  @Output() reply = new EventEmitter<{ parentId: string; text: string }>();

  showReplyForm = false;
  replyText = '';

  constructor(private bookService: BookService, private router: Router) {}

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

    this.reply.emit({
      parentId: this.comment.id!,
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

    if (!this.comment.comments) {
      this.loadingReplies = true;

      this.bookService.getCommentReplies(this.comment.id!).subscribe({
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

}
