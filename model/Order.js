const mongoose = require('mongoose')
const {Schema} = mongoose

const paymentMethods = {
    values: ['cash', 'card'],
    message: 'enum validator failed for payment methods'
  }

const orderSchema = new Schema({
   
    items : {type:[Schema.Types.Mixed] , required:true},
    totalAmount : {type:Number},
    totalItems : {type:Number},
    user : {type:Schema.Types.ObjectId,ref:'User',required:true},
    //TODO : we can add enum types
    paymentMethod : {type:String , required:true , enum: paymentMethods},
    selectedAddress : {type:Schema.Types.Mixed,required:true},
    status : {type:String , default:'pending'}




},{timestamps:true})


const virtual = orderSchema.virtual('id');
virtual.get(function(){
    return this._id
})
orderSchema.set('toJSON',{
    virtuals : true,
    versionKey : false,
    transform : function (doc,ret){delete ret._id}
})

exports.Order = mongoose.model('Order',orderSchema)