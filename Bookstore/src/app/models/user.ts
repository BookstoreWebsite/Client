import { Review } from "./review";

export interface User {
    id: string,
    username: string, 
    firstName: string,
    lastName: string, 
    email: string,
    hashedPassword: string,
    phoneNumber: string,
    type: number,
    profilePictureUrl: string,
    readerBio: string,
    followerIds: string[] | null,
    followingIds: string[] | null,
    reviews: Review[] | null,
    wishedBooksCount: number,
    readBooksCount: number
}