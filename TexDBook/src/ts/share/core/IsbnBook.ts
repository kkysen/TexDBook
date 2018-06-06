export interface IsbnBook {
    
    readonly isbn: string;
    readonly department: string;
    
    readonly title: string;
    readonly authors: ReadonlyArray<string>;
    readonly publisher: string;
    readonly publishedDate: string;
    readonly description: string;
    readonly pageCount: number;
    readonly categories: ReadonlyArray<string>;
    readonly averageRating: number;
    readonly ratingsCount: number;
    readonly image?: string;
    readonly language: string;
    readonly previewLink: string;
    readonly infoLink: string;
    readonly link: string;
    
}