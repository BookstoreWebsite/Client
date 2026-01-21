import { Genre } from "./genre";
import { GenreDto } from "./genreDto";
import { Review } from "./review";

export interface User {
    id: string,
    username: string, 
    firstName: string,
    lastName: string, 
    email: string,
    password: string,
    phoneNumber: string,
    type: number,
    profilePictureUrl: string,
    readerBio: string,
    followerIds: string[] | null,
    followingIds: string[] | null,
    reviews: Review[] | null,
    favoriteGenres: GenreDto[] | null,
    wishedBooksCount: number,
    readBooksCount: number
}