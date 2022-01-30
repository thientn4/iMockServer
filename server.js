const http=require('http');
const fs=require('fs');

//////////////////////////CONNECT TO LOCAL SQL DATABASE TO TEST//////////////////////

/*
const {Client}=require('pg');
const db=new Client({
    host:"localhost",
    user:"postgres",
    port: 5432,
    password: "723155",
    database: "postgres"
})
db.connect();
*/

/////////////////////////////CONNECT TO HEROKU SQL DATABASE//////////////////////////

const { Client } = require('pg');
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
db.connect();

///////////////////////////////SERVER IMPLEMENTATION/////////////////////////////////

const server = http.createServer((req, res)=>{////req="HTML request from client", res="our HTML response to edit"
        let result='./'
        res.statusCode=200;
        ////////////////////////////////////// LOGIN /////////////////////////////////////
        if(req.url.match('/user_.+')){
            let email=req.url.substring(6);
            console.log(email)
            result='["Tell me about yourself"'
            db.query("select * from imock.questions where email='"+email+"'",(ERR,RES)=>{
                if(!ERR){
                    user_questions=RES.rows;
                    for(let i=0; i<user_questions.length;i++){
                        result+=(',"'+user_questions[i].question+'"')
                    }
                }
                db.end;

                res.setHeader('Content-Type','text/plain'); ////specify type of reponse
                res.write(result+"]");  ///write HTML response content
                res.end(); ////send the response to client
            })
        }
        ////////////////////////////////////// ADD & REMOVE /////////////////////////////////////
        else if(req.url.match('/add_.+')){
            let email=req.url.substring(5,req.url.indexOf('~'))
            let question=req.url.substring(req.url.indexOf('~')+1).replace(/~/g,' ')

            db.query("insert into imock.questions values ('"+email+"','"+question+"')",(ERR,RES)=>{
                if(ERR)console.log(ERR.detail)
                res.statusCode=201;
                res.end();
            })
        }
        else if(req.url.match('/remove_.+')){
            let email=req.url.substring(8,req.url.indexOf('~'))
            let question=req.url.substring(req.url.indexOf('~')+1).replace(/~/g,' ')
            db.query("delete from imock.questions where email='"+email+"' and question='"+question+"'",(ERR,RES)=>{
                if(ERR)console.log(ERR.detail)
                res.statusCode=201;
                res.end();
            })
        }
        ///////////////////////////////////// STARTING UI ////////////////////////////////
        else{
            console.log(req.url)
            switch(req.url){
                case '/': 
                    result+='index.html';   //skeleton HTML file for front end
                    break;
                case '/style.css':
                    result+='style.css';    //CSS style sheet
                    break;
                case '/app.js':
                    result+='app.js';   //front end client implementation
                    break;
                case '/account_icon.png':
                    result+='art/account_icon.png';     //logo & icon to display
                    break;
                case '/logo.png':
                    result+='art/logo.png';     //logo & icon to display
                    break;
                case '/about_icon.png':
                    result+='art/about_icon.png';     //logo & icon to display
                    break;
                case '/login_logo.png':
                    result+='art/login_logo.png';     //logo & icon to display
                    break;
                case '/delete.png':
                    result+='art/delete.png';     //logo & icon to display
                    break;
                default:
                    console.log("--> default")
                    res.setHeader('Location','/');  //redirect to home page for invalid directory
                    result+='index.html';
                    res.statusCode=301;
                    break;
            }
            fs.readFile(result,(err,data)=>{
                if(err)console.log("error found! ",result,err);
                else res.write(data);
                res.end();
            });
        }
});

//server.listen(3000,'localhost',()=>{ //----->to test locally
server.listen(process.env.PORT || 3000,()=>{
    console.log('listening for request on port 3000');
});
