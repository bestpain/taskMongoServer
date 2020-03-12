const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors')
app.use(express.json())
var ObjectId = require('mongodb').ObjectID;
app.use(cors())

//DB related work
const DB=require('./DB')


//Routers
app.get('/buckets',(req,res)=>{
	DB.bucket.find({},'category').then((result)=>{
		res.send(result)
	})
});

//view all todo
app.get('/todos/:id',(req,res)=>{
	const {id}=req.params;
	DB.bucket.findById(id,'tasks').then((result)=>{
		res.send(result)
	})	
});


app.post('/todos/add/:id', (req,res)=>{
	const {task}=req.body;
	
		DB.bucket.findById(req.params.id).then(selectedBucket=>{
			selectedBucket.tasks.push({title:task})
			selectedBucket.save().then(updatedBucket=>{
				res.status(201).send({_id:req.params.id,task:updatedBucket.tasks[updatedBucket.tasks.length-1]})
			})
		})
});

app.post('/bucket/add',(req,res)=>{
	const {Value}=req.body;	
	const bucket=new DB.bucket({category:req.body.Value})
	bucket.save().then(result=>{
		res.status(201).send(result)
	})
});



//update a todo
app.put('/todos/toggle/:id',async (req,res)=>{
	const {id}=req.params;
	let updateBucket;
	
	DB.bucket.findByIdAndUpdate(req.body.bucketId).then(async buck=>{	
		 updateBucket=await buck.tasks.id(id)
		 updateBucket.isComplete=!updateBucket.isComplete;
		 buck.save().then(result=>res.send(result.tasks.filter(t=>t._id==id)));
	})
	// updateBucket=await DB.bucket.update({'_id': req.body.bucketId,
    //                 'tasks._id' :id}, 
    //  // you can update only one nested document matched by query                   
    //                 {$set: { 'tasks.$.isComplete': !'tasks.$.isComplete' }} )
	// console.log(updateBucket)
});

//edit a todo
app.put('/todos/edit/:id',async (req,res)=>{
	const {id}=req.params;
	const {name}=req.body;
	let updateBucket;
	const {bucketId}=req.body;
	DB.bucket.findByIdAndUpdate(bucketId).then(async buck=>{	
		updateBucket=await buck.tasks.id(id)
		updateBucket.title=name;
		buck.save().then(result=>res.send(result.tasks.filter(t=>t._id==id)));
   })
});

//delete a todo
app.delete('/todos/delete/:bucket/:id',(req,res)=>{
	const {bucket,id}=req.params;
		DB.bucket.findByIdAndUpdate(bucket).then(async buck=>{	
		updateBucket=await buck.tasks.id(id)
		updateBucket.remove()
		buck.save().then((result)=>res.send(updateBucket))
   })
});

app.listen(port,()=>{
	console.log(`server listening on port ${port}`)
})
