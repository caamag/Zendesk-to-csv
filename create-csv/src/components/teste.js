
async function getForm () {
    const res = await fetch('/api/v2/ticket_forms/5396236093069');
    const data = await res.json();
    console.log(data);
}
getForm()

