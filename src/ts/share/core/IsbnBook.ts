export type IndustryIdentifier = Readonly<{

    type: string;
    identifier: string;

}>;

export type IsbnBook = Readonly<{
    
    title: string;
    authors: ReadonlyArray<string>;
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: ReadonlyArray<IndustryIdentifier>;
    readingModes: Readonly<{
        text: boolean;
        image: boolean;
    }>;
    pageCount: number;
    printType: string;
    categories: ReadonlyArray<string>;
    averageRating: number;
    ratingsCount: number;
    contentVersion: string;
    imageLinks: Readonly<{
        smallThumbnail: string;
        thumbnail: string;
    }>;
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
    
}>;