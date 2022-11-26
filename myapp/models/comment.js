const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const uniqueValidator =require('mongoose-unique-validator');
const commentSchema=new Schema({
    creator:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
    post:{type:mongoose.Types.ObjectId,required:true,ref:'Post'},
    dateCreated:{type:Date,default: Date.now()}
});

commentSchema.plugin(uniqueValidator);
module.exports=mongoose.model('Comment',commentSchema);

