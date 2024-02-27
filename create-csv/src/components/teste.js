async function getGroupName () {

    const response = await fetch('/api/v2/groups')
    const data = await response.json()
    const groups = data.groups

}

getGroupName()