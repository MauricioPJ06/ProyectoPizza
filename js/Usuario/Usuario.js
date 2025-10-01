document.addEventListener('DOMContentLoaded', function() {
    // 1. VERIFICAR SI EL USUARIO ESTÁ LOGUEADO
    const estaLogueado = localStorage.getItem("usuarioLogueado") === "true";
    
    if (!estaLogueado) {
        alert("Debes iniciar sesión");
        window.location.href = "loguin.html";
        return;
    }
    
    // 2. OCULTAR CAMPOS DE CONTRASEÑA AL INICIO
    document.getElementById("campoPasswordActual").style.display = "none";
    document.getElementById("camposNuevaPassword").style.display = "none";
    
    // 3. CARGAR DATOS DEL USUARIO
    function cargarDatosUsuario() {
        const nombre = localStorage.getItem("nombreUsuario") || "";
        const correo = localStorage.getItem("correo") || "";
        const telefono = localStorage.getItem("telefono") || "";
        const direccion = localStorage.getItem("direccion") || "";
        const avatar = localStorage.getItem("avatar") || "../Imagenes/PerfilDefecto.jpg";
        
        document.getElementById("nombre").value = nombre;
        document.getElementById("email").value = correo;
        document.getElementById("telefono").value = telefono;
        document.getElementById("direccion").value = direccion;
        document.getElementById("fotoPerfilActual").src = avatar;
    }
    
    // Cargar datos iniciales
    cargarDatosUsuario();
    
    // 4. VARIABLES GLOBALES
    let modoEdicion = false;
    let avatarSeleccionado = localStorage.getItem("avatar") || "../Imagenes/PerfilDefecto.jpg";
    
    // 5. ELEMENTOS
    const botonEditar = document.getElementById("btnEditar");
    const botonGuardar = document.getElementById("btnGuardar");
    const botonCambiarAvatar = document.getElementById("btnCambiarAvatar");
    const enlaceCambiarPassword = document.getElementById("enlaceCambiarPassword");
    const selectorAvatar = document.getElementById("selectorAvatar");
    const opcionesAvatar = document.querySelectorAll(".opcion-avatar");
    const formulario = document.getElementById("formularioPerfil");
    const campoPasswordActual = document.getElementById("campoPasswordActual");
    const camposNuevaPassword = document.getElementById("camposNuevaPassword");
    
    // 6. DESHABILITAR BOTÓN CAMBIAR AVATAR AL INICIO
    botonCambiarAvatar.disabled = true;
    botonCambiarAvatar.style.opacity = "0.6";
    botonCambiarAvatar.style.cursor = "not-allowed";
    
    // 7. FUNCIÓN PARA CAMBIAR MODO EDICIÓN
    function toggleModoEdicion() {
        modoEdicion = !modoEdicion;
        const campos = formulario.querySelectorAll("input, textarea");
        
        if (modoEdicion) {
            // ACTIVAR MODO EDICIÓN
            campos.forEach(campo => {
                if (campo.id !== "email") campo.removeAttribute("readonly");
            });
            botonGuardar.disabled = false;
            botonEditar.textContent = "Cancelar Edición";
            botonEditar.classList.remove("btn-primary");
            botonEditar.classList.add("btn-secondary");
            
            // HABILITAR botón cambiar avatar
            botonCambiarAvatar.disabled = false;
            botonCambiarAvatar.style.opacity = "1";
            botonCambiarAvatar.style.cursor = "pointer";
            
        } else {

            // DESACTIVAR MODO EDICIÓN
            campos.forEach(campo => campo.setAttribute("readonly", true));
            botonGuardar.disabled = true;
            botonEditar.textContent = "Editar Información";
            botonEditar.classList.remove("btn-secondary");
            botonEditar.classList.add("btn-primary");
            
            // DESHABILITAR botón cambiar avatar
            botonCambiarAvatar.disabled = true;
            botonCambiarAvatar.style.opacity = "0.6";
            botonCambiarAvatar.style.cursor = "not-allowed";
            
            // Ocultar selector de avatar si está visible
            selectorAvatar.style.display = "none";
            botonCambiarAvatar.textContent = "Cambiar Avatar";
            
            // Ocultar campos de contraseña
            campoPasswordActual.style.display = "none";
            camposNuevaPassword.style.display = "none";
            enlaceCambiarPassword.textContent = "¿Deseas cambiar tu contraseña?";
            
            // Recargar datos por si canceló
            cargarDatosUsuario();
        }
    }
    
    // 8. FUNCIÓN PARA SELECTOR DE AVATAR
    function toggleSelectorAvatar() {
        if (!modoEdicion) return;
        
        if (selectorAvatar.style.display === "none" || !selectorAvatar.style.display) {
            selectorAvatar.style.display = "block";
            botonCambiarAvatar.textContent = "Ocultar Avatares";
        } else {
            selectorAvatar.style.display = "none";
            botonCambiarAvatar.textContent = "Cambiar Avatar";
        }
    }
    
    // 9. FUNCIÓN PARA SELECCIONAR AVATAR
    function seleccionarAvatar(event) {
        if (!modoEdicion) return; 
        
        // Verificar que el click fue en una imagen
        if (event.target.classList.contains("opcion-avatar")) {
            avatarSeleccionado = event.target.getAttribute("data-avatar-src");
            
            // Actualizar avatar grande - USANDO ATRIBUTO src
            const fotoGrande = document.getElementById("fotoPerfilActual");
            fotoGrande.src = avatarSeleccionado;
            
            // Resaltar avatar seleccionado
            opcionesAvatar.forEach(opcion => {
                opcion.style.border = "2px solid transparent";
            });
            event.target.style.border = "2px solid #3498db";
        }
    }
    
    // 10. FUNCIÓN PARA CAMBIO DE CONTRASEÑA
    function toggleCamposPassword(event) {
        event.preventDefault();
        
        if (!modoEdicion) {
            alert("modo edición para cambiar la contraseña");
            return;
        }
        
        if (campoPasswordActual.style.display === "none" || !campoPasswordActual.style.display) {
            campoPasswordActual.style.display = "block";
            camposNuevaPassword.style.display = "block";
            enlaceCambiarPassword.textContent = "Ocultar cambio de contraseña";
        } else {
            campoPasswordActual.style.display = "none";
            camposNuevaPassword.style.display = "none";
            enlaceCambiarPassword.textContent = "¿Deseas cambiar tu contraseña?";
            // Limpiar campos
            document.getElementById("passwordActual").value = "";
            document.getElementById("nuevaPassword").value = "";
            document.getElementById("confirmarPassword").value = "";
        }
    }
    
    // 11. FUNCIÓN PARA VALIDAR Y GUARDAR DATOS
    function guardarDatos(event) {
        event.preventDefault();
        
        // Validar contraseñas si se están cambiando
        if (campoPasswordActual.style.display !== "none") {
            const nuevaPassword = document.getElementById("nuevaPassword").value;
            const confirmarPassword = document.getElementById("confirmarPassword").value;
            const passwordActual = document.getElementById("passwordActual").value;
            const contraseñaGuardada = localStorage.getItem("contraseña");
            
            // Verificar que todos los campos de contraseña estén llenos
            if (!passwordActual || !nuevaPassword || !confirmarPassword) {
                alert("Todos los campos de contraseña son obligatorios");
                return;
            }
            
            if (passwordActual !== contraseñaGuardada) {
                alert("La contraseña actual es incorrecta");
                return;
            }
            
            if (nuevaPassword !== confirmarPassword) {
                alert("Las nuevas contraseñas no coinciden");
                return;
            }
            
            if (nuevaPassword.length < 6) {
                alert("La contraseña es muy corta 6 caracteres debe de tener");
                return;
            }
            
            localStorage.setItem("contraseña", nuevaPassword);
            alert("Contraseña actualizada correctamente.");
        }
        
        // Guardar otros datos
        localStorage.setItem("nombreUsuario", document.getElementById("nombre").value);
        localStorage.setItem("telefono", document.getElementById("telefono").value);
        localStorage.setItem("direccion", document.getElementById("direccion").value);
        localStorage.setItem("avatar", avatarSeleccionado);
        
        // Mostrar mensaje de éxito
        mostrarMensaje("Información guardada correctamente");
        
        // Salir del modo edición
        modoEdicion = true;
        toggleModoEdicion();
    }
    
    // 12. FUNCIÓN PARA MOSTRAR MENSAJES BONITOS
    function mostrarMensaje(mensaje, tipo) {
        // Crear elemento de mensaje
        const alerta = document.createElement("div");
        alerta.className = `alert alert-${tipo === "error" ? "danger" : "success"} alert-dismissible fade show`;
        alerta.style.position = "fixed";
        alerta.style.top = "20px";
        alerta.style.right = "20px";
        alerta.style.zIndex = "1000";
        alerta.style.minWidth = "300px";
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Agregar al body
        document.body.appendChild(alerta);
        
        // Auto-eliminar después de 4 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.parentNode.removeChild(alerta);
            }
        }, 2500);
    }
    
    // 13. ASIGNAR EVENT LISTENERS
    botonEditar.addEventListener("click", toggleModoEdicion);
    botonCambiarAvatar.addEventListener("click", toggleSelectorAvatar);
    enlaceCambiarPassword.addEventListener("click", toggleCamposPassword);
    
    opcionesAvatar.forEach(opcion => {
        opcion.addEventListener("click", seleccionarAvatar);
    });
    
    formulario.addEventListener("submit", guardarDatos);
});

// 14. FUNCIÓN PARA CERRAR SESIÓN (global)
function cerrarSesion() {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
        localStorage.removeItem("usuarioLogueado");
        alert("👋 Sesión cerrada correctamente");
        window.location.href = "../html/loguin.html";
    }
}