
// async function getArticles() {
//     const res = await fetch(`/api/v2/users?role[]=admin&role[]=agent`)
//     const data = await res.json()
//     const users = data.users;

//     users.map(user => {
//         if (user.role_type === 0) {
//             console.log(user);
//         }else {
//             console.log('Nenhum usuário localizado.');
//         }
//     })
// }

// getArticles()

//custom role id 360008815632 agent light
//custom role id 1030151 agente líder
//role type 3 = colaborador
//role type 4 = admin
//se não, função personalizada