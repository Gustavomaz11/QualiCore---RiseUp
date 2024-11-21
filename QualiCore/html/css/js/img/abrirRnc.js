const botaoPerfil = document.getElementById('botaoPerfil');
const menuPerfil = document.getElementById('menuPerfil');
const modal = document.querySelector(".modalPerfil");
const btn = document.getElementById("meuPerfilBtn");
const closeBtn = document.querySelector(".fecharModal");
const rncForm = document.querySelector('#rncForm')

const passos = document.querySelectorAll('.passos')
const dashBtn = document.querySelector('#dashBtn')
const relatorioBtn = document.querySelector('#relatorioBtn')
const rncBtn = document.querySelector('#rncBtn')
const dashDetalhadoBtn = document.querySelector('#dashDetalhadoBtn')
const monitoramentoBtn = document.querySelector('#monitoramentoBtn')
const departamentoBtn = document.querySelector('#departamentoBtn')
const usuariosBtn = document.querySelector('#usuariosBtn')
const cxEntradaBtn = document.querySelector('#cxEntradaBtn')
const meuPerfilBtn = document.querySelector('#meuPerfilBtn')

const btnProximo = document.querySelector("#btnProximo")
const btnVoltar = document.querySelector("#btnVoltar")
const btnSubmit = document.querySelector("#btnSubmit")
const bolinha = document.querySelectorAll('.bolinha')

// inputs 
const radios = document.querySelectorAll('#origem')
const descrever  = document.querySelector('#descrever')
const anexo = document.querySelector('#anexo')
const acaoImediata = document.querySelector("#acaoImediata")
const investigacao = document.querySelector('#investigacao')
const setorAutuado = document.querySelector('#setorAutuado')

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

handleGetDepartamento()



// pegando usuario
let user = localStorage.getItem('login')
if(user != null)
    user = JSON.parse(user)

if(user == null)
    window.location.href = 'index.html';

const nome = document.querySelector('#nome')
nome.innerText = user.nome?user.nome:'xxxx'

console.log(user)

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

//
// let gestorSetor = funcionarios.filter((funcionario)=> {
//     if(funcionario.departamento.sigla == user.departamento.sigla && funcionario.cargo.includes('Gerente'))
//         return funcionario
// })

// setorAutuado.disabled  = true
// setorAutuado.value = gestorSetor[0].setor.nome

btnVoltar.addEventListener('click',()=>{
    passos[0].style = 'display: block;'
    passos[1].style = "display:none;"
    btnVoltar.style = "display:none;"
    btnProximo.style = "display: block;"
    btnSubmit.style = "display: none;"
    bolinha[1].classList.remove('active')
    bolinha[0].classList.add("active")
})

// primeiro form
passos[0].addEventListener("submit",(evt)=>{
    evt.preventDefault()

    passos[0].style = 'display: none;'
    passos[1].style = "display:block;"
    btnVoltar.style = "display:block;"
    btnProximo.style = "display: none;"
    btnSubmit.style = "display:block;"
    bolinha[0].classList.remove('active')
    bolinha[1].classList.add("active")
})

function atualizandoUser (user, funcionarios){
    user = localStorage.getItem('login')
    if(user != null)
        user = JSON.parse(user)

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


if(user == null)
    window.location.href = 'index.html';

const rnc = {
    enquadramento:null,
    origem:null,
    descricao:null,
    anexos:[],
    acaoImediata:null,
    investigacao:null,
    setorAutuado:null,
    data:null,
    hora:null,
    criador:null,
    severidade:null,
    status:'analise',
    tipo:null,
    setorAtuar:null,
    linhaDoTempo:[],
    pessoasAnexadas:[],
    quem:null,
    numero:1
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

const selectedOptions = new Set();

function filterOptions() {
    const input = document.getElementById('search');
    const filter = input.value.toLowerCase();
    const optionsContainer = document.getElementById('dropdown');
    const options = optionsContainer.getElementsByTagName('label');

    for (let i = 0; i < options.length; i++) {
        const txtValue = options[i].textContent.toLowerCase();
        options[i].style.display = txtValue.indexOf(filter) > -1 ? '' : 'none';
    }
}

function updateSelected(checkbox) {
    const value = checkbox.value;
    const selectedContainer = document.getElementById('selectedOptions');
    const input = document.getElementById('search')
    input.required = false

    if (checkbox.checked) {
        selectedOptions.add(value);
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.textContent = value; // Ou use uma descrição mais amigável
        const removeBtn = document.createElement('span');
        removeBtn.textContent = '✖';
        removeBtn.className = 'remove';
        removeBtn.onclick = function() {
            checkbox.checked = false;
            selectedOptions.delete(value);
            selectedContainer.removeChild(item);
            if(selectedContainer.children.length == 0){
                input.required = true
            }
        };
        item.appendChild(removeBtn);
        selectedContainer.appendChild(item);
    } else {
        selectedOptions.delete(value);
        const items = selectedContainer.getElementsByClassName('selected-item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].textContent.includes(value)) {
                selectedContainer.removeChild(items[i]);
                break;
            }
        }
    }

    console.log(Array.from(selectedOptions)); // Mostra as opções selecionadas
}

document.getElementById('anexo').addEventListener('change', function() {
    const arquivos = this.files;
    const anexoTable = document.getElementById('anexoTable').getElementsByTagName('tbody')[0];
    for (let i = 0; i < arquivos.length; i++) {
        const newRow = anexoTable.insertRow(-1);
        
        newRow.insertCell(0).textContent = arquivos[i].name;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.style.color = 'red';
        deleteBtn.onclick = function(evt) {
            let nomeAnexo = evt.target.parentNode.parentNode.firstChild.innerText
            rnc.anexos = rnc.anexos.filter((anexo)=> anexo != nomeAnexo)
            anexoTable.deleteRow(newRow.rowIndex - 1); // Remove a linha da tabela
            const input = document.getElementById('anexo');
            const dataTransfer = new DataTransfer();
            
            // Filtrar os arquivos que não foram excluídos
            for (let j = 0; j < input.files.length; j++) {
                if (input.files[j].name !== arquivos[i].name) {
                    dataTransfer.items.add(input.files[j]);
                }

            }
            input.files = dataTransfer.files; // Atualiza os arquivos no input
            if (anexoTable.rows.length === 0) {
                anexoTable.closest('table').style.display = 'none'; // Esconde a tabela se não houver anexos
            }
        };
        
        newRow.insertCell(1).appendChild(deleteBtn);
        rnc.anexos.push(arquivos[i].name);
    }
    
    if (anexoTable.rows.length > 0) {
        anexoTable.closest('table').style.display = 'table'; // Mostra a tabela se houver anexos
    }
});

async function handleAddSolicitacao (body){
    try {
        const solicitacaoJson = await fetch('http://localhost:3333/solicitacaoRnc/criar',{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })
        const solicitacao = await solicitacaoJson.json()

        console.log(solicitacao)
    } catch (error) {
        console.log(error)
    }
}

async function handleGetDepartamento (){
    try {
        const departamentoJson = await fetch('http://localhost:3333/departamento')
        const departamento = await departamentoJson.json()
        departamento.map((currentDepartamento)=>{
            const option = document.createElement('option')
            option.value = currentDepartamento._id
            option.innerText = `${currentDepartamento.sigla} - ${currentDepartamento.gerente.nome.split(' ')[0]}`
            option.title = currentDepartamento.nome
            if(user.departamento.sigla == currentDepartamento.sigla){
                option.selected = true
                
            }
            setorAutuado.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

// função para mandar as informação da rnc pro localstore
passos[1].addEventListener('submit',(evt)=>{
    evt.preventDefault()
    
    radios.forEach((radio)=>{
        if(radio.checked){
            radioCheck = radio.value
        }
    })

    let body = {
        origem:radioCheck,
        descricao:descrever.value,
        enquadramento:Array.from(selectedOptions),
        acaoImediata:acaoImediata.value,
        investigacao:investigacao.value,
        setorAutuante:setorAutuado.value,
        criador:user,
        anexos:[]
    }

    handleAddSolicitacao(body)

    alert('Solicitação feita')
})
