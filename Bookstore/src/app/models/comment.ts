export interface AppComment {
    id?: string,
    text: string,
    username?: string,
    profilePicture?: string,
    comments?: AppComment[] | null,
    hasReplies?: boolean
}