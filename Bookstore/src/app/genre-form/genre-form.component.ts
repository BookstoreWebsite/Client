import { Component } from '@angular/core';
import { GenreService } from '../service/genre/genre.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genre-form',
  templateUrl: './genre-form.component.html',
  styleUrls: ['./genre-form.component.css']
})
export class GenreFormComponent {
  name = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(private genreService: GenreService, private router: Router) {}

  submit(): void {
    const trimmed = this.name.trim();
    if (!trimmed) {
      this.errorMessage = 'Genre name is required.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.genreService.create({ name: trimmed }).subscribe({
      next: (res: any) => {
          console.log("Successfully created genre ", res);
          this.genreService.notifyGenresChanged();
          this.router.navigate([`/home`]);
      },
      error: (err: any) => {
        console.log("Error while creating genre ", err);
      }
    })
  }
}
