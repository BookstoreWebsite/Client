import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../service/auth/auth.service';
import { TokenStorageService } from '../service/auth/token.service';
import { UserService } from '../service/user/user.service';
import { GenreService } from '../service/genre/genre.service';
import { Genre } from '../models/genre';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';
import { Purchase } from '../models/purchase';

@Component({
  selector: 'app-reader-profile',
  templateUrl: './reader-profile.component.html',
  styleUrls: ['./reader-profile.component.css']
})
export class ReaderProfileComponent implements OnInit {
  @Input() user!: User;

  defaultProfilePicture = 'assets/default-profile-picture.png';

  viewerId!: string;
  targetUserId!: string;

  showGenres = false;

  allGenres: Genre[] = [];
  loadingGenres = false;
  savingGenres = false;
  genresError: string | null = null;

  selectedGenreIds = new Set<string>();

  showPurchaseHistory = false;
  purchases: Purchase[] = [];
  loadingPurchases = false;
  purchasesError: string | null = null;

  editingBio = false;
  bioDraft = '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private genreService: GenreService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.viewerId = this.tokenStorage.getUserId();

    const routeId = this.route.snapshot.paramMap.get('id');
    this.targetUserId = routeId ?? this.viewerId;

    this.fetchUser(this.targetUserId);
  }

  fetchUser(id: string) {
    this.authService.getById(id).subscribe({
      next: (data: User) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
      }
    });
  }

  get isMyProfile(): boolean {
    return this.targetUserId === this.viewerId;
  }

  get isFollowedByMe(): boolean {
    if (this.isMyProfile) return true;
    return this.user?.followerIds?.includes(this.viewerId) ?? false;
  }

  get canOpenStats(): boolean {
    return this.isMyProfile || this.isFollowedByMe;
  }

  get showFollowButton(): boolean {
    return !this.isMyProfile && !this.isFollowedByMe;
  }

  togglePurchaseHistory(): void {
    if (!this.isMyProfile) return;

    this.showPurchaseHistory = !this.showPurchaseHistory;

    if (this.showPurchaseHistory && this.purchases.length === 0) {
      this.loadPurchaseHistory();
    }
  }

  private loadPurchaseHistory(): void {
    this.loadingPurchases = true;
    this.purchasesError = null;

    this.shoppingCartService.getPurchaseHistory(this.viewerId).subscribe({
      next: (items: Purchase[]) => {
        const normalized = (items ?? []).map(p => ({
          ...p,
          dateTime: new Date(p.dateTime as any)
        }));

        normalized.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

        this.purchases = normalized;
        this.loadingPurchases = false;
      },
      error: (err) => {
        console.error('Error loading purchase history', err);
        this.purchasesError = 'Failed to load purchase history.';
        this.loadingPurchases = false;
      }
    });
  }

  onFollow(): void {
    if (!this.user?.id) return;

    this.userService.follow(this.viewerId, this.user.id).subscribe({
      next: () => {
        if (!this.user.followerIds) this.user.followerIds = [];
        if (!this.user.followerIds.includes(this.viewerId)) {
          this.user.followerIds.push(this.viewerId);
        }
      },
      error: (err) => console.error('Follow error', err)
    });
  }

  onUnfollow(): void {
  if (!this.user?.id) return;

  this.userService.unfollow(this.viewerId, this.user.id).subscribe({
    next: () => {
      this.user.followerIds = (this.user.followerIds ?? []).filter(id => id !== this.viewerId);
    },
    error: (err) => console.error('Unfollow error', err)
  });
}


  goToFollowers(): void {
    if (!this.canOpenStats) return;
    this.router.navigate(['/followers', this.user.id]);
  }

  goToFollowing(): void {
    if (!this.canOpenStats) return;
    this.router.navigate(['/following', this.user.id]);
  }

  goToReadBooks(): void {
    if (!this.canOpenStats) return;
    this.router.navigate(['/readBooks', this.user.id]);
  }

  goToWishedBooks(): void {
    if (!this.canOpenStats) return;
    this.router.navigate(['/wishedBooks', this.user.id]);
  }

  get followersCount(): number {
    return this.user?.followerIds?.length ?? 0;
  }

  get followingCount(): number {
    return this.user?.followingIds?.length ?? 0;
  }

  get profileImage(): string {
    return this.user?.profilePictureUrl || this.defaultProfilePicture;
  }

  get readBooksCount(): number {
    return this.user?.readBooksCount ?? 0;
  }

  get wishedBooksCount(): number {
    return this.user?.wishedBooksCount ?? 0;
  }

  toggleGenres(): void {
  this.showGenres = !this.showGenres;

  if (this.showGenres && this.allGenres.length === 0) {
    this.loadGenres();
    this.prefillSelectedFromUser();
  }
}

private prefillSelectedFromUser(): void {
  this.selectedGenreIds.clear();
  (this.user?.favoriteGenres ?? []).forEach(g => this.selectedGenreIds.add(g.id));
}

private loadGenres(): void {
  this.loadingGenres = true;
  this.genresError = null;

  this.genreService.getAll().subscribe({
    next: (genres: Genre[]) => {
      this.allGenres = genres ?? [];
      this.loadingGenres = false;
    },
    error: (err) => {
      console.error('Error loading genres', err);
      this.genresError = 'Failed to load genres.';
      this.loadingGenres = false;
    }
  });
}

onGenreToggle(genreId: string, event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;

  if (checked) this.selectedGenreIds.add(genreId);
  else this.selectedGenreIds.delete(genreId);
}

saveFavoriteGenres(): void {
  const userId = this.viewerId;

  const genreIds = Array.from(this.selectedGenreIds);

  this.savingGenres = true;
  this.genresError = null;

  this.genreService.addGenresToFavorites(userId, genreIds).subscribe({
    next: () => {
      this.savingGenres = false;

      this.user.favoriteGenres = this.allGenres.filter(g => this.selectedGenreIds.has(g.id));
    },
    error: (err) => {
      console.error('Save favorite genres error', err);
      this.genresError = 'Failed to save favorite genres.';
      this.savingGenres = false;
    }
  });
}

goToPurchaseDetails(purchaseId: string): void {
  if (!purchaseId) return;
  this.router.navigate(['/purchase', purchaseId]);
}

editBio() {
  const text = window.prompt('Edit bio', this.user?.readerBio ?? '');
  if (text === null || !this.user) return;

  this.userService.editBio(this.user.id, text).subscribe({
    next: (updated) => {
      this.user.readerBio = updated.readerBio;
    }
  });
}

startEditBio() {
  if (!this.user) return;
  this.bioDraft = this.user.readerBio ?? '';
  this.editingBio = true;
}

cancelEditBio() {
  this.editingBio = false;
}

saveBio() {
  if (!this.user) return;

  this.userService.editBio(this.user.id, this.bioDraft).subscribe({
    next: () => {
      this.user.readerBio = this.bioDraft;
      this.editingBio = false;
    }
  });
}

}
