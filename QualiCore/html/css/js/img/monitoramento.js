// Modal
const modal = document.getElementById("rncDetailsModal");
const closeBtn = document.getElementsByClassName("close")[0];
const metodoOutroTexto = document.getElementById("metodoOutroTexto");
const modalFooter = document.querySelector('.modal-footer')
const modalBody = document.querySelector('.modalBody')
const bodyTabelaRnc = document.querySelector('#bodyTabelaRNC')
const DivlinhaDoTempo = document.querySelector('.linhaDoTempo')
const detalhesRncDoModal = document.querySelector('.detalhesRncDoModal')
const btnFormulario = document.querySelector('#btnFormulario')
const btnLinhaDoTempo = document.querySelector('#btnLinhaDoTempo')
const cxEntradaBtn = document.querySelector('#cxEntradaBtn')

let atualActive

btnFormulario.addEventListener('click',()=>{
    detalhesRncDoModal.classList.remove('sumirConteudoModal')
    modalFooter.classList.remove('sumirConteudoModal')
    DivlinhaDoTempo.classList.remove('showForm')
})

btnLinhaDoTempo.addEventListener('click',()=>{
    detalhesRncDoModal.classList.add('sumirConteudoModal')
    modalFooter.classList.add('sumirConteudoModal')
    DivlinhaDoTempo.classList.add('showForm')
})

const btnMenu = document.querySelector('#btnMenu')
btnMenu.addEventListener('click',()=>{
    document.querySelector('main').style = "display:none;"
    document.querySelector('aside').classList.add('openMenu')
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



//popup
const popup = document.querySelector('.popup')
const body = document.querySelector('aside')

//tab btns
const detalhamentoRncBtn = document.querySelector('#detalhamentoBtn');
const andamentoBtn = document.querySelector('#andamentoBtn');
const conclusaoBtn = document.querySelector('#conclusaoBtn');
const btnCloneMenu = document.querySelector('#btnCloneMenu')

// btn para fechar o couver 
const btnExitCouver = document.querySelector('#btnExitCouver')

// div do kanban 
const kanbanBoard = document.querySelector('.kanban-board')

const navPrincipal = document.querySelector('.navPrincipal')
//
const selectQuem = document.querySelector('#quem')
const inputOque = document.querySelector('#oQue')
const inputQuando = document.querySelector('#quando')
const inputOnde = document.querySelector('#onde')
const inputComo = document.querySelector('#como')
const inputPorque = document.querySelector('#porque')
const inputCusto = document.querySelector('#custo')
const inputEvid = document.querySelector('#evid')

// pegando a rnc pelo localstorege
let funcionarios

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

// pegando funcionarios

if(user == null)
    window.location.href = 'index.html';

const nome = document.querySelector('#nome')
nome.innerText = user.nome?showName(user.nome):'xxxx'

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

btnCloneMenu.addEventListener('click',()=>{
    document.querySelector('aside').classList.remove('openMenu')
    document.querySelector('main').style = 'display: block;'
})

let lastTouchTime = 0
function handleDoubleTouch(evt, callback) {
        const currentTime = Date.now()
        const timeDifference = currentTime - lastTouchTime
        if (timeDifference < 300 && timeDifference > 0) {
            callback(evt)
        }
  
      lastTouchTime = currentTime;
  }

function evtDefault (evt){
    evt.preventDefault()
}

function disableScroll() {
    document.body.addEventListener('touchmove', evtDefault, { passive: false })
  }
  
  function enableScroll() {
    document.body.removeEventListener('touchmove', evtDefault)
  }



async function handleGetMyCarLetter (){
    try {
        const novaMenssagemJson = await fetch(`http://localhost:3333/menssagem/msgNova/${user._id}`)
        const novaMenssagem = await novaMenssagemJson.json()
        notificacaoNovaMsg(novaMenssagem)
    } catch (error) {
        console.log(error)
    } finally {
        setInterval(handleGetMyCarLetter,30000)
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

async function handleGetSolicitacao (){
    try {
        const solicitacaoJson = await fetch('http://localhost:3333/solicitacaoRnc')
        const solicitacao = await solicitacaoJson.json()
        return solicitacao
    } catch (error) {
        console.log(error)
    }
}

async function handleGetRnc (){
    try {
        const rncJson = await fetch('http://localhost:3333/rnc')
        const rnc = await rncJson.json()
        return rnc
    } catch (error) {
        console.log(error)
    }
}

async function handleChangeStatus (body){
    try {
        const respostaJson = await fetch('http://localhost:3333/rnc/alterarStatus',{
            method:"PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })

        if(respostaJson.status == 204){
            return
        }

        const resposta = await respostaJson.json()
        console.log(resposta)
    } catch (error) {
        console.log(error)
    }
}

async function hendleSetRnc (body){
    try {
        const rncJson = await fetch('http://localhost:3333/rnc/aceitarRnc',{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })

        if(rncJson.status == 201){
            alert('Rnc aceita com sucesso')
            window.location.reload(true) 
            return
        }

        let rnc = await rncJson.json()

        console.log(rnc)
    } catch (error) {
        console.log(error)
    }
}

async function changeDetalhamentoRnc (changeRnc){
    try {
        const rncJson = await fetch('http://localhost:3333/rnc/mudarInfo',{
            method:"PATCH",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(changeRnc)
        })

        if(rncJson.status == 200){
            alert('Rnc aceita com sucesso')
            window.location.reload(true) 
            return
        }

        let rnc = await rncJson.json()

        console.log(rnc)
    } catch (error) {
        console.log(error)
    }
}

async function handleAdd5w2h (body){
    try {
        const respostaJson = await fetch('http://localhost:3333/rnc/add5w2h',{
            method:"PATCH",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })

        if(respostaJson.status == 200){
            alert('5w2h adicionado com sucesso')
            window.location.reload(true) 
            return
        }

        let resposta = await respostaJson.json()

        console.log(resposta)
    } catch (error) {
        console.log(error)
    }
}

async function handleEdit5w2h (body){
    try {
        const respostaJson = await fetch('http://localhost:3333/rnc/edit5w2h',{
            method:"PATCH",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })

        if(respostaJson.status == 200){
            alert('5w2h editado com sucesso')
            window.location.reload(true) 
            return
        }

        let resposta = await respostaJson.json()

        console.log(resposta)
    } catch (error) {
        console.log(error)
    }
}

async function handleConclusao (body){
    try {   
        const respostaJson = await fetch('http://localhost:3333/rncConcluidas/conclusao',{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(body)
        })

        if(respostaJson.status == 201){
            alert('Rnc marcada como concluida')
            window.location.reload(true) 
            return
        }

        let resposta = await respostaJson.json()
        console.log(resposta)
    } catch (error) {
        console.log(error)
    }
}

async function handleGetRncConcluidas (){
    try {
        const concluidasJson = await fetch('http://localhost:3333/rncConcluidas')
        const concluidas = await concluidasJson.json()
        return concluidas
    } catch (error) {
        console.log(error)
    }
}

async function handleGetUsuariosAtivos (){
    try {
        const ativosJson = await fetch('http://localhost:3333/usuarios/ativos')
        let ativos = await ativosJson.json()
        funcionarios = ativos
    } catch (error) {
        console.log(error)
    }
}

handleGetUsuariosAtivos()

let rnc = []
// sistema que deixa o navPrincipal com o couver 
kanbanBoard.addEventListener('dblclick', (evt)=>{
    evt.stopImmediatePropagation()
    navPrincipal.classList.add('couver')
    document.querySelector('.kanban-board').classList.add('cursorNormal')
})

kanbanBoard.addEventListener('touchstart',(evt)=>{
    handleDoubleTouch(evt,()=>{
        evt.stopImmediatePropagation()
        navPrincipal.classList.add('couver')
        document.querySelector('.kanban-board').classList.add('cursorNormal')
    })
})

// sistema para deixar o navPrincipal normal 
btnExitCouver.addEventListener('click',()=>{
    navPrincipal.classList.remove('couver')
    document.querySelector('.kanban-board').classList.remove('cursorNormal')
})

// sistema que lança o popup quando tem uma nova rnc
// const showPopup = ()=>{
//     if(rnc?.length > lengthRnc){
//         popup.classList.add('show')
//         localStorage.setItem('lengthRnc', lengthRnc + 1)
//     }else{
//         popup.classList.remove('show')
//     }
//     rnc = JSON.parse(localStorage.getItem('rnc'))
//     lengthRnc = JSON.parse(localStorage.getItem('lengthRnc'))
    
//     setInterval(()=>{
//         popup.classList.remove('show')
//     },5000)
// }
// showPopup()

// Sidebar Navigation
const sidebarButtons = {
    dashBtn: 'homePage.html',
    relatorioBtn: 'relatorioQualidade.html',
    rncBtn: 'abrirRnc.html',
    dashDetalhadoBtn: 'graficosDetalhados.html',
    monitoramentoBtn: 'monitoramento.html',
    departamentoBtn: 'departamentos.html',
    usuariosBtn: 'usuarios.html',
    cxEntradaBtn: 'cxEntrada.html',
    meuPerfilBtn: 'meuPerfil.html'
};


Object.keys(sidebarButtons).forEach(buttonId => {
    const button = document.querySelector(`#${buttonId}`);
    button.addEventListener('click', () => {
        window.location.href = sidebarButtons[buttonId];
    });
});

// Kanban Card and Column Functionality
const cards = document.querySelectorAll('.kanban-card');
const columns = document.querySelectorAll('.kanban-cards');
const divsKanban = document.querySelectorAll('.kanban-cards')
document.addEventListener('DOMContentLoaded',async function () {
    let rncSolicitadas = await handleGetSolicitacao()
    let rncAceitas = await handleGetRnc()
    let rncConcluidas = await handleGetRncConcluidas()
    rnc.push(...rncSolicitadas)
    rnc.push(...rncAceitas)
    rnc.push(...rncConcluidas)
    
    // Add event listeners to cards and columns
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dblclick', openModalOnDoubleClick);
        card.addEventListener('touchstart',handleTouchMoveStart)
        card.addEventListener('touchend', handleTouchMoveEnd)
        card.addEventListener('touchstart',(evt)=>{
            handleDoubleTouch(evt,()=>openModalOnDoubleClick(card))
        })
    });

    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);
        column.addEventListener('touchmove',touchmove)
    });

    // Add card button functionality
    const addButtons = document.querySelectorAll('.add-card-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function () {
            const column = this.closest('.kanban-column').querySelector('.kanban-cards');
            const newCard = createNewCard();
            column.appendChild(newCard);
            updateColumnCounts();
        });
    });

    rnc?.map((elementoRnc)=>{
        divsKanban.forEach((div)=>{
            if(div.getAttribute('data-column') == elementoRnc.status){
                div.appendChild(reloadCard(elementoRnc))
            }
        })
    })

    function createNewCard() {
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.innerHTML = `
            <div class="card-priority">Nova tarefa</div>
            <div class="card-title">Clique para editar</div>
            <div class="card-description">Adicione uma descrição</div>
            <div class="card-footer">
                <div class="assignees">
                    <div class="assignee">+</div>
                </div>
                <div class="metrics">
                    <div class="metric">0</div>
                    <div class="metric">0</div>
                </div>
            </div>
        `;

        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dblclick', openModalOnDoubleClick);
        card.addEventListener('touchstart',handleTouchMoveStart)
        card.addEventListener('touchend', handleTouchMoveEnd)
        card.addEventListener('touchstart',(evt)=>{
            handleDoubleTouch(evt,()=>openModalOnDoubleClick(card))
        })

        return card;
    }
    
    // Inicializa os contadores
    updateColumnCounts();

    // Funções para abrir e fechar o modal de Detalhes de RNC

    function closeModal() {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
            inicializarAba()
        }
    };

    // Funções para troca de abas no modal

    const abaDetalhamento = document.querySelector('#detalhamento');
    const abaAndamento = document.querySelector('#andamento');
    const abaConclusao = document.querySelector('#conclusao');

    const listaDetalhesBtn = [detalhamentoRncBtn, andamentoBtn, conclusaoBtn];
    const abas = [abaDetalhamento, abaAndamento, abaConclusao];

    function resetAbas() {
        abas.forEach(aba => aba.style.display = 'none');
        abas.forEach(aba => aba.classList.remove('active'));
        listaDetalhesBtn.forEach(btn => btn.classList.remove('active'));
    }

    function inicializarAba() {
        resetAbas();
        abaDetalhamento.style.display = 'flex';
        abaDetalhamento.classList.add('active');
        detalhamentoRncBtn.classList.add('active');
    }

    for (let z = 0; z < listaDetalhesBtn.length; z++) {
        listaDetalhesBtn[z].addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.tab-content').forEach((content)=>{
                if(content.className.includes('active'))
                    atualActive = content.getAttribute('id')
            })
            resetAbas();
            abas[z].style.display = 'flex';
            abas[z].classList.add('active');
            listaDetalhesBtn[z].classList.add('active');
            

        });
    }

    inicializarAba();
});

// sistema que adiciona a nova rnc no hmtl
function atualizandoRnc (){
    divsKanban.forEach((div)=>{
        while(div.firstChild){ // removendo todos as rnc do html
            div.removeChild(div.firstChild)
        }
        rnc?.map((elementoRnc)=>{
            if(div.getAttribute('data-column') == elementoRnc.status){
                div.appendChild(reloadCard(elementoRnc))
            }
        })
        updateColumnCounts()
    })
}

let draggedCard = null;

// Funções de arrastar
function handleTouchMoveStart (evt) {
    disableScroll()
    draggedCard = this
    evt.target.classList.add('dragging')
}

function handleTouchMoveEnd (evt) {
    enableScroll()
    evt.target.classList.remove('dragging')
    const touch = evt.changedTouches[0]
    const targetColumn = document.elementFromPoint(touch.clientX , touch.clientY)
    const rncStatus = draggedCard.getAttribute('data-status')
    console.log(targetColumn.getAttribute('data-column'))
    console.log(rncStatus)
    if (targetColumn && targetColumn.classList.contains('kanban-cards')) {
        if(rncStatus != 'analise' && rncStatus != 'concluido' && targetColumn.getAttribute('data-column') != 'analise'){
            let idRnc = draggedCard.getAttribute('data-_id')
            const body = {
                idRnc,
                status:targetColumn.getAttribute('data-column'),
                user
            }
            targetColumn.appendChild(draggedCard)
            draggedCard.setAttribute('data-status',targetColumn.getAttribute('data-column'))
            handleChangeStatus(body)
            modificandoRncPeloId(draggedCard)
            updateColumnCounts()
            atualizandoRnc()
            alert(`Status alterado para ${targetColumn.getAttribute('data-column')}`)
        }else if(targetColumn.getAttribute('data-column') == "concluido"){
            alert('Para concluir a RNC é necessario abrir o modal e preencher o formulario')
        }else if(rncStatus == 'concluido'){
            alert('Par modificar o status da RNC é necessario que ela não esteja como concluida')
        }else if(targetColumn.getAttribute('data-column') == "analise" && rncStatus != 'analise'){
            alert('RNC não pode ter status em análise depois que ela é aceita')
        }
        else{
            alert('Para modificar o status da RNC é necessario aceitar a solicitação')
        }
    }
    draggedCard = null
    document.querySelectorAll(".drag-over")?.forEach((drag)=>{
        drag.classList.remove("drag-over")
    })
}

function touchmove (evt) {
    const touch = evt.changedTouches[0]
    const targetColumn = document.elementFromPoint(touch.clientX , touch.clientY)

    if(touch.clientY > 500){
        document.querySelector('main').scrollTop+= 20 
    }

    if(touch.clientY < 50){
        document.querySelector('main').scrollTop-= 20 
    }

    if (targetColumn  && targetColumn.classList.contains('kanban-cards')){
        targetColumn.classList.add('drag-over')
    }else {
        document.querySelectorAll(".drag-over")?.forEach((drag)=>{
            drag.classList.remove("drag-over")
        })
    }
}

function handleDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    let element = e.target.parentNode
    console.log(element.getAttribute('data-column'))
    draggedCard.setAttribute('data-status',element.getAttribute('data-column'))
    modificandoRncPeloId(draggedCard)
    updateColumnCounts()
    atualizandoRnc()
    columns.forEach(column => column.classList.remove('drag-over'));
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.stopPropagation();
    if (draggedCard !== this) {
        this.classList.remove('drag-over');
        this.appendChild(draggedCard);
        updateColumnCounts();
    }
    return false;
}

function naoRepete (array){
    let noRepeat = []
    const set = new Set()
    array.forEach(user => {
        set.add(JSON.stringify(user))
    });
    set.forEach((user)=>{
        noRepeat.push(JSON.parse(user))
    })

    return noRepeat
}

function openModalOnDoubleClick(e) {
    document.body.style = 'overflow:hidden;'
    console.log(e)
    const saveBtn = document.getElementById("saveBtn");
    const data = new Date()
    let dia = data.getDate() < 10?"0"+data.getDate():data.getDate()
    let mes = data.getMonth() + 1 < 10?"0"+data.getMonth():data.getMonth()+1
    let ano = data.getFullYear()
    let hora = data.getHours() <10?"0"+data.getHours():data.getHours()
    let minutos = data.getMinutes() < 10?"0"+data.getMinutes():data.getMinutes()
    let fullHora =  `${hora}:${minutos}`
    let fullData =  `${dia}/${mes}/${ano}`

    function jsonOrNot  (variavel){
        let done
        try {
            JSON.parse(variavel)
            done = true
        } catch (error) {
            done = false
        }
        return done
    }

    const rncData = {
        _id: `${e.getAttribute('data-_id')}`,
        data: `${e.getAttribute('data-data')}`,
        hora:` ${e.getAttribute('data-hora')}`,
        setorAutuante: JSON.parse(e.getAttribute('data-setorautuante')),
        descricao:e.getAttribute('data-descricao'),
        origem: `${e.getAttribute('data-origem')}`,
        nivelSeveridade: `${e.getAttribute("data-nivelseveridade")}`,
        status: `${e.getAttribute('data-status')}`,
        enquadramento: JSON.parse(e.getAttribute('data-enquadramento')),
        acaoImediata:e.getAttribute('data-acaoImediata'),
        setorAtuar: JSON.parse(e.getAttribute('data-setoratuar')),
        investigacao:e.getAttribute('data-investigacao'),
        criador:JSON.parse(e.getAttribute('data-criador')),
        anexos:`${e.getAttribute('data-anexos')}`,
        linhaDoTempo: JSON.parse(e.getAttribute('data-linhaDoTempo')),
        pessoasAnexadas: JSON.parse(e.getAttribute('data-pessoasAnexadas')),
        quem: jsonOrNot(e.getAttribute('data-quem'))?JSON.parse(e.getAttribute('data-quem')):e.getAttribute('data-quem'),
        oque:e.getAttribute('data-oque'),
        quando:e.getAttribute('data-quando'),
        onde:e.getAttribute('data-onde'),
        como:e.getAttribute('data-como'),
        porque:e.getAttribute('data-porque'),
        custo:e.getAttribute('data-custo'),
        evidenciasAndamentos:e.getAttribute('data-evidenciasandamentos'),
        tipo:e.getAttribute('data-tipo'),
        avaliacaoDeAcao: jsonOrNot(e.getAttribute('data-avaliacaodeacao'))?JSON.parse(e.getAttribute('data-avaliacaodeacao')):e.getAttribute('data-avaliacaodeacao'),
        acaoDaEficacia:e.getAttribute('data-acaodaeficacia'),
        dataPrevista:e.getAttribute('data-dataPrevista'),
        arquivosComprovarEficiencia:e.getAttribute('data-arquivoscomprovareficiencia')
    };

    console.log(rncData)

    let {linhaDoTempo} = rncData
    DivlinhaDoTempo.innerHTML = ''
    linhaDoTempo.map((mudanca,index)=>{
        let div = document.createElement('div')
        div.classList.add('itemLinhaDoTempo')
        div.innerHTML = `
            <div class="conteudoLinhaDoTempo">
                <p>${mudanca.data} - ${mudanca.hora}<br>${index  == 0?'Aberto por ' + mudanca.criador.nome:mudanca.criador.nome + " "+ mudanca.acao}</p>
            </div>
        `
        DivlinhaDoTempo.appendChild(div)
    })
    rncData.anexos = rncData.anexos.split(',')
    bodyTabelaRnc.innerHTML = ''
    rncData.anexos?.map((anexo)=>{
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${anexo}</td>
            <td>${e.getAttribute("data-data")}</td>
            <td>
                <button class="verBtn">Ver</button>
                <button class="aceitarBtn">Aceitar</button>
                <button class="recusarBtn">Recusar</button>
            </td>
        `

        bodyTabelaRnc.appendChild(tr)
    })
    document.getElementById("rncNumber").textContent = rncData._id;
    document.querySelector('#data-hora').value = rncData.data + " - " + rncData.hora;
    document.querySelector('#origem').value = rncData.origem;
    document.querySelector('#setor-autuante').value = rncData.setorAutuante.nome
    document.querySelector('#enquadramento').value = rncData.enquadramento
    const dataPrevistaConclusao = document.querySelector('#dataPrevista')
    dataPrevistaConclusao.value = rncData.dataPrevista

    const acaoEficacia = document.getElementsByName('acaoEficacia')
    acaoEficacia.forEach((currentAcaoEficacia)=>{
        if(currentAcaoEficacia.value == rncData.acaoDaEficacia)
            currentAcaoEficacia.checked = true
    })
    const tipo = document.getElementsByName('tipoRnc')
    tipo.forEach((currentTipo)=>{
        if(currentTipo.value == rncData.tipo)
            currentTipo.checked = true
    })
    const setorAtuar = document.querySelector('#setor-atuar')
    setorAtuar.value = rncData.setorAtuar == null ?  rncData.setorAtuar : rncData.setorAtuar._id
    const severidade = document.querySelector('#severidade')
    severidade.value = rncData.nivelSeveridade
    const status = document.querySelector('#status')
    status.value = rncData.status
    inputComo.value = rncData.como == "null" ? null : rncData.como
    inputCusto.value = rncData.custo
    inputOnde.value = rncData.onde == "null" ? null : rncData.onde
    inputOque.value = rncData.oque == "null" ? null : rncData.oque
    inputPorque.value = rncData.porque == "null" ? null : rncData.porque
    inputQuando.value = rncData.quando
    const checkboxes = document.querySelectorAll(".eficaciaRnc")
    const inputAvalicaoAcao = document.getElementById("tipoRncText")
    const envidenciaDeEficacia = document.querySelector('#envidenciaDeEficacia')

    checkboxes.forEach((checkBoxAvalicaoAcao)=>{
        if(rncData.avaliacaoDeAcao != null){
            rncData.avaliacaoDeAcao.map((acao)=>{
                if(checkBoxAvalicaoAcao.value == acao){
                    checkBoxAvalicaoAcao.checked = true
                }else if(acao != 'Documental' && acao != 'Visual' && acao != 'Entrevista' &&  acao != undefined &&  acao != null){
                    inputAvalicaoAcao.value = acao
                }
            })
        }
    })
    const newSaveBtn = saveBtn.cloneNode(true); // Clona o botão para remover os eventos antigos
    if(rncData.status == 'analise'){
        newSaveBtn.textContent = 'Aceitar'
    }
    else{
        newSaveBtn.textContent = 'Salvar'
    }
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);  // Substitui o botão antigo
    
    // sistema de botão tabs
    if(rncData.setorAtuar == null){
        andamentoBtn.disabled = true
    }else{
        andamentoBtn.disabled = false
    }
    if(rncData.quem == null){
        conclusaoBtn.disabled = true
    }else{
        conclusaoBtn.disabled = false
    }

    let funcioanriosSetorAtuar = funcionarios.filter((funcionario)=> funcionario.departamento.sigla == rncData.setorAtuar?.sigla)

    function checkChangeInBackForm (){
        let changes = false
            let tipoMark
            const isTextInputFilled = inputAvalicaoAcao.value.trim() !== ""
            tipo.forEach((currentTipo)=>{
                if(currentTipo.checked){
                    tipoMark = currentTipo.value
                }
            })
            
            if(atualActive == 'detalhamento'){
                if(rncData.tipo != tipoMark){
                    changes = true
                }
                
                if(rncData.setorAtuar?._id != setorAtuar.value){
                    changes = true
                }
    
                if(rncData.nivelSeveridade != severidade.value){
                    changes = true 
                }
                
                if(rncData.status != status.value){
                    changes =  true
                }
            }else if(atualActive == 'andamento'){
                if(inputOque.value==""?null:inputOque.value != rncData.oque){
                    changes = true
                }
                if(selectQuem.value ==""?null:selectQuem.value != rncData.quem?._id){
                    changes = true
                    console.log('aqui')
                }
    
                if(inputQuando.value ==""?null:inputQuando.value != rncData.quando){
                    changes = true
                    console.log('aqui') 
                }
    
                if(inputOnde.value==""?null:inputOnde.value != rncData.onde){
                    changes = true
                    console.log('aqui')
                }
    
                if(inputComo.value==""?null:inputComo.value != rncData.como){
                    changes = true
                    console.log('aqui')
                }
    
                if(inputPorque.value==""?null:inputPorque.value != rncData.porque){
                    changes = true
                    console.log('aqui')
                }
    
                if(inputCusto.value == ""?null:inputCusto.value != rncData.custo){
                    changes = true
                    console.log('aqui')
                }
    
                if(inputEvid.value){
                    changes = true
                    console.log('aqui')
                }
            }else if(atualActive == 'conclusao'){
                let avaliacaoDeAcao = []
    
                if(isTextInputFilled)
                   avaliacaoDeAcao.push(inputAvalicaoAcao.value.trim())
        
                checkboxes.forEach((checkbox)=>{
                    if(checkbox.checked)
                        avaliacaoDeAcao.push(checkbox.value)
                })
        
                if(!arraysAreEqualUnordered(avaliacaoDeAcao,rncData.avaliacaoDeAcao)){
                    changes = true
                    console.log('aqui')
                }
                
                let acaoDaEficacia = "null"
        
                acaoEficacia.forEach((radioAcao)=>{
                    if(radioAcao.checked)
                        acaoDaEficacia = radioAcao.value
                })
        
                if(rncData.acaoDaEficacia != acaoDaEficacia){
                    changes = true
                }
                let dataPrevista = rncData.dataPrevista == 'null'?'':rncData.dataPrevista
                if(dataPrevistaConclusao.value != dataPrevista){
                    changes = true                
                }
        
                // if(envidenciaDeEficacia.value){
                //     changes = true
                // }
            }
    
            if(!changes) // se não tiver mudanças ele retorna
                return
    
            alert('Lembre-se você não salvou as alterações do formulario anterior')
    }

    if(rncData.status != 'analise'){
        detalhamentoRncBtn.addEventListener('click',checkChangeInBackForm)
        andamentoBtn.addEventListener('click',checkChangeInBackForm)
        conclusaoBtn.addEventListener('click',()=>{
            newSaveBtn.innerText = "Concluir"
            checkChangeInBackForm
        })
    }else{
        detalhamentoRncBtn.removeEventListener('click',checkChangeInBackForm)
    }


    funcioanriosSetorAtuar?.map((funcionarioSetorAtuar)=>{
        const options = document.createElement('option')
        options.value = funcionarioSetorAtuar._id
        options.innerText = `${funcionarioSetorAtuar.nome} - ${funcionarioSetorAtuar.departamento.sigla}` 
        selectQuem.appendChild(options)
    })
    selectQuem.value = rncData.quem?._id
    newSaveBtn.addEventListener('click', async ()=>{
        if(status.value){
            status.set
        } 

        let active = null

        document.querySelectorAll('.tab-content').forEach((element)=>{
            if(element.className.includes('active')){
                active = element
            }
        })

        let formSelect = active.getAttribute('id')

        const isAnyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked)
        const isTextInputFilled = inputAvalicaoAcao.value.trim() !== ""
        
        if(formSelect == 'conclusao'){
            if (!isAnyCheckboxChecked && !isTextInputFilled) {
                checkboxes.forEach((checkbox)=> checkbox.setCustomValidity("Selecione uma das opções"))
                inputAvalicaoAcao.setCustomValidity("Selecione uma das opções")
            }else{
                checkboxes.forEach((checkbox)=> checkbox.setCustomValidity(""))
                inputAvalicaoAcao.setCustomValidity("")
            }
        }

        if(status.value == 'analise' && rncData.status == 'analise'){
            status.setCustomValidity("RNC não pode ser aceita com status em Análise")
        }else{
            status.setCustomValidity("")
        }

        if(status.value == 'analise' && rncData.status != 'analise'){
            status.setCustomValidity("RNC não pode ter status alterado para em Análise")
        }else{
            status.setCustomValidity("")
        }

        if(!active.reportValidity())
            return

        let tipoMark

        tipo.forEach((currentTipo)=>{
            if(currentTipo.checked){
                tipoMark = currentTipo.value
            }
        })

        if(formSelect == "detalhamento" && rncData.nivelSeveridade == "null"){
            let newRnc = {
                idSolicitacaoRnc:rncData._id,
                tipo:tipoMark,
                setorAtuar:setorAtuar.value,
                nivelSeveridade:severidade.value,
                status:status.value,
                user
            }
            
            await hendleSetRnc(newRnc)
            return

        }

        if(formSelect == "detalhamento" && rncData.nivelSeveridade != "null"){
            let changes = []
            
            let changeRnc = {
                idRnc:rncData._id,
                user
            } 

            if(rncData.tipo != tipoMark){
                changes.push({tipo:tipoMark})
            }
            
            if(rncData.setorAtuar._id != setorAtuar.value){
                console.log(setorAtuar.value)
                changes.push({setorAtuar:setorAtuar.value})
            }

            if(rncData.nivelSeveridade != severidade.value){
                changes.push({nivelSeveridade:severidade.value})
            }

            if(rncData.status != status.value){
                changes.push({status:status.value})
            }

            if(changes.length == 0) // se não tiver mudanças ele retorna
                return

            changes.map((change)=>{
                let key = Object.keys(change)[0]
                
                changeRnc[key] = change[key]
            })

            await changeDetalhamentoRnc(changeRnc)
            return
        }

        if(formSelect == 'andamento' && rncData.quem == null || rncData.quem == "null"){
            const body = {
                idRnc:rncData._id,
                user,
                oque:inputOque.value,
                quem:selectQuem.value,
                quando:inputQuando.value,
                onde:inputOnde.value,
                como:inputComo.value,
                porque:inputPorque.value,
                custo:inputCusto.value,
                evidenciasAndamentos:[]
            }

            await handleAdd5w2h(body)
            return
        }

        if(formSelect == 'andamento' && rncData.quem != null && rncData.quem != "null"){
            const body = {
                idRnc:rncData._id,
                user,
            }
            const mudancas = []

            if(inputOque.value != rncData.oque){
                mudancas.push({oque:inputOque.value})
            }

            if(selectQuem.value != rncData.quem._id){
                mudancas.push({quem:selectQuem.value})
            }

            if(inputQuando.value != rncData.quando){
                mudancas.push({quando:inputQuando.value})   
            }

            if(inputOnde.value != rncData.onde){
                mudancas.push({onde:inputOnde.value})
            }

            if(inputComo.value != rncData.como){
                mudancas.push({como:inputComo.value})
            }

            if(inputPorque.value != rncData.porque){
                mudancas.push({porque:inputPorque.value})
            }

            if(inputCusto.value != rncData.custo ){
    
                mudancas.push({custo:inputCusto.value})
            }

            if(inputEvid.value){
                mudancas.push({evidenciasAndamentos:['provas.png']})
            }

            if(mudancas.length == 0) // se não tiver mudanças ele retorna
                return

            // mudancas.push({linhaDoTempo:newLinhaDoTempo})

            mudancas.map((change)=>{
                let key = Object.keys(change)[0]
                e.setAttribute(`data-${key}`,change[key])
                body[key] = change[key]
            })

    
            await handleEdit5w2h(body)
            return
        }

        if(formSelect == 'conclusao'){
            let avaliacaoDeAcao = []
            if(isTextInputFilled)
                avaliacaoDeAcao.push(inputAvalicaoAcao.value.trim())

            checkboxes.forEach((checkbox)=>{
                if(checkbox.checked)
                    avaliacaoDeAcao.push(checkbox.value)
            })
            
            let acaoDaEficacia

            acaoEficacia.forEach((radioAcao)=>{
                if(radioAcao.checked)
                    acaoDaEficacia = radioAcao.value
            })

            const body = {
                idRnc:rncData._id,
                user,
                avaliacaoDeAcao,
                acaoDaEficacia,
                arquivosComprovarEficiencia:['documento'],
                dataPrevista:dataPrevistaConclusao.value
            }

            await handleConclusao(body)
            return
        }


        return
    })
    modal.style.display = "flex";
}

function reloadCard(rnc) {
    const card = document.createElement('div');
    // if(typeof rnc.linhaDoTempo == 'string')
    //     rnc.linhaDoTempo = JSON.parse(rnc.linhaDoTempo)
    Object.entries(rnc).forEach(([key, value]) => {
        if(key === 'linhaDoTempo' || key === 'pessoasAnexadas' || key === 'enquadramento' || key === 'criador' || key === 'setorAutuante' || key === 'setorAtuar' || key === 'quem' || key === "avaliacaoDeAcao"){
            card.setAttribute(`data-${key}`, JSON.stringify(value))
        }else
            card.setAttribute(`data-${key}`, value)
    })
    card.className = 'kanban-card';
    card.setAttribute('draggable',"true")
    card.draggable = true;
    card.innerHTML = `
                <div class="card-priority">${rnc?.nivelSeveridade!=null?rnc.nivelSeveridade:'analise'}</div>
                <div class="card-title">${rnc.enquadramento.length > 1?rnc.enquadramento[0] +" +"+rnc.enquadramento.length :rnc.enquadramento}</div>
                <div class="card-description">Aberto por:  ${rnc.criador.nome}</div>
                <div class="card-description">Departamento: ${rnc.setorAutuante.nome}</div>
                <div class="card-description">${rnc.data} - ${rnc.hora}</div>
                <div class="card-footer">
                    <div class="assignees">
                        ${rnc.pessoasAnexadas?.map(pessoas => 
                        `<div class="assignee" title="${pessoas.nome}">${pessoas.avatar}</div>`
                    ).join('')}
                    </div>
                </div>
            
    `;

    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('dblclick', ()=>openModalOnDoubleClick(card));
    card.addEventListener('touchstart',handleTouchMoveStart)
    card.addEventListener('touchend', handleTouchMoveEnd)
    card.addEventListener('touchstart',(evt)=>{
        handleDoubleTouch(evt,()=>openModalOnDoubleClick(card))
    })

    return card;
}

function modificandoRncPeloId (divRnc) {
    let array = rnc
    let modificacao = false
    array?.map((indexRnc)=>{
        if(indexRnc._id == divRnc.getAttribute('data-_id')){
            if(indexRnc.status != divRnc.getAttribute('data-status')){
                indexRnc.status = divRnc.getAttribute('data-status')
                indexRnc.linhaDoTempo = JSON.parse(divRnc.getAttribute('data-linhaDoTempo'))
                indexRnc.pessoasAnexadas = JSON.parse(divRnc.getAttribute('data-pessoasAnexadas'))
                modificacao = true
            }
        }
    })
    console.log(modificacao)
    if(modificacao){
        rnc = array
    }
}

function arraysAreEqualUnordered(arr1, arr2) {
    if (arr1.length !== arr2.length) return false
  
    const sortedArr1 = [...arr1].sort()
    const sortedArr2 = [...arr2].sort()
  
    return sortedArr1.every((value, index) => value === sortedArr2[index])
}

function updateColumnCounts() {
    columns.forEach(column => {
        let filhos = column.children.length
        column.parentNode.parentNode.querySelector('.column-count').innerText = filhos
    });
}