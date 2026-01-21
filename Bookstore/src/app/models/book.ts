import { Genre } from "./genre";
import { GenreDto } from "./genreDto";
import { Review } from "./review";

export interface Book {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    author: string,
    rating: number | null,
    price: number | null,
    amount: number | null,
    addTime: Date | null,
    genres: GenreDto[] | null,
    reviews: Review[] | null,
}