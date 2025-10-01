document.addEventListener("DOMContentLoaded", function () {

    let carrito = [];

    function abrirCarrito() {
        const carrito = document.getElementById("sidebarCarrito");
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(carrito);
        offcanvas.show();
    }

    function cerrarCarrito() {
        const carrito = document.getElementById("sidebarCarrito");
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(carrito);
        offcanvas.hide();
    }

    function vaciarCarrito() {
        carrito = [];
        const lista = document.getElementById("lista-Productos");
        lista.innerHTML = "";

        document.getElementById("contenidoProductos").classList.add("d-none");
        document.getElementById("carritoVacio").classList.remove("d-none");
        document.getElementById("totalCarrito").textContent = "S/0.00";
        localStorage.removeItem("carritoProductos");
        //actualizarContadorCarrito();
    }

    function actualizarEstadoCarrito() {
        const lista = document.getElementById("lista-Productos");
        if (lista.children.length > 0) {
            document.getElementById("carritoVacio").classList.add("d-none");
            document.getElementById("contenidoProductos").classList.remove("d-none");
        } else {
            document.getElementById("contenidoProductos").classList.add("d-none");
            document.getElementById("carritoVacio").classList.remove("d-none");
        }
    }

    function agregarProducto(nombre, precio, imagen, cantidad) {
        const id = btoa(nombre+imagen).substring(0,12); // Generar un ID único basado en el nombre y la imagen
        //Verificar si un producto ya existe en el carrito
        const existente = carrito.find(item => item.nombre === nombre);
        
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({ nombre, precio, imagen, cantidad });
        }

        renderizarCarrito();
    }

    function renderizarCarrito() {
        const contenedor = document.getElementById("lista-Productos");
        const total = document.getElementById("totalCarrito");
        
        contenedor.innerHTML = "";
        let suma = 0;

        carrito.forEach(item => {
            suma += item.precio * item.cantidad;

            const div = document.createElement("div");
            div.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");
            div.dataset.nombre = item.nombre;

            div.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" width="50" class="me-2">
                <span>${item.nombre} <span class="cantidad">x${item.cantidad}</span></span>
                <span class="precio-unitario">S/${item.precio.toFixed(2)}</span>
                <strong>S/${(item.precio * item.cantidad).toFixed(2)}</strong>
            `;
        contenedor.appendChild(div);
    });

        total.textContent = `S/${suma.toFixed(2)}`;
        guardarCarritoEnStorage();
        //actualizarContadorCarrito();
        actualizarEstadoCarrito();
    }

    //Guardar carrito en localStorage
    function guardarCarritoEnStorage() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    /* Actualizar el contador del carrito 
    function actualizarContadorCarrito() {
        const contador = document.getElementById("contadorCarrito");
        let totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

        if (totalProductos > 0) {
            contador.style.display = "inline-block";
            contador.textContent = totalProductos;
        } else {
            contador.style.display = "none";
        }
    }
    */
    
    function realizarPedido() {
        window.location.href = '../html/Compra/MetodoCompra.html';
    }

    window.abrirCarrito = abrirCarrito;
    window.cerrarCarrito = cerrarCarrito;
    window.vaciarCarrito = vaciarCarrito;
    window.realizarPedido = realizarPedido;
    window.agregarProducto = agregarProducto;

    const productosGuardados = JSON.parse(localStorage.getItem("carrito")) || [];
        if (productosGuardados.length > 0) {
            carrito = productosGuardados;
            renderizarCarrito();
        }

    actualizarEstadoCarrito();

    const iconoCarrito = document.querySelector(".icono-carrito");
        if (iconoCarrito) {
            iconoCarrito.addEventListener("click", abrirCarrito);
    }
});