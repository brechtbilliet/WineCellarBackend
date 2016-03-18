import * as mongoose from "mongoose";
import {Model} from "mongoose";
import {Schema} from "mongoose";
var wineSchema: Schema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    region: String,
    userId: String,
    myRating: Number,
    inStock: Number,
    price: Number,
    image: String
})
export var Wine: Model<IWineModel> = mongoose.model<IWineModel>("Wine", wineSchema);
interface IWineModel extends IWine, mongoose.Document {
}
interface IWine {
    name: string;
    description: string;
    region: string;
    userId: string;
    myRating: Number;
    inStock: Number;
    price: Number;
    image: String;
}