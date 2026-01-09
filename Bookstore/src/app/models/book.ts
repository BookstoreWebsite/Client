import { Genre } from "./genre";
import { Review } from "./review";

export interface Book {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    author: string,
    rating: number | null,
    price: number | null,
    genres: Genre[] | null,
    reviews: Review[] | null
}