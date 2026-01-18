import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-worker-form',
  templateUrl: './worker-form.component.html',
  styleUrls: ['./worker-form.component.css']
})
export class WorkerFormComponent {

  worker: User = {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    type: 1,
    profilePictureUrl: '',
    readerBio: '',
    followerIds: null,
    followingIds: null,
    reviews: null,
    favoriteGenres: null,
    wishedBooksCount: 0,
    readBooksCount: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.createWorker(this.worker).subscribe({
      next: () => {
        console.log('Worker created');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Failed to create worker', err);
      }
    });
  }
}
