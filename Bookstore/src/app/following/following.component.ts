import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Follow } from '../models/follow';
import { UserService } from '../service/user/user.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent {
  users: Follow[] = [];

  isLoading = true;
  errorText = '';

  defaultAvatar = 'assets/default-avatar.png';

  private userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (!this.userId) {
      this.isLoading = false;
      this.errorText = 'Missing user id in route.';
      return;
    }

    this.loadFollowing(this.userId);
  }

  private loadFollowing(id: string): void {
    this.isLoading = true;
    this.errorText = '';

    this.userService.getFollowing(id).subscribe({
      next: (data) => {
        this.users = data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load following:', err);
        this.errorText = 'Failed to load following users.';
        this.isLoading = false;
      }
    });
  }

  getAvatar(u: Follow): string {
    return u?.profilePicture ? u.profilePicture : this.defaultAvatar;
  }
}
