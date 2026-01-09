export interface AppReport {
    id: string,
    text: string,
    reason: number,
    userId?: string,
    reviewId?: string,
    commentId?: string,
    isReviewReport?: string 
}