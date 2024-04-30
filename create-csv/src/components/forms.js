
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init(); 

function Forms ({backToInitial}) {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [formId, setFormId] = useState();

    useEffect(() => {
        setLoading(true);
        getForm(formId);
        setLoading(false)
    }, []);

    async function getForm (formId) {
        client.request({
            url: `/api/v2/ticket_forms/${formId}`,
            dataType: 'json',
            type: 'GET',
            cors: true,
        }).then(response => {
            console.log(response.ticket_form);
        })
    };


    return <div className="content">

        <form className="form">

            <button className="back" onClick={(e) => {
                e.preventDefault()
                backToInitial()
            }}>— voltar</button>

            <label>
                Id do formulário que será feito o mapeamento:<br />
                <input type="number" 
                placeholder="Insira o ID do formulário:"
                onChange={(e) => {setFormId(e.target.value)}}
                value={formId}
                required/>
            </label><br />

            <label>
                Nome do arquivo:<br />
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

}; 

export default Forms;