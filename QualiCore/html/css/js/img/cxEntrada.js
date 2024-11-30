const dashBtn = document.querySelector('#dashBtn')
const relatorioBtn = document.querySelector('#relatorioBtn')
const rncBtn = document.querySelector('#rncBtn')
const dashDetalhadoBtn = document.querySelector('#dashDetalhadoBtn')
const monitoramentoBtn = document.querySelector('#monitoramentoBtn')
const departamentoBtn = document.querySelector('#departamentoBtn')
const usuariosBtn = document.querySelector('#usuariosBtn')
const cxEntradaBtn = document.querySelector('#cxEntradaBtn')
const meuPerfilBtn = document.querySelector('#meuPerfilBtn')
const DivlinhaDoTempo = document.querySelector('.linhaDoTempo')
const bodyTabelaRnc = document.querySelector('#bodyTabelaRNC')
const modal = document.getElementById("rncDetailsModal");
const rncNumber = document.querySelector('#rncNumber')
const notificationsList = document.getElementById('notificationsList');
const modalFooter = document.querySelector('.modal-footer')
const btnFormulario = document.querySelector('#btnFormulario')
const btnLinhaDoTempo = document.querySelector('#btnLinhaDoTempo')
const detalhesRncDoModal = document.querySelector('.detalhesRncDoModal')
const name = document.querySelector('#nome')
const bodyEvidenciasAndamento = document.querySelector('#bodyEvidenciasAndamento')
let atualActive

// inputs modal
const selectQuem = document.querySelector('#quem')
const inputOque = document.querySelector('#oQue')
const inputQuando = document.querySelector('#quando')
const inputOnde = document.querySelector('#onde')
const inputComo = document.querySelector('#como')
const inputPorque = document.querySelector('#porque')
const inputCusto = document.querySelector('#custo')
const inputEvid = document.querySelector('#evid')

//tab btns
const detalhamentoRncBtn = document.querySelector('#detalhamentoBtn');
const andamentoBtn = document.querySelector('#andamentoBtn');
const conclusaoBtn = document.querySelector('#conclusaoBtn');

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

const btnCloneMenu = document.querySelector('#btnCloneMenu')
btnCloneMenu.addEventListener('click',()=>{
    document.querySelector('aside').classList.remove('openMenu')
    document.querySelector('main').style = 'display: block;'
})
// função para formatar o nome sem quebrar o estilo
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

// pegano o user
let user = localStorage.getItem('login')
if(user != null)
    user = JSON.parse(user)

if(user == null)
    window.location.href = 'index.html';

nome.innerText = showName(user.nome)
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

handleGetMyCarLetter()

// função que deixa a cor da carta laranja caso tenha alguam msg não vista
function notificacaoNovaMsg (novaMsg){
    if(novaMsg){
        cxEntradaBtn.classList.add('novaMenssagem')
    }else{
        cxEntradaBtn.classList.remove('novaMenssagem')
    }
}

// pegano os funcionarios
let funcioanrios

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

// atualizandoUser(user,funcionarios)
// setInterval(atualizandoUser(user, funcionarios),5000)

botaoPerfil.addEventListener('click', function(event) {
    event.stopPropagation();
    menuPerfil.classList.toggle('ativo');
});

document.addEventListener('click', function(event) {
    if (!menuPerfil.contains(event.target) && !botaoPerfil.contains(event.target)) {
        menuPerfil.classList.remove('ativo');
    }
});

async function handleGetMenssagens (){
    try {
        const menssagensJson = await fetch(`http://localhost:3333/menssagem/minhasMsg/${user?._id}`)
        const menssagens = await menssagensJson.json()
        return menssagens
    } catch (error) {
        console.log(error)
    }
}

async function handleGetRncById (id){
    try {
        const rncJson = await fetch(`http://localhost:3333/rnc/pegarId/${id}`)
        const rnc = await rncJson.json()
        return rnc
    } catch (error) {
        console.log(error)
    }
}

async function handleGetRncConcluidasById (id){
    try {
        const rncConcluidaJson = await fetch(`http://localhost:3333/rncConcluidas/pegarId/${id}`)
        const rncConcluida = await rncConcluidaJson.json()
        return rncConcluida
    } catch (error) {
        console.log(error)
    }
}

async function handleMarkAsRead(body){
    try {
        const responseJson = await fetch(`http://localhost:3333/menssagem/marcarLida`,{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(body)
        })

        if(responseJson.status == 200){
            let response = await responseJson.json()
            alert(response.message)
        }
    } catch (error) {
        console.log(error)
    }
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

async function renderNotifications() {
    let mensagens = await handleGetMenssagens()
    
    notificationsList.innerHTML = '';
    mensagens.forEach(async notification => {
        console.log(notification)
        let rnc 
        rnc =  await handleGetRncById(notification.idRnc)
        if(rnc == null){
            rnc = await handleGetRncConcluidasById(notification.idRnc)
        }
        console.log(rnc)
        const card = document.createElement('div');
        card.className = `notification-card ${notification.lida ? '' : 'unread'}`;
        card.addEventListener('dblclick', ()=>{
            openModalOnDoubleClick(rnc)
            if(!notification.lida){
                handleMarkAsRead({idMenssagem:notification._id})
            }
                
        })
        
        const statusText = rnc.status
        
        card.innerHTML = `
            <div class="notification-header">
                <div class="sender-info">
                    <div class="avatar">${notification.emissor.avatar}</div>
                    <div class="sender-details">
                        <span class="sender-name">${notification.emissor.nome}</span>
                        <span class="notification-time">${notification.data + " - " + notification.hora}</span>
                    </div>
                </div>
                <span class="nc-number">${rnc._id}</span>
            </div>
            <div class="notification-content">
                ${notification.menssagem}
            </div>
            <div class="involved-users">
                <div class="involved-avatars">
                    ${rnc.pessoasAnexadas?.map(pessoas => 
                        `<div class="involved-avatar" title="${pessoas.nome}">${pessoas.avatar}</div>`
                    ).join('')}
                </div>
                <span class="involved-count">${rnc.pessoasAnexadas?.length} envolvidos</span>
            </div>
            <div class="notification-footer">
                <span class="status-badge">${statusText}</span>
                <div class="action-buttons">
                    <button class="action-btn secondary-btn">Ignorar</button>
                    <button class="action-btn primary-btn">Ver detalhes</button>
                </div>
            </div>
        `;

        notificationsList.appendChild(card);
    });
}

// Filtros
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        // Aqui você pode adicionar a lógica de filtro real
    });
});

function closeModal() {
    modal.style.display = "none";
    notificationsList.innerHTML = ''
    
    renderNotifications()
}

// Inicializa a renderização das notificações
renderNotifications();

async function openModalOnDoubleClick(rncData) {
    document.body.style = 'overflow:hidden;'
    const saveBtn = document.getElementById("saveBtn");
    const data = new Date()
    let dia = data.getDate() < 10?"0"+data.getDate():data.getDate()
    let mes = data.getMonth() + 1 < 10?"0"+data.getMonth():data.getMonth()+1
    let ano = data.getFullYear()
    let hora = data.getHours() <10?"0"+data.getHours():data.getHours()
    let minutos = data.getMinutes() < 10?"0"+data.getMinutes():data.getMinutes()
    let fullHora =  `${hora}:${minutos}`
    let fullData =  `${dia}/${mes}/${ano}`

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

function addMsg (usuario,emissor,rnc,data,hora,menssagem) {
    usuario.mensagens.push({
        emissor:{nome:emissor.nome, avatar:emissor.avatar},
        lida:false,
        menssagem,
        data,
        hora,
        rnc
    })

    funcionarios.map((funcionario)=>{
        if(funcionario.email === usuario.email){
            funcionario = usuario
        }
    })

    localStorage.setItem('funcionarios', JSON.stringify(funcionarios))
}

function pegarGestorDoSetor (siglaSetor){
    const gestor = funcionarios.filter((indexUser)=>{
        if(indexUser.setor.sigla == siglaSetor && indexUser.cargo == "Gerente Setor")
            return indexUser
    })

    return gestor?gestor[0]:gestor
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

window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
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

function arraysAreEqualUnordered(arr1, arr2) {
    if (arr1.length !== arr2.length) return false
  
    const sortedArr1 = [...arr1].sort()
    const sortedArr2 = [...arr2].sort()
  
    return sortedArr1.every((value, index) => value === sortedArr2[index])
}

inicializarAba();