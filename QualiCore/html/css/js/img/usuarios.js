const dashBtn = document.querySelector('#dashBtn')
const relatorioBtn = document.querySelector('#relatorioBtn')
const rncBtn = document.querySelector('#rncBtn')
const dashDetalhadoBtn = document.querySelector('#dashDetalhadoBtn')
const monitoramentoBtn = document.querySelector('#monitoramentoBtn')
const departamentoBtn = document.querySelector('#departamentoBtn')
const usuariosBtn = document.querySelector('#usuariosBtn')
const cxEntradaBtn = document.querySelector('#cxEntradaBtn')
const meuPerfilBtn = document.querySelector('#meuPerfilBtn')

const btnMenu = document.querySelector('#btnMenu')
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

// pegando funcionarios
let funcionarios = localStorage.getItem('funcionarios')
if(funcionarios != null)
    funcionarios = JSON.parse(funcionarios)

// limpando o cash
const btnlimparCash = document.querySelector('#limparCash')
btnlimparCash.addEventListener('click',()=>{
    localStorage.removeItem('rnc')
    localStorage.removeItem('lengthRnc')
    console.log(funcionarios)
    funcionarios.map((funcionario)=>{
        funcionario.mensagens = []
    })
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios))
    localStorage.removeItem('login')
    window.location.href = 'index.html'
})
// função que deixa a cor da carta laranja caso tenha alguam msg não vista

function atualizandoUser (user, funcionarios){
    user = localStorage.getItem('login')
    if(user != null)
        user = JSON.parse(user)

    console.log(user)

    funcionarios = localStorage.getItem('funcionarios')
    if(funcionarios != null)
        funcionarios = JSON.parse(funcionarios)

    funcionarios?.map((funcionario)=>{
        if(funcionario.email == user.email){
            funcionario.mensagens.map((menssagem)=>{
                console.log(menssagem)
                if(menssagem.lida == false){
                    if(cxEntradaBtn.className == 'botaoIcone novaMenssagem') return
                    else
                        cxEntradaBtn.classList.add('novaMenssagem')
                }
                else{
                    cxEntradaBtn.classList.remove('novaMenssagem')
                }
            })
        }
    })
}

atualizandoUser(user,funcionarios)
setInterval(atualizandoUser(user, funcionarios),5000)

async function handleGetUsuarios (){
    try {
        const usuariosJson = await fetch('http://localhost:3333/usuarios')
        const usuarios = await usuariosJson.json()
        profiles = usuarios
        console.log(usuarios)
        renderProfiles();
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


const departmentManagers = {
    'RH': 'Ana Costa',
    'TI': 'Carlos Santos',
    'Marketing': 'Juliana Oliveira',
    'Financeiro': 'Roberto Silva'
};

let profiles = [
    { id: 1, name: 'João Silva', department: 'TI', manager: 'Carlos Santos', status: 'active' },
    { id: 2, name: 'Maria Oliveira', department: 'RH', manager: 'Ana Costa', status: 'active' },
    { id: 3, name: 'Pedro Santos', department: 'Marketing', manager: 'Juliana Oliveira', status: 'blocked' }
];

function updateManager() {
    const departmentSelect = document.getElementById('userDepartment');
    const managerInput = document.getElementById('userManager');
    
    const selectedDepartment = departmentSelect.value;
    if (selectedDepartment) {
        managerInput.value = departmentManagers[selectedDepartment] || '';
    } else {
        managerInput.value = '';
    }
}

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
    
    const filteredProfiles = profiles.filter(dept => 
        statusSelecionado === 'all' || dept.status === statusSelecionado
    );

    // Agora renderize os departamentos filtrados
    renderProfiles(filteredProfiles);
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

function renderProfiles(filteredProfiles = profiles) {
    const grid = document.getElementById('profilesGrid');
    grid.innerHTML = '';

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
                <div class="avatar">${profile.departamento.gerente.substring(0,2)}</div>
                <div>
                    <div style="font-weight: bold;">${profile.departamento.gerente}</div>
                    <div style="font-size: 0.875rem; color: #7f8c8d;">Gestor</div>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function openModal() {
    document.getElementById('addProfileModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addProfileModal').style.display = 'none';
    document.getElementById('addProfileForm').reset();
    document.getElementById('userManager').value = ''; // Limpa o campo do gestor
}

function addProfile(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value;
    const department = document.getElementById('userDepartment').value;
    const manager = document.getElementById('userManager').value;
    const email = document.querySelector('#email')
    const cargo = document.querySelector('#cargo')
    const senhaInput = document.getElementById("senha")
    const confirmacaoSenha = document.getElementById("confirmacaoSenha")

    let regexSenhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if(!regexSenhaForte.test(senhaInput.value)){
        alert('A senha precisa ser forte!');
        return;
    }

    if (senhaInput.value !== confirmacaoSenha.value) {
        alert('As senhas não coincidem!');
        return;
    }

    const newPerfil = {
        nome:name,
        departamento:department,
        email,
        cargo,
        senha,
        confirmacaoSenha
    }

    console.log(newPerfil)

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
}

function removeProfile(id) {
    if (confirm('Tem certeza que deseja remover este perfil?')) {
        profiles = profiles.filter(profile => profile.id !== id);
        renderProfiles();
    }
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
}

// Inicializa a renderização dos perfis
handleGetUsuarios()