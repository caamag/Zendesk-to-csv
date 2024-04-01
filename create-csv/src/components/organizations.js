
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json';
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init();

function Organizations({ backToInitial }) {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {
            setLoading(true);
            let allUsers = [];
            let currentPage = 1;
            let totalUsers = 0;

            do {
                const response = await client.request({
                    url: '/api/v2/users',
                    dataType: 'json',
                    type: 'GET',
                    data: {
                        page: currentPage,
                        per_page: 100
                    }
                });

                allUsers = [...allUsers, ...response.users]
                totalUsers = response.count;
                currentPage++;
            } while (allUsers.length < totalUsers);

            setUsers(allUsers);
            setLoading(false);
        }
        getUsers()
    }, []);

    console.log(users);

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
                    onChange={(e) => { setName(e.target.value) }}
                    value={name}
                    required />
            </label><br />

            {!loading && <button className="btn btn-macro">Gerar Planilha</button>}
            {loading && <p className="loading">carregando...</p>}

        </form>

    </div>

};

export default Organizations;