
async function getArticles() {
    const res = await fetch('/api/v2/users')
    const data = await res.json()
    console.log(data);
}

getArticles()


async function getOrganization() {
    const res = await fetch('/api/v2/organization_memberships')
    const data = await res.json()
    console.log(data);
}

getOrganization();