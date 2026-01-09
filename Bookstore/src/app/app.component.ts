import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bookstore';

  showGenreList = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        const current = event.urlAfterRedirects;

        if (current.startsWith('/login') || current === '/register') {
          this.showGenreList = false;
        } else {
          this.showGenreList = true;
        }
      }
    });
  }
}
