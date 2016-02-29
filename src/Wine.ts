export class Wine {
    public id: number;
    constructor(public name: string,
                public description: string,
                public region: string,
                public inStock: number,
                public price: number,
                public myRating: number) {
        this.id = new Date().getTime();

    }
}