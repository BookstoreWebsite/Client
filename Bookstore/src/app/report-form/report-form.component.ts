import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../service/auth/token.service';
import { BookService } from '../service/book/book.service';
import { ReportReason } from '../enums/report-reason';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {
  targetId: string | null = null;

  text = '';
  selectedReason: ReportReason | null = null;

  isSubmitting = false;
  errorMessage = '';
  isReviewReport = false;

  reasons: { value: ReportReason; label: string }[] = [
  { value: ReportReason.Profanity, label: 'Profanity' },
  { value: ReportReason.Misinformation, label: 'Misinformation' },
  { value: ReportReason.Irrelevant, label: 'Irrelevant' },
  { value: ReportReason.ViolenceOrHate, label: 'Violence or hate' },
  { value: ReportReason.Spam, label: 'Spam' },
];

  constructor(private route: ActivatedRoute, private router: Router, private tokenStorage: TokenStorageService, private bookService: BookService) {}

  ngOnInit(): void {
    this.targetId = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');
    this.isReviewReport = type === 'review';
    if (!this.targetId) {
      this.errorMessage = 'Missing report target id.';
    }
  }

  submit(): void {
  this.errorMessage = '';

  const trimmed = this.text.trim();
  const userId = this.tokenStorage.getUserId();

  if (!this.targetId) {
    this.errorMessage = 'Missing report target id.';
    return;
  }

  if (!userId) {
    this.errorMessage = 'User not authenticated.';
    return;
  }

  if (!this.selectedReason) {
    this.errorMessage = 'Please select a reason.';
    return;
  }

  if (!trimmed) {
    this.errorMessage = 'Please enter report text.';
    return;
  }

  const data = {
    text: trimmed,
    reason: this.selectedReason as any,
    isReviewReport: this.isReviewReport
  };

  this.isSubmitting = true;

  this.bookService.createReport(data, userId, this.targetId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to create report', err);
        this.errorMessage = 'Failed to submit report.';
        this.isSubmitting = false;
      }
    });
}


  cancel(): void {
    this.router.navigate(['/']); 
  }
}
