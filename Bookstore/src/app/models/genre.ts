import { Book } from "./book";

export interface Genre{
    id: number,
    name: string,
    books: Book[] | null
}