const express= require('express');
const app=express();
const bodyParser=require('body-parser');
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName="hospitalManagement";
const col_name="Hospitals";
const coll_name="Ventilators";
//const middleware=require('middleware');
let db;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/json' }))

let server=require('./server');
let middleware=require('./middleware');

//CONNECTING TO DATABASE
MongoClient.connect(url, (err,client)=>{
        if(err) return console.log(err);
        db=client.db(dbName);
   
    console.log(`Connected Database: ${url}`);
        console.log(`Database : ${dbName}`);
    });


//READING HOSPITAL DETAILS
app.get('/h',middleware.checkToken,(req,res)=>{
    db.collection(col_name).find().toArray((err,result)=>{
        if(err) throw err;
        res.status(200).send(result)
    })
})

//READING VENTILATOR DETAILS
app.get('/v',middleware.checkToken,(req,res)=>{
    db.collection(coll_name).find().toArray((err,result)=>{
        if(err) throw err;
        res.status(200).send(result)
    })
})
//SEARCH VENTILATORS BY STATUS 
app.post('/searchs',middleware.checkToken,(req,res)=>{
    var status= req.body.status;
    console.log(status);
    var v=db.collection(coll_name).find( {"status":status}).toArray().then(result=> res.json(result));
  
});

//SEARCH VENTILATORS BY HOSPITAL NAME
app.post('/searchn',middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    console.log(name);
    var n=db.collection(coll_name).find({"name":name}).toArray().then(result => res.json(result));
});

//SEARCH HOSPITAL BY NAME
app.post('/searchh',middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    console.log(name);
    var h=db.collection(col_name).find({"name":name}).toArray().then(result => res.json(result));
});

//UPDATING VENTILATOR DETAILS 
//UPDATED KIMS VENTILATOR STATUS FROM OCCUPIED TO VACANT
app.put('/u',middleware.checkToken,(req,res)=>{
    var vid= {vId:req.body.vId};
    console.log(vid);
    var value={ $set:{ status:req.body.status} };
    db.collection(coll_name).updateOne(vid,value,function(err,result){
        res.json("UPDATED");
        if(err) throw err;
        console.log("documnet updated");
    });
});

//ADDING VENTILATOR
//ADDED TWO HOSPITALS RAINBOW AND NIMS
app.put('/addv',middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var vId=req.body.vId;
    var status=req.body.status;
    var name=req.body.name;
    var value={hId:req.body.hId,vId:req.body.vId,status:req.body.status,name:req.body.name};
    db.collection(coll_name).insert(value,function(err,result){
        res.json("ADDED");
        if(err) throw err;
        console.log("documnet has been added");
    });
    
})

//DELTE VENTILATOR BY VENT ID 
//DELETED APPOLLO HOSPITAL H1V5
app.delete('/delv',middleware.checkToken,(req,res)=>{
    
    var vId=req.body.vId;
    
    var value={vId:req.body.vId};
    db.collection(coll_name).deleteOne(value,function(err,result){
        res.json("DELETD");
        if(err) throw err;
        console.log("documnet Deleted");
    });
    
})

app.listen(3000);


