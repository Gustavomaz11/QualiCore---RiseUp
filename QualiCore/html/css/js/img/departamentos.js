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

async function handleGetDepartamento (){
    try {
        const departamentoJson = await fetch('http://localhost:3333/departamento')
        const departamento = await departamentoJson.json()
        departments = departamento
        renderDepartments()
    } catch (error) {
        console.log(error)
    }
}

async function handleSetDepartamento(body){
    try {
        const responseJson = await fetch('http://localhost:3333/departamento/add',{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })
        
        if(responseJson.status == 200){
            alert('Departamento criado com sucesso')
            window.location.reload(true)
            return
        }

        const response = await responseJson.json()
        alert(response.message)
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

function filtrodoStatus() {
    const statusSelecionado = document.getElementById('filtroStatus').value;
    
    const filteredDepartments = departments.filter(dept => 
        statusSelecionado === 'all' || dept.ativo.toString() === statusSelecionado
    );

    // Agora renderize os departamentos filtrados
    renderDepartments(filteredDepartments);
}

let departments = null

const infNovoDepartamento = () => {
    const novoDepartamento = document.getElementById("departmentName")
    const siglaDepartamento = document.getElementById("siglaDepartamento")  
    const email = document.getElementById("email") 
    const ativo = document.querySelector('#radioContainer input[name="ativo"]:checked'); 

    const infDepartamento = {
        nome: novoDepartamento.value,
        sigla: siglaDepartamento.value,
        email: email.value,
        ativo: ativo.value,
    }

    console.log(infDepartamento)
return
}

function renderDepartments(filteredDepartments = departments) {
    const grid = document.getElementById('departmentsGrid');
    grid.innerHTML = '';
    if(filteredDepartments.length > 0){
        filteredDepartments.forEach(dept => {
            const card = document.createElement('div');
            card.className = 'department-card';
            const statusClass = dept.ativo ? 'status-active' : 'status-blocked';
            const statusText = dept.ativo  ? 'Ativo' : 'Bloqueado';

            card.innerHTML = `
                <div class="department-header">
                    <h3 class="department-name">${dept.nome}</h3>
                    <div class="department-actions">
                        <button class="action-btn block-btn" onclick="toggleDepartmentStatus(${dept._id})">
                            <i class="fas ${dept.ative ? 'fa-lock' : 'fa-lock-open'}"></i>
                        </button>
                        <button class="action-btn" onclick="removeDepartment(${dept.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <span class="status-badge ${statusClass}">${statusText}</span>
                <div class="manager-info">
                    <div class="manager-avatar">${dept.gerente.avatar}</div>
                    <div>
                        <div style="font-weight: bold;">${dept.gerente.nome}</div>
                        <div style="font-size: 0.875rem; color: #7f8c8d;">Gestor</div>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });
    }else{
        grid.innerHTML = `
            <h2>Nenhum departamento encontrado</h2>
        `
    }

}

function openModal() {
    document.getElementById('addDepartmentModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addDepartmentModal').style.display = 'none';
}

function addDepartment(event) {
    event.preventDefault();
    const name = document.getElementById('departmentName').value;
    const sigla = document.querySelector('#siglaDepartamento').value
    let ativoInput = document.querySelectorAll('input[type="radio"]')
    const emailGerente = document.getElementById('email').value;
    let ativo = null
    ativoInput.forEach((ele)=> {
        if(ele.checked)
            ativo = ele.value
    })

    
    const novoDepartamento = {
        nome:name,
        sigla,
        emailGerente,
        ativo
    }
    
    console.log(novoDepartamento)
    handleSetDepartamento(novoDepartamento)
}

function removeDepartment(id) {
    if (confirm('Tem certeza que deseja remover este departamento?')) {
        departments = departments.filter(dept => dept.id !== id);
        renderDepartments();
    }
}

function toggleDepartmentStatus(id) {
    const department = departments.find(dept => dept.id === id);
    if (department) {
        department.status = department.status === 'active' ? 'blocked' : 'active';
        renderDepartments();
    }
}

document.getElementById('addDepartmentForm').addEventListener('submit', addDepartment);
window.onclick = function (event) {
    const modal = document.getElementById('addDepartmentModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Inicializa a renderização dos departamentos
handleGetDepartamento()




