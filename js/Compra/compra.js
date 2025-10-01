    document.addEventListener("DOMContentLoaded", () => {
        // Cargar y mostrar los productos del carrito
        cargarCarritoResumen();
        //Iniciar en el paso 1
        cambiarPaso(1);

        // Botones de navegación entre pasos
        document.getElementById("btn-siguiente-paso1").addEventListener("click", () => cambiarPaso(2));
        document.getElementById("btn-atras-paso2").addEventListener("click", () => cambiarPaso(1));
        document.getElementById("btn-siguiente-paso2").addEventListener("click", () => cambiarPaso(3));
        document.getElementById("btn-atras-paso3").addEventListener("click", () => cambiarPaso(2));

        // Confirmación final
        const btnConfirmarFinal = document.getElementById("btn-confirmar-final");
        if (btnConfirmarFinal) {
            btnConfirmarFinal.addEventListener("click", () => {
                document.querySelector("#paso-3").classList.add("d-none");
                document.getElementById("mensaje-confirmacion").classList.remove("d-none");
                document.querySelector(".resumen-pedido").classList.add("d-none");
                localStorage.removeItem("carrito");
            });
        }
        // Manejo de tabla de resumen
        document.addEventListener("click", onTablaClick);
        document.addEventListener("input", onCantidadInput);
    });

    let pasoActual = 1;

    function cambiarPaso(nuevoPaso) {
        pasoActual = Math.max(1, Math.min(3, nuevoPaso));

        // Cambiar visual en la barra de pasos
        document.querySelectorAll('.paso-item').forEach(item => {
            item.classList.remove('paso-activo', 'active');
            if (parseInt(item.dataset.paso) === pasoActual) {
                item.classList.add('paso-activo', 'active');
            }
        });

        // Mostrar/Ocultar bloques
        ['paso-1', 'paso-2', 'paso-3'].forEach(id => {
            document.getElementById(id)?.classList.add('d-none');
        });
        document.getElementById(`paso-${pasoActual}`)?.classList.remove('d-none'); 

        //Se define que solo aparezca el boton de siguiente si hay prodcutos en el carrito
        const btnContinuar = document.getElementById("btn-continuar-paso1");
        if (btnContinuar) {
            if (pasoActual === 1) {
                btnContinuar.classList.remove("d-none");
                const carrito = getCarrito();
                document.getElementById("btn-siguiente-paso1").disabled = carrito.length === 0;
            } else {
                btnContinuar.classList.add("d-none");
            }
        }
    }

    const STORAGE_KEY = 'carrito';
    const COSTO_ENVIO = 5.00; //Costo fijo de envio

    function getCarrito() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function setCarrito(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function getMetodoEntrega() {
        try {
            return JSON.parse(localStorage.getItem("entregaSeleccion")) || { metodo: "recojo" };
        } catch {
            return { metodo: "recojo" };
        }
    }

    function cargarCarritoResumen() {
        const productosCarrito = getCarrito();
        const tbody = document.getElementById("productos-carrito");
        const subtotalSpan = document.getElementById("subtotal-carrito");
        const envioSpan = document.getElementById("envio-carrito");
        const totalSpan = document.getElementById("total-general");
        const btnContinuar = document.getElementById("btn-continuar-paso1");

        if (!tbody || !subtotalSpan || !envioSpan || !totalSpan) return;

        tbody.innerHTML = "";

        if (productosCarrito.length === 0) {
            tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="alert alert-warning mb-0">Tu carrito está vacío</div>
                </td>
            </tr>`;
            document.getElementById("btn-siguiente-paso1").disabled = true;
        } else {
            productosCarrito.forEach(p => {
                const tr = document.createElement("tr");
                tr.dataset.id = p.id;

                tr.innerHTML = `
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                <img src="${p.imagen || ''}" alt="${p.nombre}" class="rounded" style="width:56px;height:56px;object-fit:cover;">
                                <div class="fw-semibold">${p.nombre}</div>
                            </div>
                        </td>
                        <td>S/ ${Number(p.precio).toFixed(2)}</td>
                        <td style="width:170px;">
                            <div class="input-group input-group-sm">
                                <button class="btn btn-outline-secondary btn-restar" type="button">-</button>
                                <input type="number" class="form-control text-center cantidad-input" min="1" value="${p.cantidad}">
                                <button class="btn btn-outline-secondary btn-sumar" type="button">+</button>
                            </div>
                        </td>
                        <td class="subtotal-item">S/ ${(p.precio * p.cantidad).toFixed(2)}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-secondary btn-editar" type="button">Editar</button>
                                <button class="btn btn-outline-danger btn-eliminar" type="button">Eliminar</button>
                            </div>
                        </td>
                `;
                tbody.appendChild(tr);
            });
            document.getElementById("btn-siguiente-paso1").disabled = false;
        }

        // Recalcular totales derecha
        recalcularResumen();
        actualizarInfoEntrega();

        if (btnContinuar) {
            if (pasoActual === 1) {
                btnContinuar.classList.remove("d-none");
            } else {
                btnContinuar.classList.add("d-none");
            }
        }
    }

    function recalcularResumen() {
        const productosCarrito = getCarrito();
        const subtotalSpan = document.getElementById("subtotal-carrito");
        const envioSpan = document.getElementById("envio-carrito");
        const totalSpan = document.getElementById("total-general");

        const entregaSeleccion = getMetodoEntrega();

        const subtotal = productosCarrito.reduce((acc, p) => acc + (Number(p.precio) * Number(p.cantidad)), 0);
        
        let envio = 0;
        if (subtotal > 0) {
            envio = entregaSeleccion.metodo === "delivery" ? COSTO_ENVIO : 0;
        }
        const total = subtotal + envio;

        if (subtotalSpan) subtotalSpan.textContent = `S/ ${subtotal.toFixed(2)}`;
        if (envioSpan) {
            envioSpan.textContent = `S/ ${envio.toFixed(2)}`;
            if (entregaSeleccion.metodo === "recojo") {
                envioSpan.textContent = "Gratis (Recojo)";
            }
        }
        if (totalSpan) totalSpan.textContent = `S/ ${total.toFixed(2)}`;
        actualizarInfoEntrega();
    } 

    function actualizarInfoEntrega() {
        const entregaSeleccion = getMetodoEntrega();
        const metodoEntregaSpan = document.getElementById("metodo-entrega");
        
        if (metodoEntregaSpan) {
            if (entregaSeleccion.metodo === "delivery") {
                metodoEntregaSpan.textContent = "Delivery";
            } else if (entregaSeleccion.metodo === "recojo") {
                metodoEntregaSpan.textContent = "Recojo en local";
            } else {
                metodoEntregaSpan.textContent = "Por confirmar";
            }
        }
    }

    function findItemIndexByRow(tr) {
        const id = tr?.dataset?.id;
        if (!id) return -1;
        const carrito = getCarrito();
        return carrito.findIndex(p => String(p.id) === String(id));
    }

    function onTablaClick(e) {
        const btn = e.target.closest('.btn-restar, .btn-sumar, .btn-eliminar, .btn-editar');
        if (!btn) return;

        const tr = e.target.closest('tr');
        const idx = findItemIndexByRow(tr);
        if (idx < 0) return;

        const carrito = getCarrito();

        // Restar
        if (btn.classList.contains('btn-restar')) {
            carrito[idx].cantidad = Math.max(1, Number(carrito[idx].cantidad) - 1);
            setCarrito(carrito);
            actualizarFilaYResumen(tr, carrito[idx]);
            return;
        }

        // Sumar
        if (btn.classList.contains('btn-sumar')) {
            carrito[idx].cantidad = Number(carrito[idx].cantidad) + 1;
            setCarrito(carrito);
            actualizarFilaYResumen(tr, carrito[idx]);
            return;
        }

        // Eliminar
        if (btn.classList.contains('btn-eliminar')) {
            carrito.splice(idx, 1);
            setCarrito(carrito);
            cargarCarritoResumen();
            return;
        }

        // Editar
        if (btn.classList.contains('btn-editar')) {
            window.location.href = '../../html/Menu.html';
            console.log('Editar producto', carrito[idx]);
        }
    }

    function onCantidadInput(e) {
        const input = e.target.closest('.cantidad-input');
        if (!input) return;

        const tr = e.target.closest('tr');
        const idx = findItemIndexByRow(tr);
        if (idx < 0) return;

        let nueva = parseInt(input.value, 10);
        if (isNaN(nueva) || nueva < 1) nueva = 1;

        const carrito = getCarrito();
        carrito[idx].cantidad = nueva;
        setCarrito(carrito);

        actualizarFilaYResumen(tr, carrito[idx]);
    }

    function actualizarFilaYResumen(tr, item) {
        // Actualizar el input
        const input = tr.querySelector('.cantidad-input');
        if (input) input.value = item.cantidad;

        // Subtotal de la fila
        const sub = tr.querySelector('.subtotal-item');
        if (sub) sub.textContent = `S/ ${(Number(item.precio) * Number(item.cantidad)).toFixed(2)}`;

        // Totales a la derecha
        recalcularResumen();
    }