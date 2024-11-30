const dashBtn = document.querySelector('#dashBtn')
const relatorioBtn = document.querySelector('#relatorioBtn')
const rncBtn = document.querySelector('#rncBtn')
const dashDetalhadoBtn = document.querySelector('#dashDetalhadoBtn')
const monitoramentoBtn = document.querySelector('#monitoramentoBtn')
const departamentoBtn = document.querySelector('#departamentoBtn')
const usuariosBtn = document.querySelector('#usuariosBtn')
const cxEntradaBtn = document.querySelector('#cxEntradaBtn')
const meuPerfilBtn = document.querySelector('#meuPerfilBtn')
const departmentSelect = document.getElementById('userDepartment');
const btnMenu = document.querySelector('#btnMenu')
const selectPermissao = document.querySelector('#selectPermissao')
const modalAceitar = document.querySelector('#modalAceitar')
const formAceitar = document.querySelector('#formAceitar')
const selectDepartamentoAceitar = document.querySelector('#selectDepartamentoAceitar')
const inputCargo = document.querySelector('#inputCargo')
const selectPermissaoAceitar = document.querySelector('#selectPermissaoAceitar')
const btnFecharModalAceitar = document.querySelector('#btnFecharModalAceitar')
const inputGerente = document.querySelector('#inputGerente')

let departamentos 
let profiles 

btnMenu.addEventListener('click',()=>{
    document.querySelector('main').style = "display:none;"
    document.querySelector('aside').classList.add('openMenu')
})

const btnCloneMenu = document.querySelector('#btnCloneMenu')
btnCloneMenu.addEventListener('click',()=>{
    document.querySelector('aside').classList.remove('openMenu')
    document.querySelector('main').style = 'display: block;'
})

botaoPerfil.addEventListener('click', function(event) {
    event.stopPropagation();
    menuPerfil.classList.toggle('ativo');
});


btnFecharModalAceitar.addEventListener('click',()=>{
    modalAceitar.style = 'display:none;'
})

document.addEventListener('click', function(event) {
    if (!menuPerfil.contains(event.target) && !botaoPerfil.contains(event.target)) {
        menuPerfil.classList.remove('ativo');
    }
});



let lengthRnc = localStorage.getItem('lengthRnc')
if(lengthRnc != null)
    lengthRnc = JSON.parse(lengthRnc)

function showName (nomeCompleto){
    while (nomeCompleto.length > 13) {
        const partes = nomeCompleto.trim().split(" ")
        if (partes.length > 1) {
            partes.pop()
            nomeCompleto = partes.join(" ")
            if(partes[partes.length-1].length <= 2){
                partes.pop()
                nomeCompleto = partes.join(" ")
            }
        } else {
          nomeCompleto = nomeCompleto.substring(0, 13)
          break
        }
      }
      return nomeCompleto
}

// pegando usuario
let user = localStorage.getItem('login')
if(user != null)
    user = JSON.parse(user)

if(user == null)
    window.location.href = 'index.html';

const nome = document.querySelector('#nome')
nome.innerText = user.nome?showName(user.nome):'xxxx'
const iconPesoa = document.querySelector('#iconPesoa')
const imgPerfil = document.querySelector(".imgPerfil")

if(user.perfil){
    iconPesoa.style = 'display:none;'
    imgPerfil.style = 'display:block;'
    imgPerfil.src = user.perfil.path
}

if(user.permissao == 'User'){
    dashBtn.style = 'display:none;'
    dashBtn.disabled = true

    relatorioBtn.style = 'display:none;'
    relatorioBtn.disabled = true
    
    dashDetalhadoBtn.style = 'display:none;'
    dashDetalhadoBtn.disabled = true

    departamentoBtn.style = 'display:none;'
    departamentoBtn.disabled = true

    usuariosBtn.style = 'display:none;'
    usuariosBtn.disabled = true
}else if(user.permissao == 'Gerente' || user.permissao == 'Controlador'){
    departamentoBtn.style = 'display:none;'
    departamentoBtn.disabled = true

    usuariosBtn.style = 'display:none;'
    usuariosBtn.disabled = true
}

async function handleGetMyCarLetter (){
    try {
        const novaMenssagemJson = await fetch(`http://localhost:3333/menssagem/msgNova/${user._id}`)
        const novaMenssagem = await novaMenssagemJson.json()
        notificacaoNovaMsg(novaMenssagem)
    } catch (error) {
        console.log(error)
    } finally {
        // setInterval(handleGetMyCarLetter,30000)
    }
}

// função que deixa a cor da carta laranja caso tenha alguam msg não vista
function notificacaoNovaMsg (novaMsg){
    if(novaMsg){
        cxEntradaBtn.classList.add('novaMenssagem')
    }else{
        cxEntradaBtn.classList.remove('novaMenssagem')
    }
}

// pegando funcionarios
let funcionarios = localStorage.getItem('funcionarios')
if(funcionarios != null)
    funcionarios = JSON.parse(funcionarios)

async function handleGetUsuarios (){
    try {
        const usuariosJson = await fetch('http://localhost:3333/usuarios')
        const usuarios = await usuariosJson.json()
        profiles = usuarios
        return usuarios
    } catch (error) {
        console.log(error)
    }

}

async function handleAceitarUsuario (body){
    try {
        const reponseJson = await fetch('http://localhost:3333/solicitacaoUsuario/aceitar',{
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })

        let response = await reponseJson.json()

        if(reponseJson.status == 201){
            alert(response.message)
            window.location.reload(true) 
        }

        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

async function handleNegarSolitacaoUsuarios (id){
    try {
        const responseJson =  await fetch(`http://localhost:3333/solicitacaoUsuario/${id}`,{
            method:'DELETE'
        })

        if(responseJson.status == 200){
            alert('Solicitação negada com sucesso')
        }
    } catch (error) {
        console.log(error)
    }
}

async function handleGetSolicitacaoUsuarios (){
    try {
        const solicitacaoUsuariosJson = await fetch('http://localhost:3333/solicitacaoUsuario')
        const solicitacaoUsuarios = await solicitacaoUsuariosJson.json()
        console.log(solicitacaoUsuarios)
        return solicitacaoUsuarios
    } catch (error) {
        console.log(error)
    }
}

handleGetSolicitacaoUsuarios()

async function handleGetDepartamento (){
    try {
        const departamentosJson = await fetch('http://localhost:3333/departamento/ativos')
        const resDepartamentos = await departamentosJson.json()
        departamentos = resDepartamentos
        departamentos.map((departamento)=>{
            const option = document.createElement('option')
            option.value = departamento._id
            option.innerText = departamento.nome
            departmentSelect.appendChild(option)
            selectDepartamentoAceitar.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

handleGetDepartamento()

async function handleAddUser(body) {
    try {
        const responseJson = await fetch('http://localhost:3333/usuarios/addUser',{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })
        
        if(responseJson.status === 201){
            alert('Usuario criado com sucesso')
            window.location.reload(true) 
        }

        const response = await responseJson.json()
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

const listaSidebarBtn = [dashBtn, relatorioBtn, rncBtn, dashDetalhadoBtn, monitoramentoBtn, departamentoBtn, usuariosBtn, cxEntradaBtn, meuPerfilBtn]
const urlSidebar = [
    'homePage.html',
    'relatorioQualidade.html',
    'abrirRnc.html',
    'graficosDetalhados.html',
    'monitoramento.html',
    'departamentos.html',
    'usuarios.html',
    'cxEntrada.html',
    'meuPerfil.html'
]

for(let i = 0; i < listaSidebarBtn.length; i++) {
    listaSidebarBtn[i].addEventListener('click', () => {
        window.location.href = urlSidebar[i]
    })
}

function updateManager() {
    const managerInput = document.getElementById('userManager');
    
    const selectedDepartment = departmentSelect.value;
    if (selectedDepartment) {
        let departamentoSelect = departamentos.filter((departamento)=> departamento._id == departmentSelect.value)[0]
        managerInput.value = departamentoSelect.gerente.nome || '';
    } else {
        managerInput.value = '';
    }
}

function updateManagerModalAceitar() {
    const managerInput = document.getElementById('userManager');
    
    const selectedDepartment = selectDepartamentoAceitar.value;
    if (selectedDepartment) {
        let departamentoSelect = departamentos.filter((departamento)=> departamento._id == selectDepartamentoAceitar.value)[0]
        inputGerente.value = departamentoSelect.gerente.nome || '';
    } else {
        managerInput.value = '';
    }
}

selectDepartamentoAceitar.addEventListener('change',updateManagerModalAceitar)

function addProfile(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value;
    const department = document.getElementById('userDepartment').value;
    const manager = document.getElementById('userManager').value;


    const newProfile = {
        id: profiles.length + 1,
        name: name,
        department: department,
        manager: manager,
        status: 'active'
    };

    profiles.push(newProfile);
    renderProfiles();
    closeModal();
    event.target.reset();
    document.getElementById('userManager').value = ''; // Limpa o campo do gestor
}

function filtroDoPerfil(){
    const statusSelecionado = document.getElementById('filtroPerfil').value;
    if(statusSelecionado != 'Solicitacoes'){
        const filteredProfiles = profiles.filter(dept => 
            statusSelecionado === 'all' || dept.ativo.toString() == statusSelecionado
        );
        // Agora renderize os departamentos filtrados
        renderProfiles(filteredProfiles);
    }else{
        renderSolicitacoes()
    }
}

const infNovoPerfil = () => {
    const novoPerfil = document.getElementById("userName")
    const setor = document.getElementById("userDepartment") 
    const gestor = document.getElementById("userManager") 
    const email = document.getElementById("email") 
    const cargo = document.getElementById("cargo") 
    const senhaInput = document.getElementById("senha") 
    const confirmacaoSenha = document.getElementById("confirmacaoSenha") 

    const infPerfil = {
        nome: novoPerfil.value,
        setor: setor.value,
        gestor: gestor.value,
        email: email.value,
        cargo: cargo.value,
        senhaInput: senhaInput.value,
        confirmacaoSenha: confirmacaoSenha.value
    }

    console.log(infPerfil)
return
}

async function renderProfiles(filteredProfiles) {
    const grid = document.getElementById('profilesGrid');
    grid.innerHTML = '';
    if(filteredProfiles == null){
        filteredProfiles = await handleGetUsuarios()
    }
    if(filteredProfiles.length > 0){
    filteredProfiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        const statusClass = profile.ativo ? 'status-active' : 'status-blocked';
        const statusText = profile.ativo ? 'Ativo' : 'Bloqueado';

        card.innerHTML = `
            <div class="profile-header">
                <div class="profile-main-info">
                    <div class="avatar">${profile.avatar}</div>
                    <h3 class="profile-name">${profile.nome}</h3>
                    <div class="profile-department">${profile.departamento.nome}</div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="profile-actions">
                    <button class="action-btn block-btn" onclick="toggleProfileStatus(${profile.id})">
                        <i class="fas ${profile.status === 'active' ? 'fa-lock' : 'fa-lock-open'}"></i>
                    </button>
                    <button class="action-btn" onclick="removeProfile(${profile.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="manager-info">
                <div class="avatar">${profile.departamento.sigla}</div>
                <div>
                    <div style="font-weight: bold;">${profile.departamento.gerente}</div>
                    <div style="font-size: 0.875rem; color: #7f8c8d;">Gestor</div>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
    }else{
        grid.innerHTML = `
            <h2>Nenhum usuario encontrado</h2>
        `
    }
}

async function renderSolicitacoes (){
    const grid = document.getElementById('profilesGrid');
    grid.innerHTML = '';
    
    let filteredProfiles = await handleGetSolicitacaoUsuarios()
    
    if(filteredProfiles.length > 0){
    filteredProfiles.forEach(profile => {
        console.log(profile)
        const card = document.createElement('div');
        card.className = 'profile-card';
        const statusClass = profile.ativo ? 'status-active' : 'status-blocked';
        const statusText = profile.ativo ? 'Ativo' : 'Bloqueado';
        const divBtn = document.createElement('div')
        divBtn.classList.add('profile-btn')
        const btnAceitar = document.createElement('button')
        btnAceitar.type = 'button'
        btnAceitar.classList.add('btnAceitar')
        btnAceitar.innerText = 'Aceitar'
        btnAceitar.addEventListener('click',()=>{
            showModalAceitar(profile)
        })
        const btnNegar = document.createElement('button')
        btnNegar.type = 'button'
        btnNegar.classList.add('btnNegar')
        btnNegar.innerText = 'Negar'
        btnNegar.addEventListener('click', async ()=>{
            await handleNegarSolitacaoUsuarios(profile._id)
            card.remove()
        })
        
        divBtn.appendChild(btnAceitar)
        divBtn.appendChild(btnNegar)


        card.innerHTML = `
            <div class="profile-header">
                <div class="profile-main-info">
                    <div class="avatar">${profile.avatar}</div>
                    <h3 class="profile-name">${profile.nome}</h3>
                </div>
            </div>
            <div class="manager-info">
                <p>Email:</p>
                <p>${profile.email}</p>
            </div>
        `;
        card.appendChild(divBtn)
        grid.appendChild(card);
    });
    }else{
        grid.innerHTML = `
            <h2>Nenhuma solicitação encontrada</h2>
        `
    }
}

function openModal() {
    document.getElementById('addProfileModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addProfileModal').style.display = 'none';
    document.getElementById('addProfileForm').reset();
    document.getElementById('userManager').value = ''; // Limpa o campo do gestor
}

async function addProfile(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value;
    const department = document.getElementById('userDepartment').value;
    const manager = document.getElementById('userManager').value;
    const email = document.querySelector('#email').value
    const cargo = document.querySelector('#cargo').value
    const senhaInput = document.getElementById("senha").value
    const confirmacaoSenha = document.getElementById("confirmacaoSenha").value

    let regexSenhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if(!regexSenhaForte.test(senhaInput)){
        alert('A senha precisa ser forte!');
        return;
    }

    if (senhaInput !== confirmacaoSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    let avatar = name.substring(0,2).toUpperCase()

    const newPerfil = {
        nome:name,
        departamento:department,
        email,
        avatar,
        cargo,
        senha:senhaInput,
        confirmeSenha:confirmacaoSenha,
        permissao:selectPermissao.value,
        ativo:true
    }

    await handleAddUser(newPerfil)

    // profiles.push(newProfile);
    // renderProfiles();
    closeModal();
    event.target.reset();
}

formAceitar.addEventListener('submit', async (evt)=>{
    evt.preventDefault()

    let nome = modalAceitar.getAttribute('data-nome')
    let email = modalAceitar.getAttribute('data-email') 
    let senha = modalAceitar.getAttribute('data-senha') 
    let avatar = modalAceitar.getAttribute('data-avatar') 
    let idSolicitacao = modalAceitar.getAttribute('data-id')

    let body = {
        idSolicitacao,
        nome,
        departamento:selectDepartamentoAceitar.value,
        email,
        avatar,
        cargo:inputCargo.value,
        senha,
        permissao:selectPermissaoAceitar.value,
        ativo:true
    }

    console.log(body)

    await handleAceitarUsuario(body)
})

function removeProfile(id) {
    if (confirm('Tem certeza que deseja remover este perfil?')) {
        profiles = profiles.filter(profile => profile.id !== id);
        renderProfiles();
    }
}

function showModalAceitar (body){
    modalAceitar.style = 'display:flex;'
    modalAceitar.setAttribute('data-nome',body.nome)
    modalAceitar.setAttribute('data-avatar',body.avatar)
    modalAceitar.setAttribute('data-email',body.email)
    modalAceitar.setAttribute('data-senha',body.senha)
    modalAceitar.setAttribute('data-id',body._id)

}

function toggleProfileStatus(id) {
    const profile = profiles.find(profile => profile.id === id);
    if (profile) {
        profile.status = profile.status === 'active' ? 'blocked' : 'active';
        renderProfiles();
    }
}

document.getElementById('addProfileForm').addEventListener('submit', addProfile);
window.onclick = function(event) {
    const modal = document.getElementById('addProfileModal');
    if (event.target == modal) {
        closeModal();
    }

    if(event.target == modalAceitar){
        modalAceitar.style = 'display:none;'
    }
}

renderProfiles()