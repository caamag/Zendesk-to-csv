
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init();

function Forms ({backToInitial}) {

    const [fileName, setFileName] = useState('');
    const [formID, setFormID] = useState('');
    const [loading, setLoading] = useState(false);

    function handleSubmit (e) {
        e.preventDefault();
    }

    return <div className="content">
        <form className="form" onSubmit={handleSubmit}>
            <button className="back" onClick={(e) => {
                e.preventDefault()
                backToInitial()
            }}>— voltar</button>

            <label>
                ID o formulário:<br />
                <input type="text"
                    placeholder="Insira o ID do formulário desejado:"
                    onChange={(e) => { setFormID(e.target.value) }}
                    value={formID}
                    required />
            </label><br />

            <label>
                Nome do arquivo:<br />
                <input type="text"
                    placeholder="Insira o nome do arquivo:"
                    onChange={(e) => { setFileName(e.target.value) }}
                    value={fileName}
                    required />
            </label><br />
            <button type="submit">Gera Planilha</button>
        </form>

        {loading && <p className="loading">carregando...</p>}
    </div>
}

export default Forms;