export interface IndustryIdentifier {

    readonly type: string;
    readonly identifier: string;

}

export interface IsbnBook {
    
    readonly title: string;
    readonly authors: ReadonlyArray<string>;
    readonly publisher: string;
    readonly publishedDate: string;
    readonly description: string;
    readonly industryIdentifiers: ReadonlyArray<IndustryIdentifier>;
    readonly readingModes: {
        readonly text: boolean;
        readonly image: boolean;
    };
    readonly pageCount: number;
    readonly printType: string;
    readonly categories: ReadonlyArray<string>;
    readonly averageRating: number;
    readonly ratingsCount: number;
    readonly contentVersion: string;
    readonly imageLinks: {
        readonly smallThumbnail: string;
        readonly thumbnail: string;
    };
    readonly language: string;
    readonly previewLink: string;
    readonly infoLink: string;
    readonly canonicalVolumeLink: string;
    
}