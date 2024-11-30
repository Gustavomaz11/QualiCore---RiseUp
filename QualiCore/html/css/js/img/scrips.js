const loginForm = document.querySelector('.login-form');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

localStorage.setItem("login",null)

async function handleLogin (email,senha){
    try {
        const loginJson = await fetch(`http://localhost:3333/usuarios/login/${email}/${senha}`)
        const login = await loginJson.json()
        
        if(loginJson.status >= 400){
            popup.style.display = 'flex';
            console.log(login)
            return false
        }
        
        console.log(login)
        localStorage.setItem('login', JSON.stringify(login));
        window.location.href = 'homePage.html';
        
    } catch (error) {
        console.log(error)
        return false
    }
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        if (particles[i].size <= 0.2) {
            particles.splice(i, 1);
            i--;
            particles.push(new Particle());
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('button');
    btn.textContent = 'Entrando...';
    btn.disabled = true;

    const email = emailInput.value;
    const senha = senhaInput.value;

    let validacao = await handleLogin(email,senha)

    if (!validacao) {
        emailInput.classList.add('error');
        senhaInput.classList.add('error');
    }

    setTimeout(() => {
        btn.textContent = 'Entrar'; // Corrigido
        btn.disabled = false;
    }, 2000);
});

closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
    emailInput.classList.remove('error');
    senhaInput.classList.remove('error');
});