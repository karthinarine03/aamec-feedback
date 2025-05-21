import mongoose from "mongoose";

const Subjects = new mongoose.Schema({
    subject : {
        type : String
    },semester: {
            type: String  
            },
    department : {
        type : String
    },
    ratings : [
        {
            student : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Student",
            },
            rating : {
                type : Number
            },
            comment : {
                type : String
            },
            faculty:{
                type:String
            },
            dept :{
                type : String
            },
            semester: {
            type: String  
            }
        }
    ]
},{timestamps : true})

export default (mongoose.model("Subjects",Subjects))