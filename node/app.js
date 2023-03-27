const express = require("express");
const app =express();
const multer  =   require('multer');
const mysql = require('mysql2');
const cors = require('cors')
app.use(cors())

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"task",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});

app.use(express.static('uploads'))

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, `${req.query.unique}.jpg`);
    }
});

var upload = multer({ storage : storage}).single('img');

app.get("*",(req,res)=>{
    res.sendStatus(404)
})

app.post("/login",(req,res)=>{
    if(req.query.email && req.query.password){
        sql = "SELECT * from users WHERE email='"+req.query.email+"' AND password='"+req.query.password+"';";
        con.query(sql, function (err, result, fields) {
            if(err) res.json(err);
            res.json(result);
        });
    }else{
        res.sendStatus(404);
    }
})

app.post("/signup",(req,res)=>{
    if(req.query.fname && req.query.lname && req.query.email && req.query.password ){
        sql = "INSERT INTO users(fname,lname,email,password,profile,credit) VALUE('"+req.query.fname+"','"+req.query.lname+"','"+req.query.email+"','"+req.query.password+"','profile','0')";
        con.query(sql, function (err, result, fields) {
            if(err) res.json(err);
            res.json(result);
        });
    }else{
        res.sendStatus(404);
    }
})

app.post("/update",(req,res)=>{
    if(req.query.unique && req.query.fname && req.query.lname && req.query.email && req.query.id ){
        upload(req,res,function(err) {
            if(err) {
                return res.json(err);
            }
            sql = `UPDATE users SET fname='${req.query.fname}' , lname='${req.query.lname}' , email='${req.query.email}' , profile='${req.query.unique}' WHERE id='${req.query.id}'`
            con.query(sql, function (err, result, fields) {
                if(err) res.json(err);
                res.json(result);
            });
        });
    }else if(req.query.fname && req.query.lname && req.query.email && req.query.password && req.query.id){
        sql = `UPDATE users SET fname='${req.query.fname}' , lname='${req.query.lname}' , email='${req.query.email}' , password='${req.query.password}' WHERE id='${req.query.id}'`
        con.query(sql, function (err, result, fields) {
            if(err) res.json(err);
            res.json(result);
        });
    }else if(req.query.fname && req.query.lname && req.query.email && req.query.id){
        sql = `UPDATE users SET fname='${req.query.fname}' , lname='${req.query.lname}' , email='${req.query.email}'  WHERE id='${req.query.id}'`
        con.query(sql, function (err, result, fields) {
            if(err) res.json(err);
            res.json(result);
        });

    }else{
        res.sendStatus(404);
    }
})

app.post("/task",(req,res)=>{
    if(req.query.uid){
        sql = "SELECT * from tasks WHERE uid="+req.query.uid+" ORDER BY rem DESC";
        con.query(sql, function (err, result, fields) {
            if(err) res.json(err);
            res.json(result);
        });
    }else{
        res.sendStatus(404);
    }
})

app.post("/task/add",(req,res)=>{   
    if(req.query.title && req.query.content && req.query.color && req.query.unique && req.query.rem && req.query.uid ){
        upload(req,res,function(err) {
            if(err) {
                return res.json(err);
            }
            sql = `INSERT INTO tasks(uid,title,content,color,img,rem,type) VALUE('${req.query.uid}','${req.query.title}','${req.query.content}','${req.query.color}','${req.query.unique}','${req.query.rem}','pending')`;
            con.query(sql, function (err, result, fields) {
                if(err) res.json(err);
                res.json(result);
            });
        });
    }else if(req.query.title && req.query.content && req.query.color && req.query.rem && req.query.uid ){
        sql = "INSERT INTO tasks(uid , title , content , color,rem,img,type) VALUE('"+req.query.uid+"','"+req.query.title+"','"+req.query.content+"','"+req.query.color+"','"+req.query.rem+"','no','pending')";
        con.query(sql, function (err, result, fields) {
            if(err) res.json(err);
            res.json(result);
        });

    }else{
        res.sendStatus(404);
    }
})

app.post("/task/edit",(req,res)=>{
    if(req.query.id && req.query.title && req.query.content && req.query.color && req.query.unique && req.query.rem){
        upload(req,res,function(err) {
            if(err) {
                return res.json(err);
            }
            sql = `UPDATE tasks SET title='${req.query.title}' , content='${req.query.content}' , color='${req.query.color}' , rem='${req.query.rem}' , img='${req.query.unique}' WHERE id='${req.query.id}'`;
            con.query(sql, function (err, result, fields) {
                if(err) res.json(err);
                res.json(result);
            });
        });
    }else if(req.query.id  && req.query.title && req.query.content && req.query.color && req.query.rem){
        sql = `UPDATE tasks SET title='${req.query.title}' , content='${req.query.content}' , color='${req.query.color}' , rem='${req.query.rem}' WHERE id='${req.query.id}'`;
        con.query(sql, function (err, result, fields) {
            if(err) res.json(err);
            res.json(result);
        });
    }else{
        res.sendStatus(404)
    }
})

app.post("/task/drop",(req,res)=>{
    if(req.query.id){
        con.query("DELETE FROM tasks WHERE id="+req.query.id, function (err, result, fields) {
            res.json(result)
        });
    }else{
        res.sendStatus(404);
    }
})

app.post("/task/check",(req,res)=>{
    if(req.query.id && req.query.uid){
        con.query("UPDATE users SET credit = credit+2 WHERE id="+req.query.uid, function (err, result, fields) {
            con.query("UPDATE tasks SET type='completed' WHERE id="+req.query.id, function (err, result, fields) {
                res.json(result)
            });
        });
    }else{
        res.sendStatus(404);
    }
})

app.post("/search",(req,res)=>{
    if(req.query.name){
        con.query("SELECT * FROM users WHERE fname LIKE '%"+req.query.name+"%'", function (err, result, fields) {
            if(err){res.json(err)}
            res.json(result)
        });
    }else{
        res.sendStatus(404);
    }
})

app.post("/network",(req,res)=>{
    if(req.query.uid){
        con.query("SELECT * FROM users INNER JOIN network on network.uid='"+req.query.uid+"' AND network.fid=users.id WHERE NOT users.id='"+req.query.uid+"'", function (err, result, fields) {
            if(err){res.json(err)}
            res.json(result)
        });
    }else{
        res.sendStatus(404);
    }
})

app.post("/network/add",(req,res)=>{
    if(req.query.uid && req.query.fid){
        con.query("INSERT INTO network(uid , fid) VALUE('"+req.query.uid+"','"+req.query.fid+"')", function (err, result, fields) {
            if(err){res.json(err)}
            res.json(result)
        });
    }else{
        res.sendStatus(404);
    }
})

app.listen(3000 , "0.0.0.0");