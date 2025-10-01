function validarDatos() {
    const correoGuardado = localStorage.getItem("correo");
    const contraseñaGuardada = localStorage.getItem("contraseña");

    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correo === "" || contraseña === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (!regexEmail.test(correo)) {
        alert("Por favor, ingrese un correo válido.");
        return;
    }

    if (correo === correoGuardado && contraseña === contraseñaGuardada) {
        // Para Usuario
        localStorage.setItem("usuarioLogueado", "true");

        window.location.href = "Menu.html";
    } else {
        alert("Usuario y/o contraseña incorrectos");
    }
}
