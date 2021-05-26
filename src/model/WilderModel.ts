import * as mongoose from "mongoose";
const Schema = mongoose.Schema;


const WilderSchema = new Schema( 
    {
        id: String,
        name: String, 
        city: String
    }
); 


const model:mongoose.Model<any> =  mongoose.model("wilder", WilderSchema);
export default model;