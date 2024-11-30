// Modal
const modal = document.getElementById("rncDetailsModal");
const closeBtn = document.getElementsByClassName("close")[0];
const metodoOutroTexto = document.getElementById("metodoOutroTexto");
const modalFooter = document.querySelector('.modal-footer')
const modalBody = document.querySelector('.modalBody')
const bodyTabelaRnc = document.querySelector('#bodyTabelaRNC')
const bodyEvidenciasAndamento = document.querySelector('#bodyEvidenciasAndamento')
const bodyAnexoComprovarEficacia = document.querySelector('#bodyAnexoComprovarEficacia')
const DivlinhaDoTempo = document.querySelector('.linhaDoTempo')
const detalhesRncDoModal = document.querySelector('.detalhesRncDoModal')
const btnFormulario = document.querySelector('#btnFormulario')
const btnLinhaDoTempo = document.querySelector('#btnLinhaDoTempo')
const cxEntradaBtn = document.querySelector('#cxEntradaBtn')
const setorAtuar = document.querySelector('#setor-atuar')

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
console.log(user)
if(user != null)
    user = JSON.parse(user)

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

// pegando funcionarios

if(user == null)
    window.location.href = 'index.html';

const nome = document.querySelector('#nome')
nome.innerText = user.nome?showName(user.nome):'xxxx'

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

async function handleGetSolicitacao (){
    try {
        const solicitacaoJson = await fetch(`http://localhost:3333/solicitacaoRnc/${user._id}`)
        const solicitacao = await solicitacaoJson.json()
        return solicitacao
    } catch (error) {
        console.log(error)
    }
}

async function handleIndeferidaParaRnc (body){
    try {
        const responseJson = await fetch("http://localhost:3333/rncIndefirida/voltarRnc",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
        })

        const response = await responseJson.json()
        console.log(response)
        if(responseJson.status == 201){
            alert(response.message)
        }

        console.log(response)
        return response.insertedId
    } catch (error) {
        console.log(error)
    }
}

async function handleGetDepartamentosAtivos(){
    try {
        const responseJson = await fetch("http://localhost:3333/departamento/ativos")
        const response = await responseJson.json()
        response.map((departamento)=>{
            const options = document.createElement('option')
            options.value = departamento._id
            options.innerText = departamento.nome
            setorAtuar.appendChild(options)
        })

        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

handleGetDepartamentosAtivos()

async function handleGetRncIndefiridas (){
    try {
        const rncIndefiridasJson = await fetch(`http://localhost:3333/rncIndefirida/${user._id}`)
        const rncIndefiridas = await rncIndefiridasJson.json()
        return rncIndefiridas
    } catch (error) {
        console.log(error)
    }
}

async function handleSetIndefirida (body){
    try {
        const responseJson = await fetch('http://localhost:3333/rncIndefirida/add',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
        })

        let response = await responseJson.json()


        if(responseJson.status === 201){
            alert('Conformidade mudada para indefirida')
            return response.insertedId
        }

        console.log(response)

    } catch (error) {
        console.log(error)
    }
}

async function handleGetRnc (){
    try {
        const rncJson = await fetch(`http://localhost:3333/rnc/${user._id}`)
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
    const formData = new FormData()
    for (let i = 0; i < inputEvid.files.length; i++) {
        formData.append('evidenciasAndamentos', inputEvid.files[i])
    }
    formData.append('json',JSON.stringify(body))
    try {
        const respostaJson = await fetch('http://localhost:3333/rnc/add5w2h',{
            method:"PATCH",
            body:formData
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

async function handleIndeferidaParaRncEditando (body){
    try {
        const respostaJson = await fetch('http://localhost:3333/rncIndefirida/voltarRncEditando',{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(body)
        })

        let response = await respostaJson.json()
        console.log(response)
        if(respostaJson.status == 200){
            alert(response.message)
            window.location.reload(true)
            return
        }
    } catch (error) {
        console.log(error)
    }
}

async function handleEdit5w2h (body){
    const formData = new FormData()
    for (let i = 0; i < inputEvid.files.length; i++) {
        formData.append('evidenciasAndamentos', inputEvid.files[i])
    }
    formData.append('json',JSON.stringify(body))
    try {
        const respostaJson = await fetch('http://localhost:3333/rnc/edit5w2h',{
            method:"PATCH",
            body:formData
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
    const formData = new FormData()
    for (let i = 0; i < envidenciaDeEficacia.files.length; i++) {
        formData.append('arquivosComprovarEficiencia', envidenciaDeEficacia.files[i])
    }
    formData.append('json',JSON.stringify(body))
    try {   
        const respostaJson = await fetch('http://localhost:3333/rncConcluidas/conclusao',{
            method:"POST",
            body:formData
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

async function handleRecusarAnexo (body){
    try {
        const responseJson = await fetch("http://localhost:3333/solicitacaoRnc/recusarAnexo",{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(body)
        })

        const response = await responseJson.json()
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

async function handleRecusarAnexoRnc (body){
    try {
        const responseJson = await fetch("http://localhost:3333/rnc/recusarAnexo",{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(body)
        })

        const response = await responseJson.json()
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

async function handleRecusarEvidenciaAndamento (body){
    try {
        const responseJson = await fetch("http://localhost:3333/rnc/recusarEvidenciaAndamento",{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(body)
        })

        const response = await responseJson.json()
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

async function handleGetRncConcluidas (){
    try {
        const concluidasJson = await fetch(`http://localhost:3333/rncConcluidas/${user._id}`)
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

// sistema para deixar o navPrincipal normal 
btnExitCouver.addEventListener('click',()=>{
    navPrincipal.classList.remove('couver')
    document.querySelector('.kanban-board').classList.remove('cursorNormal')
})

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
    let rncIndefiridas = await handleGetRncIndefiridas() 
   
    rnc.push(...rncSolicitadas)
    rnc.push(...rncAceitas)
    rnc.push(...rncConcluidas)
    rnc.push(...rncIndefiridas)
    
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

    rnc?.map((elementoRnc)=>{
        divsKanban.forEach((div)=>{
            if(div.getAttribute('data-column') == elementoRnc.status){
                div.appendChild(reloadCard(elementoRnc))
            }
        })
    })

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

async function handleTouchMoveEnd (evt) {
    enableScroll()
    const date = new Date()
    const dia = date.getDate()<10?"0"+date.getDate():date.getDate()
    const mes = date.getMonth()+1<10?'0'+date.getMonth()+1:date.getMonth()+1
    const fullYear = date.getFullYear()
    const data = `${dia}/${mes}/${fullYear}`
    let hora = date.getHours()<10?"0"+date.getHours():date.getHours()
    let minuto = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()
    const fullHora = `${hora}:${minuto}`
    evt.target.classList.remove('dragging')
    const touch = evt.changedTouches[0]
    const targetColumn = document.elementFromPoint(touch.clientX , touch.clientY).getAttribute('data-column')
    const element = document.elementFromPoint(touch.clientX , touch.clientY)
    const rncStatus = draggedCard.getAttribute('data-status')
    let idRnc = draggedCard.getAttribute('data-_id')
    let message = {
        criador:user,
        acao:null,
        data,
        hora:fullHora
    }
    if(rncStatus != 'analise' && rncStatus != 'concluido' && targetColumn != "concluido" && targetColumn != 'analise' && targetColumn != 'indeferido' && rncStatus != 'indeferido'){
        draggedCard.setAttribute('data-status',targetColumn)
        const body = {
            idRnc,
            status:targetColumn,
            user
        }
        message.acao = `Alterou o status para ${targetColumn}`
        element.appendChild(draggedCard)
        console.log(targetColumn)
        draggedCard.setAttribute('data-status',targetColumn)
        let linhaDoTempo = JSON.parse(draggedCard.getAttribute('data-linhadotempo'))
        linhaDoTempo.push(message)
        draggedCard.setAttribute('data-linhadotempo',JSON.stringify(linhaDoTempo))
        handleChangeStatus(body)
        modificandoRncPeloId(draggedCard) 
        updateColumnCounts()
        atualizandoRnc()
        alert(`Status alterado para ${targetColumn}`)
        return
        }else if(targetColumn == "concluido"){
            alert('Para concluir a RNC é necessario abrir o modal e preencher o formulario')
        }else if(rncStatus == 'concluido'){
            alert('Par modificar o status da RNC é necessario que ela não esteja como concluida')
        }else if(targetColumn == "analise" && rncStatus != 'analise'){
            alert('RNC não pode ter status em análise')
        }else if(targetColumn == 'indeferido'){
            let body = {
                idRnc,
                user
            }
            message.acao = `Marcou Rnc como indeferida`
            element.appendChild(draggedCard)
            draggedCard.setAttribute('data-status','indeferido')
            draggedCard.setAttribute('data-nivelseveridade','indeferido')
            let linhaDoTempo = JSON.parse(draggedCard.getAttribute('data-linhadotempo'))
            linhaDoTempo.push(message)
            draggedCard.setAttribute('data-linhadotempo',JSON.stringify(linhaDoTempo))
            let newId = await handleSetIndefirida(body)
            draggedCard.setAttribute('data-_id',newId)
            rnc.map((indexRnc)=>{
                if(indexRnc._id == idRnc){
                    indexRnc._id = newId
                }
            })
            modificandoRncPeloId(draggedCard)
            updateColumnCounts()
            atualizandoRnc()
            return
        }else if(rncStatus == 'indeferido'){
            let body = {
                idRncIndefirida:idRnc,
                user,
                status:targetColumn
            }
            const newId = await handleIndeferidaParaRnc(body)
            draggedCard.setAttribute('data-_id', newId)
            draggedCard.setAttribute('data-status', targetColumn)
            modificandoRncPeloId(draggedCard)
            updateColumnCounts()
            atualizandoRnc()
            return
        }
        else{
            alert('Para modificar o status da RNC é necessario aceitar a solicitação')
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

async function handleDragEnd(e) {
    const date = new Date()
    const dia = date.getDate()<10?"0"+date.getDate():date.getDate()
    const mes = date.getMonth()+1<10?'0'+date.getMonth()+1:date.getMonth()+1
    const fullYear = date.getFullYear()
    const data = `${dia}/${mes}/${fullYear}`
    let hora = date.getHours()<10?"0"+date.getHours():date.getHours()
    let minuto = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()
    const fullHora = `${hora}:${minuto}`
    this.classList.remove('dragging');
    let element = e.target.parentNode
    let targetColumn = element.getAttribute('data-column')
    const rncStatus = draggedCard.getAttribute('data-status')
    let idRnc = draggedCard.getAttribute('data-_id')
    let message = {
        criador:user,
        acao:null,
        data,
        hora:fullHora
    }
    if(rncStatus != 'analise' && rncStatus != 'concluido' && targetColumn != "concluido" && targetColumn != 'analise' && targetColumn != 'indeferido' && rncStatus != 'indeferido'){
        draggedCard.setAttribute('data-status',targetColumn)
        const body = {
            idRnc,
            status:targetColumn,
            user
        }
        message.acao = `Alterou o status para ${targetColumn}`
        element.appendChild(draggedCard)
        draggedCard.setAttribute('data-status',targetColumn)
        console.log(targetColumn)
        let linhaDoTempo = JSON.parse(draggedCard.getAttribute('data-linhadotempo'))
        linhaDoTempo.push(message)
        draggedCard.setAttribute('data-linhadotempo',JSON.stringify(linhaDoTempo))
        handleChangeStatus(body)
        modificandoRncPeloId(draggedCard) 
        updateColumnCounts()
        atualizandoRnc()
        alert(`Status alterado para ${targetColumn}`)
        return
    }else if(targetColumn == "concluido"){
        alert('Para concluir a RNC é necessario abrir o modal e preencher o formulario')
    }else if(rncStatus == 'concluido'){
        alert('Par modificar o status da RNC é necessario que ela não esteja como concluida')
    }else if(targetColumn == "analise" && rncStatus != 'analise'){
        alert('RNC não pode ter status em análise')
    }else if(targetColumn == 'indeferido'){
        let body = {
            idRnc,
            user
        }
        message.acao = `Marcou Rnc como indeferida`
        element.appendChild(draggedCard)
        draggedCard.setAttribute('data-status','indeferido')
        draggedCard.setAttribute('data-nivelseveridade','indeferido')
        let linhaDoTempo = JSON.parse(draggedCard.getAttribute('data-linhadotempo'))
        linhaDoTempo.push(message)
        draggedCard.setAttribute('data-linhadotempo',JSON.stringify(linhaDoTempo))
        let newId = await handleSetIndefirida(body)
        draggedCard.setAttribute('data-_id',newId)
        rnc.map((indexRnc)=>{
            if(indexRnc._id == idRnc){
                indexRnc._id = newId
            }
        })
        modificandoRncPeloId(draggedCard)
        updateColumnCounts()
        atualizandoRnc()
        console.log('aaaa')
        return
    }else if(rncStatus == 'indeferido'){
        let body = {
            idRncIndefirida:idRnc,
            user,
            status:targetColumn
        }
        const newId = await handleIndeferidaParaRnc(body)
        draggedCard.setAttribute('data-_id', newId)
        draggedCard.setAttribute('data-status', targetColumn)
        modificandoRncPeloId(draggedCard)
        updateColumnCounts()
        atualizandoRnc()
        return
    }
    else{
        alert('Para modificar o status da RNC é necessario aceitar a solicitação')
    }
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
    if(user.permissao == "User")
        return
    document.body.style = 'overflow:hidden;'
    console.log(e)
    const saveBtn = document.getElementById("saveBtn");
    console.log(funcionarios)
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
        anexos:jsonOrNot(e.getAttribute('data-anexos'))?JSON.parse(e.getAttribute('data-anexos')):e.getAttribute('data-anexos'),
        linhaDoTempo: JSON.parse(e.getAttribute('data-linhaDoTempo')),
        pessoasAnexadas: JSON.parse(e.getAttribute('data-pessoasAnexadas')),
        quem: jsonOrNot(e.getAttribute('data-quem'))?JSON.parse(e.getAttribute('data-quem')):e.getAttribute('data-quem'),
        oque:e.getAttribute('data-oque'),
        quando:e.getAttribute('data-quando'),
        onde:e.getAttribute('data-onde'),
        como:e.getAttribute('data-como'),
        porque:e.getAttribute('data-porque'),
        custo:e.getAttribute('data-custo'),
        evidenciasAndamentos:jsonOrNot(e.getAttribute('data-evidenciasandamentos'))?JSON.parse(e.getAttribute('data-evidenciasandamentos')):e.getAttribute('data-evidenciasandamentos'),
        tipo:e.getAttribute('data-tipo'),
        avaliacaoDeAcao: jsonOrNot(e.getAttribute('data-avaliacaodeacao'))?JSON.parse(e.getAttribute('data-avaliacaodeacao')):e.getAttribute('data-avaliacaodeacao'),
        acaoDaEficacia:e.getAttribute('data-acaodaeficacia'),
        dataPrevista:e.getAttribute('data-dataPrevista'),
        arquivosComprovarEficiencia:jsonOrNot(e.getAttribute('data-arquivoscomprovareficiencia'))?JSON.parse(e.getAttribute('data-arquivoscomprovareficiencia')):e.getAttribute('data-arquivoscomprovareficiencia')
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
    
    bodyTabelaRnc.innerHTML = ''
    rncData.anexos?.map((anexo)=>{
        const tr = document.createElement('tr')
        const td = document.createElement('td')
        const btnVer= document.createElement('button')
        btnVer.innerText = 'Ver'
        btnVer.classList.add('verBtn')
        btnVer.type = 'button'
        btnVer.addEventListener('click',()=>{
            window.open(anexo.path,'_blank')
        })
        const btnRecusar = document.createElement('button')
        btnRecusar.innerText = 'Recusar'
        btnRecusar.classList.add('recusarBtn')
        btnRecusar.type = 'button'
        btnRecusar.addEventListener('click', async (evt)=>{
        
            evt.target.parentNode.parentNode.remove()
            rncData.anexos = rncData.anexos.filter((currentAnexo)=> currentAnexo.filename != anexo.filename)
            console.log(rncData.anexos)
            e.setAttribute('data-anexos', JSON.stringify(rncData.anexos))
            if(rncData.status == 'analise'){
                let body = {
                    fileName:anexo.filename,
                    idSolicitacaoRnc:rncData._id
                }
                await handleRecusarAnexo(body)
            }else{
                let body = {
                    nameFile:anexo.filename,
                    idRnc:rncData._id
                }
                await handleRecusarAnexoRnc(body)
                console.log(body)
            }
        })
        td.appendChild(btnVer)
        td.appendChild(btnRecusar)

        tr.innerHTML = `
            <td>${anexo.originalname}</td>
            <td>${e.getAttribute("data-data")}</td>
        `

        tr.appendChild(td)

        bodyTabelaRnc.appendChild(tr)
    })

    rncData.evidenciasAndamentos?.map((evidencias)=>{
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${evidencias.filename}</td>
            <td>27/09/2024 - 15:15h</td>
        `
        const btnVer = document.createElement('button')
        btnVer.innerText = 'Ver'
        btnVer.type = 'button'
        btnVer.classList.add('verBtn')
        btnVer.addEventListener('click',()=>{
            window.open(evidencias.path,"_blank")
        })

        const btnRecusar = document.createElement('button')
        btnRecusar.innerText = "Recusar"
        btnRecusar.type = 'button'
        btnRecusar.classList.add('recusarBtn')
        btnRecusar.addEventListener('click', async (evt)=>{
            let body = {
                idRnc:rncData._id,
                nameFile:evidencias.filename
            }
            evt.target.parentNode.parentNode.remove()
            rncData.evidenciasAndamentos = rncData.evidenciasAndamentos.filter((currentAnexo)=> currentAnexo.filename != evidencias.filename)
            console.log(rncData.evidenciasAndamentos)
            e.setAttribute('data-evidenciasandamentos', JSON.stringify(rncData.evidenciasAndamentos))

            await handleRecusarEvidenciaAndamento(body)
        })

        let td = document.createElement('td')
        td.appendChild(btnVer)
        td.appendChild(btnRecusar)
        tr.appendChild(td)
        bodyEvidenciasAndamento.appendChild(tr)
        console.log(bodyEvidenciasAndamento)
    })

    rncData.arquivosComprovarEficiencia?.map(async (arquivoComprovar)=>{
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${arquivoComprovar.originalname}</td>
            <td>27/09/2024 - 15:15h</td>
        `
        const btnVer = document.createElement('button')
        btnVer.innerText = 'Ver'
        btnVer.type = 'button'
        btnVer.classList.add('verBtn')
        btnVer.addEventListener('click',()=>{
            window.open(arquivoComprovar.path,"_blank")
        })
        let td = document.createElement('td')
        td.appendChild(btnVer)
        tr.appendChild(td)
        bodyAnexoComprovarEficacia.appendChild(tr)        
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
    // inputEvid.files = rncData.evidenciasAndamentos
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
    if(rncData.setorAtuar == null || rncData.nivelSeveridade.toString() == 'null' || rncData.status == 'indeferido' || rncData.nivelSeveridade == 'indeferido'){
        andamentoBtn.disabled = true
    }else{
        andamentoBtn.disabled = false
    }
    if(rncData.quem == null || rncData.nivelSeveridade.toString() == 'null' ||  rncData.status == 'indeferido' || rncData.nivelSeveridade == 'indeferido'){
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
    
                if(inputEvid.length > 0){
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
                    console.log('aqui')
                }
                let dataPrevista = rncData.dataPrevista == 'null'?'':rncData.dataPrevista
                if(dataPrevistaConclusao.value != dataPrevista){
                    changes = true                
                    console.log('aqui')
                }

                if(envidenciaDeEficacia.files.length > 0){
                    changes = true
                    console.log('aqui')
                }
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
        }else if(status.value == 'analise' && rncData.status != 'analise'){
            status.setCustomValidity("RNC não pode ter status alterado para em Análise")
        }
        else{
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


        if(formSelect == "detalhamento" && rncData.nivelSeveridade == "null"  && rncData.status == "analise" && status.value != 'indeferido'){
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

        if(formSelect == "detalhamento" && rncData.status == 'indeferido' && rncData.nivelSeveridade == "indeferido"){
            let body = {
                idIndeferida:rncData._id,
                tipo:tipoMark,
                setorAtuar:setorAtuar.value,
                nivelSeveridade:severidade.value,
                status:status.value,
                user
            }

            console.log('aa')


            if(body.status == "indeferido"){
                alert('Mude o status para a mudança ser salva')
                return
            }
            
            console.log(body)

            await handleIndeferidaParaRncEditando(body)
            return
        }

        if(formSelect == "detalhamento" && status.value == 'indeferido'){
            const body = {
                user,
                idRnc:rncData._id
            }

            console.log('aaaa')

            let done = await handleSetIndefirida(body)
            if(done)
                window.location.reload(true)
            return
        }

        if(formSelect == "detalhamento" && (rncData.nivelSeveridade.toString() != "null" || rncData.status.toString() != 'null' || rncData.tipo.toString() != 'null' || rncData.setorAtuar.toString() != 'null')){
            let changes = []
            
            let changeRnc = {
                idRnc:rncData._id,
                user
            } 

            if(rncData.tipo != tipoMark){
                changes.push({tipo:tipoMark})
            }
            
            if(rncData.setorAtuar?._id != setorAtuar.value){
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

        console.log(rncData.quem)

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

            if(inputEvid.files){
                mudancas.push({evidenciasAndamentos:inputEvid.files})
            }

            if(mudancas.length == 0) // se não tiver mudanças ele retorna
                return

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
        if(key === 'linhaDoTempo' || key === 'pessoasAnexadas' || key === 'anexos' || key === 'enquadramento' || key === 'criador' || key === 'setorAutuante' || key === 'setorAtuar' || key === 'quem' || key === "avaliacaoDeAcao" || key === "evidenciasAndamentos" || key ==="arquivosComprovarEficiencia"){
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
            console.log(divRnc)
            if(indexRnc.status != divRnc.getAttribute('data-status')){
                indexRnc.status = divRnc.getAttribute('data-status')
                indexRnc.nivelSeveridade = divRnc.getAttribute('data-nivelseveridade')
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