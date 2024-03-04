async function getGroups () {

    const response = await fetch('/api/v2/ticket_fields')
    const data = await response.json()
    const fields = data.ticket_fields
    
    console.log(fields);
    
}

getGroups()
