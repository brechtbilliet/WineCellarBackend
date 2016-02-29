import * as mongoose from "mongoose";
import {Model} from "mongoose";
import {Schema} from "mongoose";
var wineSchema: Schema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    region: String
})
export var Wine: Model<IWineModel> = mongoose.model<IWineModel>("Wine", wineSchema);
interface IWineModel extends IWine, mongoose.Document {
}
interface IWine {
    name: string;
    description: string;
    region: string;
}