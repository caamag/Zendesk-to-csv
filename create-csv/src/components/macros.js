
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init();

function Macros({ backToInitial, dateFormat }) {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [macros, setMacros] = useState([])
    const [groups, setGroups] = useState([])
    const [fields, setFields] = useState([])

    //get macros
    useEffect(() => {
        async function getAllMacros() {

            setLoading(true)

            let allMacros = [];
            let page = 1;
            let totalPages = 5;

            while (page <= totalPages) {
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
            }

            setMacros(allMacros)
            setLoading(false)
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
        }).then((response) => {
            setFields(response.ticket_fields)
        })
    })


    const data = macros.map(item => {
        //ajustando restrições de grupos
        let restrictionGroups = ''
        if (item.restriction && item.restriction.type === 'Group') {

            const restrictedGroupIds = item.restriction.ids;
            const restrictedGroupNames = restrictedGroupIds.map(groupId => {
                const group = groups.find(group => group.id === groupId);
                return group ? group.name : `Grupo não encontrado`;
            });

            restrictionGroups = restrictedGroupNames.join(', ')
        } else {
            restrictionGroups = 'Não há restrições'
        }

        const actions = item.actions.map(action => {

            //ajustando conteúdo
            let fieldContent = ''
            let valueWithoutTags = action.value

            if (valueWithoutTags === "solved") {
                valueWithoutTags = "Resolvido"
            } else if (valueWithoutTags === "true") {
                valueWithoutTags = "Sim"
            } else if (valueWithoutTags === "current_groups") {
                valueWithoutTags = "Grupo atual"
            } else if (valueWithoutTags === "current_user") {
                valueWithoutTags = "Usuário atual"
            } else if (valueWithoutTags === "low") {
                valueWithoutTags = "Baixa"
            } else {
                valueWithoutTags = action.value;
            }

            if (action.field === "comment_value_html") {
                fieldContent = "Comentário/Descrição"
                valueWithoutTags = action.value.replace(/<[^>]+>/g, '')
            } else if (action.field === "comment_value") {
                fieldContent = "Comentário"
                valueWithoutTags = action.value.replace(/<[^>]+>/g, '')
            } else if (action.field === "subject") {
                fieldContent = "Assunto"
            } else if (action.field === "brand_id") {
                fieldContent = "Marca"
            } else if (action.field === "group_id") {
                fieldContent = "Grupo"
                valueWithoutTags = `Id do grupo(${action.value})`;

            } else if (action.field === "assignee_id") {
                fieldContent = "Atribuído"
            } else if (action.field === "priority") {
                fieldContent = "Prioridade"
            } else if (action.field === 'comment_mode_is_public') {
                fieldContent = "Comentário público"
            } else if (action.field.startsWith("custom_fields_")) {
                const fieldsID = action.field.replace("custom_fields_", "")
                const customField = fields.find(field => field.id === parseInt(fieldsID))
                if (customField) {
                    fieldContent = customField.title
                } else {
                    fieldContent = fieldsID;
                }
            } else {
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

    //criando arquivo
    function handleSubmit(e) {
        e.preventDefault();

        //configurando exportação
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, exportType, fileName: name });

        window.location.reload()
    }

    return <div className="content">

        <form className="form" onSubmit={handleSubmit}>

            <button className="back" onClick={(e) => {
                e.preventDefault()
                backToInitial()
            }}>— voltar</button>

            <label>
                Nome do arquivo:<br />
                <input type="text"
                    placeholder="Insira o nome do arquivo:"
                    onChange={(e) => { setName(e.target.value) }}
                    value={name}
                    required />
            </label><br />

            {!loading && <>
                <button className="btn btn-macro">Gerar Planilha</button>
            </>}

            {loading && <p className="loading">carregando...</p>}

        </form>

    </div>

}

export default Macros; 