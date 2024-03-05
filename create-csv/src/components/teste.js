
async function getGroups() {

    const response = await fetch('/api/v2/macros/active')
    const data = await response.json()
    const macros = data.macros;

    const res = await fetch('/api/v2/ticket_fields')
    const dat = await res.json()
    let fields = []
    fields.push(...dat.ticket_fields)

    macros.map((item) => {

        const actions = item.actions.map((action) => {

            if (action.field.startsWith('custom_fields_')) {
                const fieldsIDS = action.field.replace("custom_fields_", "")
                fields.map((field) => {
                    if (field.id === parseInt(fieldsIDS)) {
                        console.log(`${fieldsIDS} nome do campos: ${field.title}`);
                    }
                })
            }
        })
    })

}

getGroups()

