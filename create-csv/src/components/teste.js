
async function getArticles() {
    const res = await fetch(`/api/v2/groups/6603378113677/memberships`)
    const data = await res.json()
    console.log(data);
}

getArticles()

//6603378113677