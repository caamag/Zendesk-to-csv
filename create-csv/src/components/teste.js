
async function getArticles() {
    const res = await fetch('/api/v2/users')
    const data = await res.json()
    console.log(data);
}

getArticles()


async function getOrganization() {
    const res = await fetch('/api/v2/organizations/6018763383437/organization_memberships.json')
    const data = await res.json()
    console.log(data);
}

getOrganization();