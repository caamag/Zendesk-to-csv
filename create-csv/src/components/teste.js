async function getMacros () {

    const response = await fetch('/api/v2/macros/active')
    const data = await response.json()
    const macros = data.macros

    console.log(macros);
}

getMacros()