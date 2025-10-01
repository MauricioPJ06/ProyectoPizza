function enviarEmail() {
    const correo = document.getElementById("correo").value.trim();

   
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correo === "") {
        alert("Por favor, ingrese su correo electrónico.");
    } else if (!regexEmail.test(correo)) {
        alert("El correo ingresado no tiene un formato válido.");
    } else {
        alert("Se ha enviado un correo de recuperación a " + correo + ". Revise su bandeja de entrada.");
         window.location.href = "loguin.html";
    }
}
