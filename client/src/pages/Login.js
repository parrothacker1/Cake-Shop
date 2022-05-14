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

function Login() {
    return (
        <div>Hello</div>
    );
}

export default Login;