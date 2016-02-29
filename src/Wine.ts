export class Wine {
    public _id: string;
    constructor(public name: string,
                public description: string,
                public region: string,
                public inStock: number,
                public price: number,
                public myRating: number) {
    }
}