
import { useState, useEffect } from "react";
import exportFromJSON from 'export-from-json';
import ZAFClient from 'zendesk_app_framework_sdk';
const client = ZAFClient.init();

function Organizations({ backToInitial }) {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [organization, setOrganization] = useState([]);
    const [members, setMembers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fethData() {
            setLoading(true);

            const organizations = await getOrganizations();
            setOrganization(organizations);

            const members = await getMembers(organizations);
            setMembers(members);

            const users = await getUsers();
            setUsers(users);

            const fileNameFibra = 'Org Banco Fibra';
            const handle = await handleSubmit(fileNameFibra);
            handle();

            setLoading(false);
        }
        fethData();
    }, []);

    async function getOrganizations() {
        let allOrgs = [];
        let currentPage = 1;
        let totalOrgs = 0;

        do {
            const response = await client.request({
                url: '/api/v2/organizations',
                dataType: 'json',
                type: 'GET',
                cors: true,
                data: {
                    page: currentPage,
                    per_page: 100,
                }
            });

            allOrgs = [...allOrgs, ...response.organizations];
            totalOrgs = response.count;
            currentPage++;
        } while (allOrgs.length < totalOrgs);
        return allOrgs;
    }

    async function getMembers(organization) {
        let allMembers = [];

        for (const org of organization) {
            let currentPage = 1;
            let totalMembers = 0;

            do {
                const response = await client.request({
                    url: `/api/v2/organizations/${org.id}/organization_memberships.json`,
                    dataType: 'json',
                    type: 'GET',
                    cors: true,
                    data: {
                        page: currentPage,
                        per_page: 100,
                    }
                });
                totalMembers = response.count;
                allMembers = [...allMembers, ...response.organization_memberships];
                currentPage++;
            } while (allMembers.length < totalMembers)
        }
        return allMembers;
    }

    async function getUsers() {
        let allUsers = [];
        let currentPage = 1;
        let totalUsers = 0;

        do {
            const response = await client.request({
                url: '/api/v2/users',
                dataType: 'json',
                type: 'GET',
                cors: true, 
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

    function handleSubmit(name) {
        const data = organization.map(org => {

            const orgMembers = members.filter(member => member.organization_id === org.id);
            const userId = orgMembers.map(member => { return member.user_id });

            const membersCount = orgMembers.length > 0 ? orgMembers.length : 'Nenhum usuário nesta organização';

            const orgUsers = userId.map(id => {
                return users.find(user => user.id === id);
            });

            const nameAndEmail = orgUsers.map(user => `
            ${user.name};
            ${user.email};
            ${user.user_fields[6] ? user.user_fields[6] : 'Campo vazio'};`)
            .join('\n');

            const userContent = nameAndEmail ? nameAndEmail : 'Nenhum usuário presente na organização'

            return {
                "Organização": org.name,
                "Quantidade de membros": membersCount,
                "Dados dos usuários": userContent
            }
        });

        //csv settings
        const fileName = name;
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, fileName, exportType });
        window.location.reload();
    };



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

export default Organizations;