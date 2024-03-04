
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init(); 

function Macros ({backToInitial}) {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [macros, setMacros] = useState([])
    const [groups, setGroups] = useState([])
    const [fields, setFields] = useState([])

    //get macros
    useEffect(() => {
        async function getAllMacros() {
            let allMacros = [];
            let page = 1;
            let totalPages = 5

            while (page <= totalPages) {
                try {
                    const response = await client.request({
                        url: `/api/v2/macros/active?page=${page}`,
                        dataType: 'json',
                        type: 'GET'
                    });

                    const data = response.macros
                    allMacros = allMacros.concat(data)

                    if (data.meta && data.meta.total_pages) {
                        totalPages = data.meta.total_pages;
                    }

                    page++;
                } catch (error) {
                    console.error(error)
                    break;
                }
            }

            setMacros(allMacros)
        }

        getAllMacros();
    }, [])

    useEffect(() => {
        client.request({
            url: '/api/v2/groups',
            dataType: 'json',
            type: 'GET'
        }).then((response) => {
            setGroups(response.groups)
        })
    }, [])

    useEffect(() => {
        client.request({
            url: '/api/v2/ticket_fields',
            dataType: 'json',
            type: 'GET'
        }).then((response) =>{
            setFields(response.ticket_fields)
        })
    })


    const data = macros.map(item => {
        //ajustando restrições de grupos
        let restrictionGroups = ''
        if (item.restriction && item.restriction.type === 'Group') {
            const groupNames = item.restriction.ids.map((id) => {
                const group = groups.find(group => group.id === id)
                return group.name;
            })
            restrictionGroups = groupNames.join(', ')
        }else{
            restrictionGroups = 'Não há restrições'
        }

        const actions = item.actions.map(action => {

            //ajustando conteúdo
            let fieldContent = ''
            let valueWithoutTags = action.value

            if (valueWithoutTags === "solved") {
                valueWithoutTags = "Resolvido"
            }else if (valueWithoutTags === "true") {
                valueWithoutTags = "Sim"
            }else if (valueWithoutTags === "current_groups") {
                valueWithoutTags = "Grupo atual"
            }else if (valueWithoutTags === "current_user") {
                valueWithoutTags = "Usuário atual"
            }

            if (action.field === "comment_value_html") {
                fieldContent = "Comentário/Descrição"
                //removendo tags HTML no comentários
                valueWithoutTags = action.value.replace(/<\/?p>/g, '')
                .replace(/<\/p>/g, '')
                .replace(/<\/?br>/g, '')
                .replace(/<\/i>/g, '')
                .replace(/<\/?i>/g, '')
                .replace(/<\/b>/g, '')
                .replace(/<\/?b>/g, '')
                .replace(/<\/span>/g, '')
                .replace(/<\/?span>/g, '')
            }else if (action.field === "subject"){
                fieldContent = "Assunto"
            }else if (action.field === "brand_id"){
                fieldContent = "Marca"
            }else if (action.field === "group_id"){
                fieldContent = "Grupo"
            }else if (action.field === "assignee_id"){
                fieldContent = "Atribuído"
            }else if (action.field === "priority"){
                fieldContent = "Prioridade"
            }else if (action.field === 'comment_mode_is_publics'){
                fieldContent = "Comentário público"
            }else if (action.field.startsWith("custom_fields_")) {
                const fieldIDs = action.field.replace("custom_fields_", "")
                let fieldName = ''
                
                fields.map((field) => {
                    if (field.id === fieldIDs) {
                        fieldName = field.title;
                    }
                })

                fieldContent = "Campo-" + fieldName; 
            }else{
                fieldContent = action.field; 
            }

            return `${fieldContent}: ${valueWithoutTags}`
        }).join('\n')
        
        return {
            'Id': item.id,
            'Nome da macro': item.title,
            'Data de criação': dateFormat(item.created_at),
            'Data da última atualização': dateFormat(item.updated_at),
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
    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        //configurando exportação
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, exportType, fileName: name });

        setLoading(false);
    }

    return <div className="content">

        <form className="form" onSubmit={handleSubmit}>

            <button className="back" onClick={(e) => {
                e.preventDefault()
                backToInitial()
            }}>— voltar</button>

            <label>
                Nome do arquivo:<br />
                PS: inserir nome dos campos no lugar dos ids <br />
                <input type="text" 
                placeholder="Insira o nome do arquivo:"
                onChange={(e) => {setName(e.target.value)}}
                value={name}
                required/>
            </label><br />

            <button className="btn btn-macro">Gerar Planilha</button>
            {loading && <p className="loading">carregando...</p>}

        </form>

    </div>

}

export default Macros; 