import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../service/user/user.service';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-search-readers',
  templateUrl: './search-readers.component.html',
  styleUrls: ['./search-readers.component.css']
})
export class SearchReadersComponent implements OnInit{
  searchTerm: string = '';
  users: User[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  hasSearched = false;
  defaultAvatar = 'assets/default-profile-picture.png';
  currentUser: User | null = null;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    })
  }

  onSearch(): void {
    const query = this.searchTerm.trim();
    this.errorMessage = null;

    if(!query) {
      this.users = []
      this.hasSearched = false;
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;

    this.userService.searchUsers(query).subscribe({
      next: (result: User[]) => {
        this.users = result;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = "An error ocurred during the search.";
        this.isLoading = false;
      }
    })
  }

  canFollow(user: User): boolean {
    if (!this.currentUser) return false;

    if (user.id === this.currentUser.id) return false;

    const following = this.currentUser.followingIds ?? [];

    const alreadyFollowing = following.some(f => f === user.id);

    return !alreadyFollowing;
  }

  onFollow(user: User): void {
    if (!this.currentUser) return;

    this.userService.follow(this.currentUser.id, user.id).subscribe({
      next: () => {
        if (!this.currentUser!.followingIds) {
          this.currentUser!.followingIds = [];
        }
        this.currentUser!.followingIds.push(user.id);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Could not follow this user.';
      }
    });
  }

}
