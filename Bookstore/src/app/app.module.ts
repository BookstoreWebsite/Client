import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './layout/navbar/navbar/navbar.component';
import { BookCardComponent } from './book-card/book-card.component';
import { BookFormComponent } from './book-form/book-form.component';
import { ReaderProfileComponent } from './reader-profile/reader-profile.component';
import { SearchReadersComponent } from './search-readers/search-readers.component';
import { GenreListComponent } from './genre-list/genre-list.component';
import { GenreComponent } from './genre/genre.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CartItemComponent } from './cart-item/cart-item.component';
import { PaymentComponent } from './payment/payment.component';
import { BookPageComponent } from './book-page/book-page.component';
import { ReviewFormComponent } from './review-form/review-form.component';
import { AllBookReviewsComponent } from './all-book-reviews/all-book-reviews.component';
import { CommentComponent } from './comment/comment.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { ReportsComponent } from './reports/reports.component';
import { WishedBooksComponent } from './wished-books/wished-books.component';
import { ReadBooksComponent } from './read-books/read-books.component';
import { BookListCardComponent } from './book-list-card/book-list-card.component';
import { GenreFormComponent } from './genre-form/genre-form.component';
import { WorkerFormComponent } from './worker-form/worker-form.component';
import { FollowingComponent } from './following/following.component';
import { FollowersComponent } from './followers/followers.component';
import { SearchResultsComponent } from './search-results/search-results.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    BookCardComponent,
    BookFormComponent,
    ReaderProfileComponent,
    SearchReadersComponent,
    GenreListComponent,
    GenreComponent,
    ShoppingCartComponent,
    CartItemComponent,
    PaymentComponent,
    BookPageComponent,
    ReviewFormComponent,
    AllBookReviewsComponent,
    CommentComponent,
    ReportFormComponent,
    ReportsComponent,
    WishedBooksComponent,
    ReadBooksComponent,
    BookListCardComponent,
    GenreFormComponent,
    WorkerFormComponent,
    FollowingComponent,
    FollowersComponent,
    SearchResultsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
