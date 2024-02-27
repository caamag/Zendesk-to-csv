
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init(); 

function Macros () {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [macros, setMacros] = useState([])

    //get macros
    useEffect(() => {
         client.request({
             url: '/api/v2/macros/active',
             dataType: 'json',
             type: 'GET'
        })
        .then((response) => {
            setMacros(response.macros)
        })
    }, [])


    const data = macros.map(item => {
        //ajustando restrições de grupos e usuários
        let restrictionUser = ''
        let idUser = ''
        if (item.restriction && item.restriction.type === "User") {
            restrictionUser = item.restriction.id
            idUser = 'Id do usuário - '
        }else{
            restrictionUser = 'Não há restrições de usuário'
            idUser = ''
        }
        let restrictionGroups = ''
        if (item.restriction && item.restriction.type === 'Group') {
            restrictionGroups = item.restriction.ids
        }else{
            restrictionGroups = 'Não há restrições'
        }

        const actions = item.actions.map(action => {

            let fieldContent = ''
            if (action.field === "comment_value_html") {
                fieldContent = 'Comentário/Descrição'
            }else{
                fieldContent = action.field 
            }

            const valueWithoutTags = action.value.replace(/<\/?p>/g, '')
            .replace(/<\/p>/g, '')
            .replace(/<\/?br>/g, '')

            return `${fieldContent}: ${valueWithoutTags}`
        }).join('\n')
        
        return {
            'Id': item.id,
            'Nome da macro': item.title,
            'Data de criação': dateFormat(item.created_at),
            'Data da última atualização': dateFormat(item.updated_at),
            'Restrição de usuário': `${idUser}${restrictionUser}`,
            'Restrição por grupo': `${restrictionGroups}`,
            'Ações': actions,
        };
    });

    function dateFormat (data) {
        const date = new Date(data)
        const day = String(date.getFullYear()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = String(date.getFullYear())
        return `${day}/${month}/${year}`
    }

    //criando arquivo
    function handleSubmit (e) {
        e.preventDefault()
        setLoading(true)

        //configurando exportação
        const exportType = exportFromJSON.types.csv
        exportFromJSON({ macros, data, exportType, fileName: name }) 

        setLoading(false)
    }

    return <div className="content">

        <form className="form" onSubmit={handleSubmit}>

            <label>
                Nome do arquivo:<br />
                <input type="text" placeholder="Insira o nome do arquivo:"
                onChange={(e) => {setName(e.target.value)}}
                value={name}/>
            </label><br />

            <button className="btn btn-macro">Gerar Planilha</button>
            {loading && <p className="loading">carregando...</p>}

        </form>

    </div>

}

export default Macros; 

//filtrar título, ação, grupo e atualizado nos últimos sete dias