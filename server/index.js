const http=require('http');
const { Pool }=require('pg');

require('dotenv').config();

const pool = new Pool();
pool.connect();

pool.query("CREATE TABLE IF NOT EXISTS cake(name VARCHAR,price INTEGER,rate JSONB,stock INTEGER);");

const server=http.createServer(async function (req,res) {
    if (req.method=="GET") {
        console.log("\x1b[33m"+res.statusCode+" "+req.method+" "+req.url);
    } else if (req.method=="POST") {
        console.log("\x1b[32m"+res.statusCode+" "+req.method+" "+req.url);
    } else if (req.method=="DELETE") {
        console.log("\x1b[31m"+res.statusCode+" "+req.method+" "+req.url);
    } else {
        console.log("\x1b[35m"+res.statusCode+" "+req.method+" "+req.url);
    }

    if (req.url=="/api/cakes") {

        if (req.method=="POST") {
            status=200;
            body=[];
            data={};
            req.on('data',(chunk) => {
                body.push(chunk);
            }).on('end',() => {
                data=JSON.parse(Buffer.concat(body).toString());
            });
            auth=req.headers.authorization.split(" ").pop().split(":");
            out={"result":true};
            if (out["result"] && auth[0]=="user" && auth[1]=="password") {
                status=201;
            } else  if (auth[0]!="user" || auth[1] !="password"){
                status=401;
            } else {
                status=500;
            }
            res.writeHead(status,{"Content-Type":"application/json"});
            res.write(JSON.stringify(out));

        } else if (req.method=="GET") {
            status=200;
            response=null;
            try {
                let out=await pool.query("SELECT * FROM cakes");
                response=out.rows[0];
            } catch (err) {
                status=500;
                response=[];
            }
            res.writeHead(status,{'Content-Type':'application/json'});
            res.write(JSON.stringify({'cakes':response}));

        } else if (req.method=="DELETE") {
            status=410;
            req.on('data',(chunk) => {
                body.push(chunk);
            }).on('end',() => {
                data=JSON.parse(Buffer.concat(body).toString());
            });
            auth=Buffer.from(req.headers.authorization.split(" ")[1],'base64').toString().split(":")
            auth[1]=auth[1].split("\n")[0];
            if (auth[0]=="user" && auth[1]=="password") {
                try {

                } catch(err) {
                    out={"result":"server_error"};
                }
            } else {
                status=401;
                out={"result":"auth_error"};
            }
            res.writeHead(status,{'Content-Type':'application/json'});
            res.write(JSON.stringify(out));
        }

    } else if (req.url=="/api/login" && req.method=="POST") {
        status=200;
        auth=Buffer.from(req.headers.authorization.split(" ")[1],'base64').toString().split(":");
        auth[1]=auth[1].split("\n")[0];
        if (auth[0]=="user" && auth[1]=="password") {
            out={"result":true};
        } else {
            out={"result":"auth_error"};
        }
        if (out["result"]) {
            status=200;
        } else {
            status=401;
        }
        res.writeHead(status,{"Content-Type":"application/json"});
        res.write(JSON.stringify(out));

    } else if (req.url=="/api/purchase" && req.method=="POST") {
        status=201;
        data={};
        body=[];
        req.on('data',(chunk) => {
            body.push(chunk);
        }).on('end',() => {
            data=JSON.parse(Buffer.concat(body).toString());
        });
        auth=Buffer.from(req.headers.authorization.split(" ")[1],'base64').toString().split(":");,
        auth[1]=auth[1].split("\n")[0];
        if (auth[0]=="user" && auth[1]=="password") {
            status=201;
            try {
                let q_data=await pool.query("SELECT name,stock FROM cakes");
                console.log(q_data);
                if (Object.keys(data) != ["name","number"]) {
                    out={"result":"wrong_data_given"}
                } else {
                    out={"result":true}
                }
                out={"result":true};
            } catch (err) {
                status=500;
                out={"result":"server_error"};
            }
        } else {
            status=401;
            out={"result":"auth_error"};
        }
        res.writeHead(status,{"Content-Type":"application/json"});
        res.write(JSON.stringify(out));

    } else if (req.url.includes("/cake_pics")) {

    }
    res.end();
});
console.log("Backend Server Started");
server.listen('8080');
