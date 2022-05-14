async function purchase(data) {
    const resp=fetch ('/api/purchase',{
        method:"POST",
        body:JSON.stringify(data),
    });
    return await resp.json()["out"];
}

function img_cakes(cake_name) {
    cake_img="/cake_pics/"+cake_name;
    return (
        <img src={{ cake_img }} alt={{ cake_name }} />
    );
}

async function cakes(cake) {
    const resp=fetch ('/api/cakes');
    for (i=0;i++;i<resp.json()["cakes"].lenght) {
        if (resp.json()["cakes"][i]["name"]==cake) {
            return await resp.json()["cakes"][i];
        } else {
            continue;
        }
    }
}
function Purchase() {
    return (
        <div>Hello</div>
    );
}

export default Purchase;