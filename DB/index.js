let mongoose=require('mongoose')

const connection=mongoose.connect('mongodb://heroku_v8vc78vc:vfa41pdoa0bcen0fuagete2mck@ds041583.mlab.com:41583/heroku_v8vc78vc)

connection.then(res=>
console.log("connection established:::"),err=>
console.log("error while connecting to db:::",err))

let Schema=mongoose.Schema;



//create schema 

//schema for tasks
let taskSchema=Schema({
    title:String,
    isComplete:{type:Boolean,default:false},
})


//schema for buckets
let bucketSchema=new Schema({
    category:String,
    tasks:[taskSchema]
})

//create model/table from schema
const bucket=new mongoose.model('buckets',bucketSchema)


// try{
//      bucket.findById('5e6753cc8f922138ac3834b4').then(user=>{
//         user.tasks.push({title:"checking",isComplete:false})
//         user.save()
//     })
    
// }catch(e){
//     res.send(e)
// }



// const b1=new bucket({category:"college"})
// const b2=new bucket({category:"home"})

// b1.save().then(r=>console.log("saved",b1))
// b2.save().then(r=>console.log("saved",b2))

exports.bucket=bucket;
