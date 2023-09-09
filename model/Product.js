const mongoose = require('mongoose')
const {Schema} = mongoose


const productSchema = new Schema({
    title : {type : String, required:true , unique : true},
    description : {type : String ,required:true},
    price : {type : Number , min:[0,'worng min price'],max:[10000,'worng max price']},
    discountPercentage : {type : Number , min:[0,'worng min discount'],max:[100,'worng max discount']},
    rating : {type : Number , min:[0,'worng min rating'],max:[5,'worng max rating'] , default:0},
    stock : {type : Number , min:[0,'worng min stock'],default:0},
    brand : {type : String ,required:true},
    category : {type : String ,required:true},
    thumbnail : {type : String ,required:true},
    images : {type : [String],required:true},
    colors:{type:[Schema.Types.Mixed]},
    sizes:{type:[Schema.Types.Mixed]},
    discountPrice : {type : Number},
    highlights:{type:[String]},
    deleted : {type : Boolean ,default:false},
})


const virtualId = productSchema.virtual('id');
virtualId.get(function(){
    return this._id
})

// we can't sort using virtual field . better to make this fileld at time of doc creation

// const virtualDiscountPrice = productSchema.virtual('discountPrice');
// virtualDiscountPrice.get(function(){
//     return Math.round(this.price*(1-this.discountPercentage/100))
// })

productSchema.set('toJSON',{
    virtuals : true,
    versionKey : false,
    transform : function (doc,ret){delete ret._id}
})

exports.Product = mongoose.model('Product',productSchema)