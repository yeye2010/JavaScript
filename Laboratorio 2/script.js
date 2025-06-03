function mostrarResultado(id, mensaje, tipo = "") {
    const elemento = document.getElementById(id);
    elemento.className = "resultado resultado-animado" + (tipo ? " " + tipo : "");
    elemento.innerText = mensaje;
    setTimeout(() => {
        elemento.classList.remove("resultado-animado");
    }, 900);
    cambiarAvatar(tipo);
    feedbackAnimacion(elemento, tipo);
    if (tipo === 'exito') {
        lanzarConfeti();
        sonidos.exito.currentTime = 0;
        sonidos.exito.play();
    } else if (tipo === 'error') {
        sonidos.error.currentTime = 0;
        sonidos.error.play();
    }
}

function esPalindromo(palabra) {
    let palabraOriginal = palabra.toLowerCase().replace(/\s/g, '');
    let palabraReversa = palabraOriginal.split('').reverse().join('');
    return palabraOriginal === palabraReversa;
}

function verificarPalindromo() {
    let palabra = document.getElementById("palindromoInput").value;
    let es = esPalindromo(palabra);
    let resultado = es ? "¡Es un palíndromo!" : "No es un palíndromo";
    mostrarResultado("resultadoPalindromo", resultado, es ? "exito" : "error");
    ejerciciosActuales[0] = es;
    actualizarProgreso();
}

function compararNumeros() {
    let num1 = parseFloat(document.getElementById("numero1").value);
    let num2 = parseFloat(document.getElementById("numero2").value);
    let resultado = "";
    let tipo = "";
    if (isNaN(num1) || isNaN(num2)) {
        resultado = "Por favor ingresa ambos números";
        tipo = "error";
        ejerciciosActuales[1] = false;
    } else if (num1 > num2) {
        resultado = num1 + " es mayor que " + num2;
        tipo = "exito";
        ejerciciosActuales[1] = true;
    } else if (num2 > num1) {
        resultado = num2 + " es mayor que " + num1;
        tipo = "exito";
        ejerciciosActuales[1] = true;
    } else {
        resultado = "Ambos números son iguales";
        tipo = "exito";
        ejerciciosActuales[1] = true;
    }
    mostrarResultado("resultadoComparacion", resultado, tipo);
    actualizarProgreso();
}

function extraerVocales() {
    let frase = document.getElementById("fraseVocales").value.toLowerCase();
    let vocales = frase.match(/[aeiou]/g);
    let resultado = vocales ? "Vocales encontradas: " + vocales.join(", ") : "No se encontraron vocales";
    mostrarResultado("resultadoVocales", resultado, vocales ? "exito" : "error");
    ejerciciosActuales[2] = vocales ? true : false;
    actualizarProgreso();
}

function contarVocales() {
    let frase = document.getElementById("fraseConteo").value.toLowerCase();
    let conteo = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    for (let letra of frase) {
        if (conteo.hasOwnProperty(letra)) {
            conteo[letra]++;
        }
    }
    let resultado = "";
    let total = Object.values(conteo).reduce((a, b) => a + b, 0);
    if (total === 0) {
        resultado = "No se encontraron vocales";
        mostrarResultado("resultadoConteo", resultado, "error");
        ejerciciosActuales[3] = false;
    } else {
        resultado = "Conteo de vocales:\n";
        for (let vocal in conteo) {
            resultado += vocal + ": " + conteo[vocal] + "\n";
        }
        mostrarResultado("resultadoConteo", resultado, "exito");
        ejerciciosActuales[3] = true;
    }
    actualizarProgreso();
}
// --- Sistema de progreso, temporizador, animaciones y modo oscuro ---
let ejerciciosTotales = 4;
let ejerciciosCompletados = 0;
let ejerciciosActuales = [null, null, null, null];
const nombresEjercicios = [
    'Palíndromo',
    'Comparar números',
    'Vocales en frase',
    'Conteo de vocales'
];
const explicacionesErrores = [
    'Recuerda que un palíndromo es una palabra que se lee igual al derecho y al revés.',
    'Debes ingresar dos números y comparar cuál es mayor o si son iguales.',
    'Debes ingresar una frase que contenga al menos una vocal.',
    'Debes ingresar una frase y se contará cuántas veces aparece cada vocal.'
];
const emojis = { neutral: '😃', exito: '😎', error: '😢', tiempo: '⏰' };
const sonidos = {
    exito: new Audio('exito.mp3'),
    error: new Audio('error.mp3'),
    confeti: new Audio('confeti.mp3')
};

function lanzarConfeti() {
    for (let i = 0; i < 24; i++) {
        const conf = document.createElement('span');
        conf.textContent = ['🎉','✨','🎊','🥳','💫'][Math.floor(Math.random()*5)];
        conf.className = 'confeti';
        conf.style.left = Math.random()*100 + 'vw';
        conf.style.animationDuration = (1.5 + Math.random()) + 's';
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 2000);
    }
    sonidos.confeti.currentTime = 0;
    sonidos.confeti.play();
}

function actualizarProgreso() {
    ejerciciosCompletados = ejerciciosActuales.filter(e => e !== null).length;
    const porcentaje = (ejerciciosCompletados / ejerciciosTotales) * 100;
    document.getElementById('progressBar').style.width = porcentaje + '%';
    if (ejerciciosActuales.every(e => e !== null)) {
        if (ejerciciosActuales.every(Boolean)) {
            mostrarModalExperto();
        } else {
            mostrarModalCerca();
        }
        setTimeout(() => {
            ejerciciosActuales = [null, null, null, null];
            ejerciciosCompletados = 0;
        }, 1500);
    }
}

function cambiarAvatar(tipo) {
    const avatar = document.getElementById('avatarEmoji');
    avatar.textContent = emojis[tipo] || emojis.neutral;
    avatar.style.transform = tipo === 'exito' ? 'scale(1.3) rotate(-10deg)'
     : tipo === 'error' ? 'scale(0.9) rotate(10deg)' : 'scale(1)';
    setTimeout(() => { avatar.style.transform = 'scale(1)'; }, 900);
}
function feedbackAnimacion(elemento, tipo) {
    if (tipo === 'exito') {
        elemento.classList.add('bounce');
        setTimeout(() => elemento.classList.remove('bounce'), 700);
    } else if (tipo === 'error') {
        elemento.classList.add('shake');
        setTimeout(() => elemento.classList.remove('shake'), 700);
    }
}
function mostrarModalFelicidades() {
    const modal = document.getElementById('modalFelicidades');
    modal.style.display = 'flex';
    lanzarConfeti();
    sonidos.confeti.currentTime = 0;
    sonidos.confeti.play();
    // No reiniciar automáticamente, solo al cerrar con la X
}
function mostrarModalCero() {
    const modal = document.getElementById('modalCero');
    modal.style.display = 'flex';
    sonidos.error.currentTime = 0;
    sonidos.error.play();
    // No reiniciar automáticamente, solo al cerrar con la X
}
function mostrarModalExperto() {
    const modal = document.getElementById('modalExperto');
    modal.style.display = 'flex';
    lanzarConfeti();
    sonidos.confeti.currentTime = 0;
    sonidos.confeti.play();
    // No reiniciar automáticamente, solo al cerrar con la X
}
function mostrarModalCerca() {
    const modal = document.getElementById('modalCerca');
    let mensaje = 'Te faltó acertar en los siguientes retos:<br>';
    ejerciciosActuales.forEach((ok, idx) => {
        if (!ok) {
            mensaje += `<b>${nombresEjercicios[idx]}</b>: ${explicacionesErrores[idx]}<br>`;
        }
    });
    document.getElementById('mensajeCerca').innerHTML = mensaje;
    modal.style.display = 'flex';
    sonidos.error.currentTime = 0;
    sonidos.error.play();
    // No reiniciar automáticamente, solo al cerrar con la X
}

// Cerrar modales y reiniciar al cerrar
['closeModalFelicidades','closeModalCero','closeModalExperto','closeModalCerca'].forEach(id => {
    document.getElementById(id).onclick = function() {
        this.closest('.modal-felicidades').style.display = 'none';
        reiniciarJuego();
    };
});
// --- Modo oscuro ---
document.getElementById('toggleTheme').onclick = () => {
    document.body.classList.toggle('dark');
    document.getElementById('toggleTheme').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
};
// --- Animaciones CSS ---
const style = document.createElement('style');
style.textContent = `
@keyframes confeti-fall { 0%{transform:translateY(-40px) rotate(0);} 100%{transform:translateY(100vh) rotate(360deg);} }
.confeti { position: fixed; top: 0; font-size: 2rem; pointer-events: none; z-index: 9999; animation: confeti-fall linear; }
.bounce { animation: bounceAnim 0.7s; }
@keyframes bounceAnim { 0%{transform:scale(1);} 30%{transform:scale(1.2);} 50%{transform:scale(0.95);} 100%{transform:scale(1);} }
.shake { animation: shakeAnim 0.7s; }
@keyframes shakeAnim { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-10px);} 40%,80%{transform:translateX(10px);} }
`;
document.head.appendChild(style);
// --- Integración con ejercicios ---
function mostrarResultado(id, mensaje, tipo = "") {
    const elemento = document.getElementById(id);
    elemento.className = "resultado resultado-animado" + (tipo ? " " + tipo : "");
    elemento.innerText = mensaje;
    setTimeout(() => {
        elemento.classList.remove("resultado-animado");
    }, 900);
    cambiarAvatar(tipo);
    feedbackAnimacion(elemento, tipo);
    if (tipo === 'exito') {
        lanzarConfeti();
        sonidos.exito.currentTime = 0;
        sonidos.exito.play();
    } else if (tipo === 'error') {
        sonidos.error.currentTime = 0;
        sonidos.error.play();
    }
}
// --- Ejercicios actualizados para marcar completados ---
function verificarPalindromo() {
    let palabra = document.getElementById("palindromoInput").value;
    let es = esPalindromo(palabra);
    let resultado = es ? "¡Es un palíndromo!" : "No es un palíndromo";
    mostrarResultado("resultadoPalindromo", resultado, es ? "exito" : "error");
    ejerciciosActuales[0] = es;
    actualizarProgreso();
}
function compararNumeros() {
    let num1 = parseFloat(document.getElementById("numero1").value);
    let num2 = parseFloat(document.getElementById("numero2").value);
    let resultado = "";
    let tipo = "";
    if (isNaN(num1) || isNaN(num2)) {
        resultado = "Por favor ingresa ambos números";
        tipo = "error";
        ejerciciosActuales[1] = false;
    } else if (num1 > num2) {
        resultado = num1 + " es mayor que " + num2;
        tipo = "exito";
        ejerciciosActuales[1] = true;
    } else if (num2 > num1) {
        resultado = num2 + " es mayor que " + num1;
        tipo = "exito";
        ejerciciosActuales[1] = true;
    } else {
        resultado = "Ambos números son iguales";
        tipo = "exito";
        ejerciciosActuales[1] = true;
    }
    mostrarResultado("resultadoComparacion", resultado, tipo);
    actualizarProgreso();
}
function extraerVocales() {
    let frase = document.getElementById("fraseVocales").value.toLowerCase();
    let vocales = frase.match(/[aeiou]/g);
    let resultado = vocales ? "Vocales encontradas: " + vocales.join(", ") : "No se encontraron vocales";
    mostrarResultado("resultadoVocales", resultado, vocales ? "exito" : "error");
    ejerciciosActuales[2] = vocales ? true : false;
    actualizarProgreso();
}
function contarVocales() {
    let frase = document.getElementById("fraseConteo").value.toLowerCase();
    let conteo = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    for (let letra of frase) {
        if (conteo.hasOwnProperty(letra)) {
            conteo[letra]++;
        }
    }
    let resultado = "";
    let total = Object.values(conteo).reduce((a, b) => a + b, 0);
    if (total === 0) {
        resultado = "No se encontraron vocales";
        mostrarResultado("resultadoConteo", resultado, "error");
        ejerciciosActuales[3] = false;
    } else {
        resultado = "Conteo de vocales:\n";
        for (let vocal in conteo) {
            resultado += vocal + ": " + conteo[vocal] + "\n";
        }
        mostrarResultado("resultadoConteo", resultado, "exito");
        ejerciciosActuales[3] = true;
    }
    actualizarProgreso();
}
window.onload = () => {
    ejerciciosActuales = [null, null, null, null];
    ejerciciosCompletados = 0;
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('avatarEmoji').textContent = emojis.neutral;
};
// --- Instrucciones flotantes ---
function mostrarInstrucciones() {
    document.getElementById('modalInstrucciones').style.display = 'flex';
}
function ocultarInstrucciones() {
    document.getElementById('modalInstrucciones').style.display = 'none';
}
// Mostrar solo una vez al inicio (localStorage)
window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('instruccionesVistas')) {
        mostrarInstrucciones();
        localStorage.setItem('instruccionesVistas', '1');
    }
});
document.getElementById('helpCircle').onclick = mostrarInstrucciones;
document.getElementById('closeModalInstrucciones').onclick = ocultarInstrucciones;
// Drag & drop para el círculo de ayuda
(function() {
    const circle = document.getElementById('helpCircle');
    let offsetX, offsetY, dragging = false;
    circle.addEventListener('mousedown', function(e) {
        dragging = true;
        offsetX = e.clientX - circle.getBoundingClientRect().left;
        offsetY = e.clientY - circle.getBoundingClientRect().top;
        circle.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', function(e) {
        if (dragging) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            // Limitar dentro de la ventana
            x = Math.max(0, Math.min(window.innerWidth - circle.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - circle.offsetHeight, y));
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            circle.style.right = 'auto';
            circle.style.bottom = 'auto';
        }
    });
    document.addEventListener('mouseup', function() {
        dragging = false;
        circle.style.cursor = 'grab';
    });
})();
// Marcar juego iniciado al primer intento
window._juegoIniciado = false;
['palindromoInput','numero1','numero2','fraseVocales','fraseConteo'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => { window._juegoIniciado = true; });
});
function reiniciarJuego() {
    ejerciciosActuales = [null, null, null, null];
    ejerciciosCompletados = 0;
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('avatarEmoji').textContent = emojis.neutral;
    // Limpiar resultados
    ['resultadoPalindromo','resultadoComparacion','resultadoVocales','resultadoConteo'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = '';
        el.className = '';
    });
    // Limpiar inputs
    ['palindromoInput','numero1','numero2','fraseVocales','fraseConteo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    window._juegoIniciado = false;
}