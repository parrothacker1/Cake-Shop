async function cakes() {
    const resp=await fetch('/api/cakes');
    return await resp.json();
}

function img_cakes(cake_name) {
    cake_img="/cake_pics/"+cake_name;
    return (
        <img src={{ cake_img }} alt={{ cake_name }} />
    );
}

function Cakes() {
    return (
        <div>Hello</div>
    );
}

export default Cakes;