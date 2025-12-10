import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../service/auth/auth.service';
import { TokenStorageService } from '../service/auth/token.service';

@Component({
  selector: 'app-reader-profile',
  templateUrl: './reader-profile.component.html',
  styleUrls: ['./reader-profile.component.css']
})
export class ReaderProfileComponent implements OnInit{
  @Input() user!: User;

  defaultProfilePicture = 'assets/default-profile-picture.png';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService){}

  ngOnInit(){
    this.fetchUser();
  }

  fetchUser(){
    this.authService.getById(this.tokenStorage.getUserId()).subscribe(
      (data: User) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  get followersCount(): number {
  return this.user?.followersIds?.length ?? 0;
  }

  get followingCount(): number {
    console.log(this.user)
    return this.user?.followingIds?.length ?? 0;
  }

  get profileImage(): string {
    return this.user?.profilePictureUrl || this.defaultProfilePicture;
  }
}
