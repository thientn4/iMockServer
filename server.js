
///////////////////////// MODULE & REQUIRE /////////////////////////////
/*


    const {name, ages}=require('./people');
    --> import 'name' and 'age' from 'people' in same directory
    --> 'people' must export the 2 imported items:
                    module.exports={
                        people: myPeople,
                        age: myAge
                    };


*/
//////////////////////////// FILE HANDLING /////////////////////////////
/*



    const fs=require('fs');     //fs = 'file system'


    //-------------------read-----------------------//
                    fs.readfile(
                        'directory/myFile.txt',
                        (err,data) => {
                            if(err)console.log(err);
                            console.log(data);
                        }
                    )
    //-------------------write---------------------//
                    fs.writeFile(
                        'directory/myFile.txt',
                        'hello friend',
                        () => {
                            console.log('file was written');
                        }
                    )
    //-----------create directory/folder----------//
                    fs.mkdir(
                        './myFolder',
                        (err)=>{
                            if(err)console.log(err);
                            console.log('folder created');
                        }
                    )
    //---------------deleting files--------------//
                    fs.unlink(
                        './myFile.txt',
                        (err)=>{
                            if(err)console.log(err);
                            console.log('folder created');
                        }
                    )
                   



*/



const http=require('http');
const fs=require('fs');
const {Client}=require('pg');
const db=new Client({
    host:"localhost",
    user:"postgres",
    port: 5432,
    password: "723155",
    database: "postgres"
})

db.connect();

const server = http.createServer((req, res)=>{
        let result='./'
        res.statusCode=200;

        ////////////////////////////////////// LOGIN /////////////////////////////////////
        if(req.url.match('/user_.+')){
            let email=req.url.substring(6);
            result='["Tell me about yourself"'
            db.query("select * from imock.questions where email='"+email+"'",(ERR,RES)=>{
                if(!ERR){
                    user_questions=RES.rows;
                    for(let i=0; i<user_questions.length;i++){
                        result+=(',"'+user_questions[i].question+'"')
                    }
                }
                db.end;

                res.setHeader('Content-Type','text/plain');
                res.write(result+"]");
                res.end();
            })
            
        }
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
            switch(req.url){
                case '/': 
                    result+='index.html';
                    break;
                case '/style.css':
                    result+='style.css';
                    break;
                case '/app.js':
                    result+='app.js';
                    break;
                case '/account_icon.png':
                    result+='account_icon.png';
                    break;
                case '/logo.png':
                    result+='logo.png';
                    break;
                case '/about_icon.png':
                    result+='about_icon.png';
                    break;
                case '/login_cancel.png':
                    result+='login_cancel.png';
                    break;
                case '/login_logo.png':
                    result+='login_logo.png';
                    break;
                case '/login.png':
                    result+='login.png';
                    break;
                case '/delete.png':
                    result+='delete.png';
                    break;
                default:
                    res.setHeader('Location','/');
                    result+='index.html';
                    res.statusCode=301;
                    break;
            }
            fs.readFile(result,(err,data)=>{
                if(err)console.log(err);
                else res.write(data);
                res.end();
            });
        }
});

server.listen(3000,'localhost',()=>{
    console.log('listening for request on port 3000');
});

