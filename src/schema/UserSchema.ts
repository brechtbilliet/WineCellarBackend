import * as mongoose from "mongoose";
import {Model} from "mongoose";
import {Schema} from "mongoose";
import * as bcrypt from "bcrypt";
export interface IUserModel extends IUser, mongoose.Document {
}
export interface IUser {
    login: string;
    firstName: string;
    lastName: string;
    password: string;
}
const SALT_WORK_FACTOR: number = 10;
let userSchema: Schema = new mongoose.Schema({
    login: {type: String, required: true, index: {unique: true}},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true}
})
export let User: Model<IUserModel> = mongoose.model<IUserModel>("User", userSchema);


userSchema.pre("save", function (next: Function) {
    var user: any = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err: any, salt: any) => {
        if (err) {
            return next(err);
        }

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, (err2: any, hash: any) => {
            if (err) {
                return next(err2);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});