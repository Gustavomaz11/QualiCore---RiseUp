const dashBtn = document.querySelector('#dashBtn')
const relatorioBtn = document.querySelector('#relatorioBtn')
const rncBtn = document.querySelector('#rncBtn')
const dashDetalhadoBtn = document.querySelector('#dashDetalhadoBtn')
const monitoramentoBtn = document.querySelector('#monitoramentoBtn')
const departamentoBtn = document.querySelector('#departamentoBtn')
const usuariosBtn = document.querySelector('#usuariosBtn')
const cxEntradaBtn = document.querySelector('#cxEntradaBtn')
const meuPerfilBtn = document.querySelector('#meuPerfilBtn')
const photoInput = document.querySelector("#photoInput")
const fullNameDisplay = document.querySelector("#fullNameDisplay")
const nomeCompleto = document.querySelector("#nomeCompleto")
const cargo = document.querySelector("#position")
const manager = document.querySelector("#manager")
const profilePicture = document.querySelector("#profilePicture")
const btnFecharModalSenha = document.querySelector('#btnFecharModalSenha')
const modalFormSenha = document.querySelector('.modal')
const btnmudarsenha = document.querySelector('#btnmudarsenha') 
const formMudaSenha = document.querySelector('#formMudaSenha')
const botaoPerfil = document.getElementById('botaoPerfil');
let user = localStorage.getItem('login')
if(user != null)
    user = JSON.parse(user)

const iconPesoa = document.querySelector('#iconPesoa')
const imgPerfil = document.querySelector(".imgPerfil")

if(user.perfil != null){
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

botaoPerfil.addEventListener('click', function(event) {
    event.stopPropagation();
    menuPerfil.classList.toggle('ativo');
});

document.addEventListener('click', function(event) {
    if (!menuPerfil.contains(event.target) && !botaoPerfil.contains(event.target)) {
        menuPerfil.classList.remove('ativo');
    }
});

async function handleMudarSenha (body){
    try {
        const responseJson = await fetch('http://localhost:3333/usuarios/mudarSenha',{
            method:'PUT',
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(body)
        })

        let response = await responseJson.json()

        if(responseJson.status == 200){
            alert(response.message)
            return
        }

        console.log(response)
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


if(user == null)
    window.location.href = 'index.html';

const nome = document.querySelector('#nome')
nome.innerText = user.nome?showName(user.nome):'xxxx'
fullNameDisplay.innerText = user.nome?showName(user.nome):'xxxx'
nomeCompleto.innerText = user.nome?user.nome:'xxxx'
cargo.innerText = user.cargo?user.cargo:'xxxx'
manager.innerText = user.departamento?user.departamento.gerente:'xxxx'
if(user.perfil){
    profilePicture.src = user.perfil.path
}

btnFecharModalSenha.addEventListener('click',()=>{
    modalFormSenha.style = 'display:none;'
})

btnmudarsenha.addEventListener('click',()=>{
    modalFormSenha.style = 'display:flex;'
})

formMudaSenha.addEventListener('submit', async(evt)=>{
    evt.preventDefault()
    const senhaAntiga = document.querySelector('#senhaAntiga')
    const novaSenha = document.querySelector('#novaSenha')
    const confirmeSenha = document.querySelector('#confirmSenha')

    let strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/
    if(novaSenha.value != confirmeSenha.value){
        alert('As senhas precisam serem iguais')
        return
    }

    if(!strongPasswordRegex.test(novaSenha.value)){
        alert('Senha fraca')
        return
    }
    

    let body = {
        senhaAntiga:senhaAntiga.value,
        novaSenha:novaSenha.value,
        idUser:user._id
    }

    await handleMudarSenha(body)
    

})  

async function handleAtualizandoInfoPerfil (email) {
    try {
        const responseJson = await fetch(`http://localhost:3333/usuarios/pegar/${email}`)

        const response = await responseJson.json()

        localStorage.setItem('login',JSON.stringify(response))
        user = response
        window.location.reload(true)
    } catch (error) {
        console.log(response)
    }
}

async function handleAddFotoPerfil (file){
    const formData = new FormData()
    for (let i = 0; i < file.length; i++) {
        formData.append('foto', file[i])
    }
    
    formData.append("idUser",user._id)

    try {
        const responseJson = await fetch('http://localhost:3333/usuarios/addFoto',{
            method:"PUT",
            body:formData
        })
    
        if(responseJson.status == 200){
            alert('Foto anexada com sucesso')
            return
        }
    
        let response = await responseJson.json()
    
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

let isEditing = false;

function changeProfilePicture(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            await handleAddFotoPerfil(input.files)
            await handleAtualizandoInfoPerfil(user.email)
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Função para alternar o status (apenas para demonstração)
document.getElementById('status').addEventListener('click', function() {
    if (isEditing) {
        const statusElement = this;
        const currentStatus = statusElement.textContent.toLowerCase();
        const statusClasses = {
            'ativo': 'status-active',
            'inativo': 'status-inactive',
            'bloqueado': 'status-blocked'
        };
        const statusOrder = ['ativo', 'inativo', 'bloqueado'];
        
        let currentIndex = statusOrder.indexOf(currentStatus);
        let nextIndex = (currentIndex + 1) % statusOrder.length;
        let nextStatus = statusOrder[nextIndex];
        
        // Remover todas as classes de status
        Object.values(statusClasses).forEach(className => {
            statusElement.classList.remove(className);
        });
        
        // Adicionar a nova classe de status
        statusElement.classList.add(statusClasses[nextStatus]);
        statusElement.textContent = nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1);
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