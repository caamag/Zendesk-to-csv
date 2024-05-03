
async function getForm () {
    const res = await fetch('/api/v2/ticket_forms/1900000679725');
    const data = await res.json();
    console.log(data.ticket_form);
}
getForm()

// getArticles()

