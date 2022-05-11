const http=require('http');
const { Pool }=require('pg');
const fs=require('fs');

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
            auth[1]=auth[1].split("\n")[0];
            if (auth[0]=="user" && auth[1]=="password") {
                try {
                    if (Object.keys(data) == ["name","price","stock"]) {
                        let all_cakes=await pool.query("SELECT * FROM cake WHERE name=$1",[data.name]);
                        if (!all_cakes.rows) {
                            query="INSERT INTO cake VALUES($1,$2,'{1:0}',$3);";
                            let q_data=await pool.query(query,[data.name,data.price,data.stock]);
                            out={"result":true};
                        } else {
                            status=304;
                            out={"result":"already_exists"};
                        }
                    } else {
                        status=400;
                        out={"result":"wrong_data_given"};
                    }
                } catch(err) {
                    status=500;
                    out={"result":"server_error"};
                }
            } else {
                status=401;
                out={"result":"auth_error"};
            }
            res.writeHead(status,{"Content-Type":"application/json"});
            res.write(JSON.stringify(out));
            
        } else if (req.method=="PUT") {
            status=200;
            body=[];
            data={};
            req.on('data',(chunk) => {
                body.push(chunk);
            }).on('end',() => {
                data=JSON.parse(Buffer.concat(body).toString());
            });
            auth=req.headers.authorization.split(" ").pop().split(":");
            auth[1]=auth[1].split("\n")[0];
            if (auth[0]=="user" && auth[1]=="password") {
                try {
                    if (Object.keys(data) == ["name","price","stock"]) {
                        let all_cakes=await pool.query("SELECT * FROM cake WHERE name=$1",[data.name]);
                        if (!all_cakes.rows) {
                            status=304;
                            out={"result":"cake_not_exists"};
                        } else {
                            query="UPDATE cake SET price=$2,stock=$3 WHERE name=$1";
                            let q_data=await pool.query(query,[data.name,data.price,data.stock]);
                            out={"result":true};
                        }
                    } else {
                        status=400;
                        out={"result":"wrong_data_given"};
                    }
                } catch(err) {
                    status=500;
                    out={"result":"server_error"};
                }
            } else {
                status=401;
                out={"result":"auth_error"};
            }
            res.writeHead(status,{"Content-Type":"application/json"});
            res.write(JSON.stringify(out));
            
        } else if (req.method=="GET") {
            status=200;
            response=null;
            try {
                let out=await pool.query("SELECT * FROM cakes");
                response={"cakes":out.rows[0]};
            } catch (err) {
                status=500;
                response={"result":"server_error"};
            }
            res.writeHead(status,{'Content-Type':'application/json'});
            res.write(JSON.stringify(response));

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
                status=200;
                try {
                    if (Object.keys(data) == ["name"]) {
                        let all_cakes=await pool.query("SELECT * FROM cake WHERE name=$1",[data.name]);
                        if (!all_cakes.rows) {
                            status=304;
                            out={"result":"cake_not_exists"};
                        } else {
                            query="DELETE FROM cake WHERE name=$1";
                            let q_data=await pool.query(query,[data.name]);
                            out={"result":true};
                        }
                    } else {
                        status=400;
                        out={"result":"wrong_data_given"};
                    }
                } catch(err) {
                    status=500;
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
        auth=Buffer.from(req.headers.authorization.split(" ")[1],'base64').toString().split(":");
        auth[1]=auth[1].split("\n")[0];
        if (auth[0]=="user" && auth[1]=="password") {
            status=201;
            try {
                let q_data=await pool.query("SELECT name,stock FROM cakes");
                console.log(q_data);
                if (Object.keys(data) != ["name","quantity","rate"]) {
                    out={"result":"wrong_data_given"}
                } else {
                    let all_cakes=await pool.query("SELECT * FROM cake WHERE name=$1",[data.name]);
                    if (!all_cakes.rows) {
                        status=304;
                        out={"result":"cake_not_exists"};
                    } else {
                        stock=all_cakes.rows[0].stock-quantity;
                        all_cakes.rows[0].rate.entries()[data.rate-1]=all_cakes.rows[0].rate.entries()[data.rate]+1
                        let q_data=await pool.query("UPDATE cake SET stock=$2,rate=$3 WHERE name=$1",[data.name,stock,all_cakes.rows[0].rate]);
                        out={"result":true}
                    }
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
        file=req.url.split("/")[3];
        if (fs.existsSync("../client/src/images/cakes/"+file)) {
            res.writeHead(200,{"Content-Type":"image/jpeg"});
            res.write(fs.readFileSync("../client/src/images/cakes/"+file),'binary');
        } else {
            res.writeHead(200,{"Content-Type":"application/json"});
            res.write(JSON.stringify({"result":"do_not_exists"}));
        }
    }
    res.end();
});
console.log("Backend Server Started");
server.listen('8080');
