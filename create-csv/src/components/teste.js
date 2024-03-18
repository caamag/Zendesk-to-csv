
async function getArticles() {

    const res = await fetch('/api/v2/groups')
    const data = await res.json()
    console.log(data);

}

getArticles()