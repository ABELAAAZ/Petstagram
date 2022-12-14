const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const postSchema=new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    image:{type:String, required:false},
    address:{type:String, required:true},
    location:{
        lat:{type:Number, required:true},
        lng:{type:Number, required:true}
    },
    creator:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
    comments:[{type:mongoose.Types.ObjectId,required:true,ref:'Comment'}],
    dateCreated:{type:Date,default: Date.now()}
});

module.exports=mongoose.model('Post',postSchema);

