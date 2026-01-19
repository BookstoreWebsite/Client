import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BookFormComponent } from './book-form/book-form.component';
import { ReaderProfileComponent } from './reader-profile/reader-profile.component';
import { SearchReadersComponent } from './search-readers/search-readers.component';
import { GenreComponent } from './genre/genre.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PaymentComponent } from './payment/payment.component';
import { BookPageComponent } from './book-page/book-page.component';
import { ReviewFormComponent } from './review-form/review-form.component';
import { AllBookReviewsComponent } from './all-book-reviews/all-book-reviews.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { ReportsComponent } from './reports/reports.component';
import { WishedBooksComponent } from './wished-books/wished-books.component';
import { ReadBooksComponent } from './read-books/read-books.component';
import { GenreFormComponent } from './genre-form/genre-form.component';
import { WorkerFormComponent } from './worker-form/worker-form.component';
import { FollowingComponent } from './following/following.component';
import { FollowersComponent } from './followers/followers.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'bookForm', component: BookFormComponent},
  { path: 'books/:id/edit', component: BookFormComponent },
  { path: 'readerProfile', component: ReaderProfileComponent},
  { path: 'profile/:id', component: ReaderProfileComponent },
  { path: 'searchReaders', component: SearchReadersComponent},
  { path: 'genre/:id', component: GenreComponent},
  { path: 'shoppingCart', component: ShoppingCartComponent},
  { path: 'payment', component: PaymentComponent},
  { path: 'books/:id', component: BookPageComponent },
  { path: 'createReview/:id', component: ReviewFormComponent},
  { path: 'allBookReviews/:id', component: AllBookReviewsComponent},
  { path: 'reportForm/:type/:id', component: ReportFormComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'wishedBooks/:userId', component: WishedBooksComponent},
  { path: 'readBooks/:userId', component: ReadBooksComponent},
  { path: 'genreForm', component: GenreFormComponent},
  { path: 'addWorker', component: WorkerFormComponent },
  { path: 'following/:id', component: FollowingComponent },
  { path: 'followers/:id', component: FollowersComponent },
  { path: 'search', component: SearchResultsComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
