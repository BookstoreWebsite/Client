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
    followers: User[] | null,
    following: User[] | null
}