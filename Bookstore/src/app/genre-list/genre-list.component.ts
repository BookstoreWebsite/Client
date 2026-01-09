import { Component, OnInit } from '@angular/core';
import { Genre } from '../models/genre';
import { GenreService } from '../service/genre/genre.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css']
})
export class GenreListComponent implements OnInit{

  genres : Genre[] | undefined;
  private sub?: Subscription;

  constructor(private genreService: GenreService){}

  ngOnInit(): void {
    this.getGenres();
    this.sub = this.genreService.genresChanged$.subscribe(() => {
      this.getGenres();
    });
  }

  getGenres(){
    this.genreService.getAll().subscribe(
      (data: Genre[]) => {
        this.genres = data;
      },
      (error) => {
        console.error('Failed to fetch genres', error)
      }
    )
  }
}
