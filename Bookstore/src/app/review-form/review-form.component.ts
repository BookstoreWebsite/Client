import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../service/book/book.service';
import { TokenStorageService } from '../service/auth/token.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit{

  reviewForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    text: ['', [Validators.required, Validators.maxLength(2000)]],
    rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]]
  });

  errorMessage = '';

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private bookService: BookService, private tokenStorage: TokenStorageService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Missing book id.';
      return;
    }
  }

  submit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Missing book id.';
      return;
    }

    const review = this.reviewForm.value;

    this.bookService.createReview(review, id ,this.tokenStorage.getUserId()).subscribe({
      next: (res: any) => {
        console.log("Review successfully created: ", res);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.log('Error while creating review: ', err)
      }
    })
  }
}
