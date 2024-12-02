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

// popup

function mostrarPopup(mensagem) {
    const popup = document.getElementById('notificacao');
    popup.textContent = mensagem;
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

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

botaoPerfil.addEventListener('click', function(event) {
    event.stopPropagation();
    menuPerfil.classList.toggle('ativo');
});

document.addEventListener('click', function(event) {
    if (!menuPerfil.contains(event.target) && !botaoPerfil.contains(event.target)) {
        menuPerfil.classList.remove('ativo');
    }
});

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

handleGetMyCarLetter()

// pegando funcionarios
let funcionarios = localStorage.getItem('funcionarios')
if(funcionarios != null)
    funcionarios = JSON.parse(funcionarios)

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
    }
    
    if (anexoTable.rows.length > 0) {
        anexoTable.closest('table').style.display = 'table'; // Mostra a tabela se houver anexos
    }
})

async function handleAddSolicitacao (body){
    try {
        const formData = new FormData()
        for (let i = 0; i < anexo.files.length; i++) {
            formData.append('anexos', anexo.files[i])
        }
        formData.append('json',JSON.stringify(body))
        const solicitacaoJson = await fetch('http://localhost:3333/solicitacaoRnc/criar',{
            method:"POST",
            body:formData
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
passos[1].addEventListener('submit', async (evt)=>{
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
    }

    console.log(body)

    await handleAddSolicitacao(body)
    mostrarPopup('RNC enviado para análise')
    // alert('Solicitação feita')

    setTimeout(()=>{
        window.location.href = 'monitoramento.html'
    },2000)
})
