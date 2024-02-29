async function getGroups () {

    const response = await fetch('/api/v2/macros')
    const data = await response.json()
    const macros = data.macros
    console.log(macros);
    
}

getGroups()