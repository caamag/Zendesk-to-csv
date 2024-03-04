async function getGroups() {

    const response = await fetch('/api/v2/groups/10007453816333')
    const data = await response.json()

    console.log(data);

}

getGroups()

async function getMacros() {

    const response = await fetch('/api/v2/macros/10007453816333')
    const data = await response.json()

    console.log(data);

}

getMacros()

