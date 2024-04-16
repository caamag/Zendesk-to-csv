import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init();

function Agents({ backToInitial }) {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            const agents = await getUsers();
            setUsers(agents);

            const groups = await getGroups();
            setGroups(groups)

            const members = await getMembers(groups);
            setMembers(members)

            setLoading(false);
        }
        fetchData()
    }, [])

    async function getUsers() {

        let allUsers = [];
        let currentPage = 1;
        let totalUsers = 0;

        do {
            const response = await client.request({
                url: '/api/v2/users?role[]=admin&role[]=agent',
                dataType: 'json',
                type: 'GET',
                data: {
                    page: currentPage,
                    per_page: 100,
                }
            })
            allUsers = [...allUsers, ...response.users];
            totalUsers = response.count;
            currentPage++;
        } while (allUsers.length < totalUsers)
        return allUsers;
    }

    async function getGroups() {
        let allGroups = [];
        let currentPage = 1;
        let totalGroups = 0;

        do {
            const response = await client.request({
                url: '/api/v2/groups',
                dataType: 'json',
                type: 'GET',
                data: {
                    page: currentPage,
                    per_page: 100,
                }
            })
            allGroups = [...allGroups, ...response.groups];
            totalGroups = response.count;
            currentPage++;
        } while (allGroups.length < totalGroups)
        return allGroups;
    }

    async function getMembers(groups) {
        let allMembers = [];

        for (const group of groups) {
            let currentPage = 1;
            let totalMembers = 0;

            do {
                const response = await client.request({
                    url: `/api/v2/groups/${group.id}/memberships`,
                    dataType: 'json',
                    type: 'GET',
                    data: {
                        page: currentPage,
                        per_page: 100,
                    }
                });
                allMembers = [...allMembers, ...response.group_memberships]
                totalMembers = response.count;
                currentPage++;
            } while (allMembers.length < totalMembers)
        }
        return allMembers;
    }

    const data = users.map(user => {
        const tags = user.tags.map(tag => {
            const userTag = tag ? tag : 'Usuário não possui nenhuma tag'
            return userTag;
        })

        const userGroups = members.filter(member => member.user_id === user.id)

        return {
            'ID': user.id,
            'Nome': user.name,
            'Função do agente': user.role,
            'Tags': tags,
            'Grupos': userGroups
        }
    })

    function handleSubmit(e) {
        e.preventDefault();
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, exportType, fileName: name });

        backToInitial()
    }

    return <div className="content">

        {!loading && <>

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

                <button className="btn btn-macro">Gerar Planilha</button>
            </form>

        </>}

        {loading && <p className="loading">carregando...</p>}

    </div>

};

export default Agents;