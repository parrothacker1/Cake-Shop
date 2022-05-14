async function login({user:password}) {
    const resp=await fetch('/api/login',{
        method:'POST',
        headers:{
            "Content-Type":"application/json",
            "Authentication":"Basic "+JSON.stringify({user:password}),
        },
    });
    return await resp.json()["out"];
}

function img_cakes(cake_name) {
    cake_img="/cake_pics/"+cake_name;
    return (
        <img src={{ cake_img }} alt={{ cake_name }} />
    );
}

function Admin() {
    return (
        <div>Hello</div>
    );
}

export default Admin;