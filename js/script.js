const app = document.getElementById("app");

// Pantallas
const pantallaLogin = `<h1 class="app-container-title">Bienvenidos</h1>
  <form class="form" id="login-form">
    <input name="username" type="text" placeholder="👮‍♂️ Usuario" required />
    <input name="password" type="password" placeholder="🔒 Contraseña" required />
    <input type="submit" value="Login" />
  </form>
  <button onclick="renderRegistro()">Crear cuenta</button>`;

const pantalla404 = `<h1 class="app-container-title">404</h1>
  <p>Página en construcción</p>
  <button onclick="logout()">Logout</button>`;

// Base de datos de usuarios
const bdUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Función para renderizar login
function renderLogin() {
  app.innerHTML = pantallaLogin;
  const loginForm = document.getElementById("login-form");

  loginForm.onsubmit = (evento) => {
    evento.preventDefault();
    const username = evento.target.username.value;
    const password = evento.target.password.value;

    const usuario = bdUsuarios.find((user) => user.username === username && user.password === password);

    if (usuario) {
      guardarSesion(usuario);
      app.innerHTML = pantalla404;
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };
}

// Función para renderizar registro
function renderRegistro() {
  const pantallaRegistro = `<h1 class="app-container-title">Registro</h1>
    <form class="form" id="register-form">
      <input name="username" type="text" placeholder="👮‍♂️ Usuario nuevo" required />
      <input name="password1" type="password" placeholder="🔒 Contraseña" required />
      <input name="password2" type="password" placeholder="🔒 Repetir Contraseña" required />
      <input type="submit" value="Crear" />
    </form>
    <button onclick="renderLogin()">Volver al Login</button>`;

  app.innerHTML = pantallaRegistro;
  const registerForm = document.getElementById("register-form");

  registerForm.onsubmit = (evento) => {
    evento.preventDefault();
    const username = evento.target.username.value;
    const password1 = evento.target.password1.value;
    const password2 = evento.target.password2.value;

    if (bdUsuarios.some((user) => user.username === username)) {
      alert("Usuario ya existe");
      return;
    }

    if (password1 !== password2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const nuevoUsuario = { username, password: password1 };
    bdUsuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(bdUsuarios));
    renderLogin();
  };
}

// Guardar sesión por 5 minutos
function guardarSesion(usuario) {
  const sesion = { usuario, expira: Date.now() + 5 * 60 * 1000 };
  localStorage.setItem("sesion", JSON.stringify(sesion));
}

// Logout
function logout() {
  localStorage.removeItem("sesion");
  renderLogin();
}

// Cargar sesión si existe
function cargarSesion() {
  const sesion = JSON.parse(localStorage.getItem("sesion"));
  if (sesion && sesion.expira > Date.now()) {
    app.innerHTML = pantalla404;
  } else {
    localStorage.removeItem("sesion");
    renderLogin();
  }
}

// Cambio de tema
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const tema = { oscuro: document.body.classList.contains("dark-mode"), expira: Date.now() + 5 * 60 * 1000 };
  localStorage.setItem("tema", JSON.stringify(tema));
}

// Aplicar tema guardado
function aplicarTema() {
  const tema = JSON.parse(localStorage.getItem("tema"));
  if (tema && tema.oscuro && tema.expira > Date.now()) {
    document.body.classList.add("dark-mode");
  } else {
    localStorage.removeItem("tema");
  }
}

// Inicialización
aplicarTema();
cargarSesion();


