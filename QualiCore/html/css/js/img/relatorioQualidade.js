const dashBtn = document.querySelector('#dashBtn')
const relatorioBtn = document.querySelector('#relatorioBtn')
const rncBtn = document.querySelector('#rncBtn')
const dashDetalhadoBtn = document.querySelector('#dashDetalhadoBtn')
const monitoramentoBtn = document.querySelector('#monitoramentoBtn')
const departamentoBtn = document.querySelector('#departamentoBtn')
const usuariosBtn = document.querySelector('#usuariosBtn')
const cxEntradaBtn = document.querySelector('#cxEntradaBtn')

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

// pegando a rnc pelo localstorege
let rnc = localStorage.getItem('rnc')
if (rnc!= null)
    rnc = JSON.parse(rnc)
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

async function handleGetRncConcluidas (){
    try {
        const concluidasJson = await fetch('http://localhost:3333/rncConcluidas')
        const concluidas = await concluidasJson.json()
        return concluidas
    } catch (error) {
        console.log(error)
    }
}

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
    window.location.href = 'index.html';
})



// função que deixa a cor da carta laranja caso tenha alguam msg não vista


const listaSidebarBtn = [dashBtn, relatorioBtn, rncBtn, dashDetalhadoBtn, monitoramentoBtn, departamentoBtn, usuariosBtn, cxEntradaBtn]
const urlSidebar = [
    'homePage.html',
    'relatorioQualidade.html',
    'abrirRnc.html',
    'graficosDetalhados.html',
    'monitoramento.html',
    'departamentos.html',
    'usuarios.html',
    'cxEntrada.html'
]

for(let i = 0; i < listaSidebarBtn.length; i++) {
    listaSidebarBtn[i].addEventListener('click', () => {
        window.location.href = urlSidebar[i]
    })
}

botaoPerfil.addEventListener('click', function(event) {
    event.stopPropagation();
    menuPerfil.classList.toggle('ativo');
});

document.addEventListener('click', function(event) {
    if (!menuPerfil.contains(event.target) && !botaoPerfil.contains(event.target)) {
        menuPerfil.classList.remove('ativo');
    }
});


// Dados de exemplo
let rncs = [
    {
        id: 'NC001',
        sector: 'Produção',
        severity: 'high',
        manager: 'João Silva',
        reporter: 'Maria Santos',
        involvedPeople: ['AS', 'BT', 'CL'],
        description: 'Falha no processo de controle de qualidade.',
        deadline: '2024-04-15'
    },
    {
        id: 'NC002',
        sector: 'Logística',
        severity: 'medium',
        manager: 'Pedro Alves',
        reporter: 'Ana Costa',
        involvedPeople: ['DM', 'EF'],
        description: 'Atraso na entrega de materiais críticos.',
        deadline: '2024-04-20'
    },
    {
        id: 'NC003',
        sector: 'Qualidade',
        severity: 'low',
        manager: 'Carla Diniz',
        reporter: 'Roberto Gomes',
        involvedPeople: ['GH', 'IJ', 'KL'],
        description: 'Documentação incompleta no relatório mensal.',
        deadline: '2024-04-10'
    }
];

function createRNCCard(data) {
    console.log(data)
    const card = document.createElement('div');
    card.className = 'rnc-card';
    card.innerHTML = `
        <div class="rnc-header">
            <div>
                <h3 class="rnc-title">RNC ${data._id}</h3>
                <span class="severity-badge severity-${data.nivelSeveridade}">
                    ${getSeverityText(data.nivelSeveridade)}
                </span>
            </div>
        </div>
        <div class="rnc-details">
            <div class="rnc-detail-item">
                <span class="rnc-detail-label">Setor:</span>
                <span>${data.criador.departamento.nome}</span>
            </div>
            <div class="rnc-detail-item">
                <span class="rnc-detail-label">Gestor:</span>
                <span title=${data.criador.departamento.gerente}>${showName(data.criador.departamento.gerente)}</span>
            </div>
            <div class="rnc-detail-item">
                <span class="rnc-detail-label">Reportado por:</span>
                <span title=${data.criador.nome}>${showName(data.criador.nome)}</span>
            </div>
        </div>
        <div class="involved-people">
            <span class="rnc-detail-label">Envolvidos:</span>
            <div class="avatar-group">
                ${data.pessoasAnexadas.map(person => `
                    <div class="avatar" title=${person.nome}>${person.avatar}</div>
                `).join('')}
            </div>
        </div>
    `;
    return card;
}

function getSeverityText(severity) {
    const severityMap = {
        alta: 'Alta',
        media: 'Média',
        baixa: 'Baixa'
    };
    return severityMap[severity] || severity;
}

function openModal() {
    document.getElementById('addRNCModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addRNCModal').style.display = 'none';
}

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('rncGrid');
    
    rncs = await handleGetRncConcluidas()
    console.log(rncs)
    rncs.forEach(rnc => {
        container.appendChild(createRNCCard(rnc));
    });
});