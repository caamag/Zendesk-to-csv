
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json'
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init();

function Groups({ backToInitial }) {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        async function fethData() {
            setLoading(true);

            const groups = await getGroups();
            setGroups(groups);
            console.log(groups);

            const members = await getMembers(groups);
            setMembers(members);
            console.log(members);

            setLoading(false);
        }
        fethData();
    }, []);

    async function getUsers() {
        let allUsers = [];
        let currentPage = 1;
        let totalUsers = 0;

        do {
            const response = await client.request({
                url: '/api/v2/users',
                dataType: 'json',
                type: 'GET',
                coors: true, 
                data: {
                    page: currentPage,
                    per_page: 100,
                }
            })

            const agentUsers = response.users.filter(user => user.role !== 'end-user');

            allUsers = [...allUsers, ...agentUsers];
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
                cors: true,
                data: {
                    page: currentPage,
                    per_page: 100,
                }
            });

            allGroups = [...allGroups, ...response.groups];
            totalGroups = response.count;
            currentPage++;
        } while (allGroups.length < totalGroups);
        return allGroups;
    }

    async function getMembers(currentGroup) {

        let allMembers = [];

        for (const group of currentGroup) {
            let currentPage = 1;
            let totalMembers = 0;

            do {

                const response = await client.request({
                    url: `/api/v2/groups/${group.id}/memberships`,
                    dataType: 'json',
                    type: 'GET',
                    cors: true,
                    data: {
                        page: currentPage,
                        per_page: 100,
                    }
                });
                totalMembers = response.count;
                allMembers = [...allMembers, ...response.group_memberships];
                currentPage++;
            } while (allMembers.length < totalMembers)
        }
        return allMembers;
    }

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

export default Groups;