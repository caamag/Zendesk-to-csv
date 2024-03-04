
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init(); 

function Views ({backToInitial}) {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    return <div className="content">

        <form className="form">

        <button className="back" onClick={(e) => {
            e.preventDefault()
            backToInitial()
        }}>— voltar</button>

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

export default Views