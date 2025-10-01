function registrar() {
    const nombre = document.getElementById("nombre").value.trim(); 
    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    // Regex básico para validar correos (ejemplo: usuario@dominio.com)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correo === "" || contraseña === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (!regexEmail.test(correo)) {
        alert("Por favor, ingrese un correo válido (ejemplo: usuario@dominio.com).");
        return;
    }

    // Si pasa las validaciones, guardamos en localStorage
    localStorage.setItem("correo", correo);
    localStorage.setItem("contraseña", contraseña);

    localStorage.setItem("nombreUsuario", nombre);
    localStorage.setItem("telefono", "");
    localStorage.setItem("direccion", "");
    localStorage.setItem("FotoPerfil", "../Imagenes/PerfilDefecto.jpg");

    alert("Usuario registrado correctamente.");
    window.location.href = "loguin.html";
}
