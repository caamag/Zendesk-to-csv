
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init();

function Articles({ backToInitial, dateFormat }) {

    const [fileName, setFileName] = useState('')
    const [loading, setLoading] = useState(false)

    const [articles, setArticles] = useState([]);
    const [groups, setGroups] = useState([]);

    //getArticles
    useEffect(() => {
        setLoading(true)
        client.request({
            url: '/api/v2/help_center/articles',
            dataType: 'json',
            type: 'GET',
            cors: true, 
        }).then(response => {
            setArticles(response.articles);
            setLoading(false)
        })
    }, []);

    //get groups
    useEffect(() => {
        setLoading(true)
        client.request({
            url: "/api/v2/groups",
            dataType: "json",
            type: "GET",
            cors: true, 
        }).then(response => {
            setGroups(response.groups)
            setLoading(false)
        })
    }, [])

    const data = articles.map(article => {

        function removeHTMLTags(html) {
            return html.replace(/<[^>]+>/g, '')
        }

        return {
            "ID do artigo": article.id,
            "Título do artigo": article.name,
            "Data de criação": dateFormat(article.created_at),
            "Data da última atualização": dateFormat(article.updated_at),
            "Link da página do artigo": article.html_url,
            "Conteúdo do artigo": removeHTMLTags(article.body)
        }
    })

    function handleSubmit(e) {

        e.preventDefault();

        //configurando exportação
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, exportType, fileName });

        window.location.reload();

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
                    onChange={(e) => { setFileName(e.target.value) }}
                    value={fileName}
                    required />
            </label><br />

            {!loading && <button className="btn btn-macro">Gerar Planilha</button>}
            {loading && <p className="loading">carregando...</p>}

        </form>

    </div>

};

export default Articles