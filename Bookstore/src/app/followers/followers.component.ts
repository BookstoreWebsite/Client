import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Follow } from '../models/follow';
import { UserService } from '../service/user/user.service';

@Component({
  selector: 'app-following',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent {
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

    this.loadFollowers(this.userId);
  }

  private loadFollowers(id: string): void {
    this.isLoading = true;
    this.errorText = '';

    this.userService.getFollowers(id).subscribe({
      next: (data) => {
        this.users = data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load followers:', err);
        this.errorText = 'Failed to load followers.';
        this.isLoading = false;
      }
    });
  }

  getAvatar(u: Follow): string {
    return u?.profilePicture ? u.profilePicture : this.defaultAvatar;
  }
}
