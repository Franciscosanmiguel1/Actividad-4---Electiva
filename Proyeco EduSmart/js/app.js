console.log("app.js cargado correctamente");

// ==========================
// REGISTRO DE USUARIO
// ==========================
const registroForm = document.getElementById("registroForm");

if (registroForm) {
    registroForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!nombre || !correo || !password) {
            mostrarAlerta("Todos los campos son obligatorios.", "danger");
            return;
        }

        if (password.length < 6) {
            mostrarAlerta("La contraseña debe tener al menos 6 caracteres.", "danger");
            return;
        }

        // Guardar usuario en localStorage
        const usuario = { nombre, correo, password };
        localStorage.setItem("usuario", JSON.stringify(usuario));

        mostrarAlerta("Registro exitoso. Serás redirigido al inicio en 2 segundos.", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    });
}

// ==========================
// LOGIN DE USUARIO
// ==========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const correo = document.getElementById("correoLogin").value.trim();
        const password = document.getElementById("passwordLogin").value.trim();

        const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

        if (!usuarioGuardado) {
            mostrarAlerta("No hay cuentas registradas.", "danger");
            return;
        }

        if (correo !== usuarioGuardado.correo || password !== usuarioGuardado.password) {
            mostrarAlerta("Correo o contraseña incorrectos.", "danger");
            return;
        }

        // Guardar sesión activa
        localStorage.setItem("sesionActiva", "true");

        mostrarAlerta("Inicio de sesión exitoso. Redirigiendo…", "success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    });
}

// ==========================
// VALIDACIÓN DE SESIÓN EN DASHBOARD Y MIS CURSOS
// ==========================
if (window.location.href.includes("dashboard.html") || window.location.href.includes("mis-cursos.html")) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const sesion = localStorage.getItem("sesionActiva");

    if (!usuario || sesion !== "true") {
        window.location.href = "login.html";
    } else {
        const userLabel = document.getElementById("userNameLabel");
        const nombreDashboard = document.getElementById("dashboardUserName");

        if (userLabel) userLabel.textContent = usuario.nombre;
        if (nombreDashboard) nombreDashboard.textContent = usuario.nombre;
    }
}

// ==========================
// CERRAR SESIÓN
// ==========================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("sesionActiva");
        window.location.href = "index.html";
    });
}

// ==========================
// MIS CURSOS
// ==========================
const listaCursos = document.getElementById("listaCursos");

if (listaCursos) {
    const cursos = JSON.parse(localStorage.getItem("cursosInscritos")) || [];

    if (cursos.length === 0) {
        listaCursos.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">Aún no estás inscrito en ningún curso.</div>
            </div>
        `;
    } else {
        listaCursos.innerHTML = "";
        cursos.forEach(curso => {
            listaCursos.innerHTML += `
                <div class="col-md-4">
                    <div class="card shadow-sm h-100">
                        <img src="media/imagenes/${curso}.jpg" class="card-img-top" alt="${curso}">
                        <div class="card-body">
                            <h5 class="card-title text-capitalize">${curso}</h5>
                            <p class="card-text">Curso asignado a tu cuenta.</p>
                            <a href="curso-detalle.html?id=${curso}" class="btn btn-primary w-100">Ver curso</a>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

// ==========================
// FUNCIONES AUXILIARES
// ==========================
function mostrarAlerta(mensaje, tipo = "info") {
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} mt-3`;
    alerta.textContent = mensaje;

    const contenedor = document.querySelector(".card-body") || document.body;
    contenedor.prepend(alerta);

    setTimeout(() => alerta.remove(), 3000);
}
