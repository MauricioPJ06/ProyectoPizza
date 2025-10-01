const btnDelivery = document.getElementById("btn-delivery");
const btnRecojo = document.getElementById("btn-recojo");
const contenidoDerecha = document.getElementById("contenido-derecha");

function mostrarOpciones() {
    contenidoDerecha.innerHTML = `
        <h3 class="mb-0">Selecciona una opción</h3>
    `;
    marcarBotonActivo(null);
}

mostrarOpciones();

function marcarBotonActivo(tipo) {
    btnDelivery.classList.remove("active");
    btnRecojo.classList.remove("active");

    if (tipo === "delivery") btnDelivery.classList.add("active");
    if (tipo === "recojo") btnRecojo.classList.add("active");
}

function mostrarDelivery() {
    marcarBotonActivo("delivery");
    const mapaContainer = document.getElementById("mapa-container");
    mapaContainer.style.background = "none";
    contenidoDerecha.innerHTML = `
        <div class="w-100 h-100 position-relative p-4">
            <h4 class="text-white mb-3">Ingresa tu dirección para delivery</h4>
            <div class="d-flex mb-3"> 
                <input id="input-direccion" class="form-control me-2" placeholder="Ingresa tu dirección"/>
                <button id="btn-confirmar-ubicacion" class="btn btn-success position-absolute bottom-0 mb-3 ms-3">Confirmar ubicación</button>
            </div>
            <div style="height: calc(100% - 120px);"> 
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18..." 
                    width="100%" height="100%" style="border:0;" 
                    allowfullscreen="" loading="lazy">
                </iframe>
            </div>
            <button id="btn-volver-inicial" class="btn btn-secondary position-absolute bottom-0 mb-3 end-0 me-3">Volver</button>
        </div>
    `;

document.getElementById("btn-confirmar-ubicacion").addEventListener("click", () => {
    const direccion = document.getElementById("input-direccion").value.trim();
    if (!direccion) {
        alert("Ingresa una dirección antes de confirmar");
        return;
    }
    // Guardamos selección para usarla luego en la compra
    localStorage.setItem("entregaSeleccion", JSON.stringify({ metodo: "delivery", direccion }));
    window.location.href = "../Compra/Compra.html"; 
    });

    document.getElementById("btn-volver-inicial").addEventListener("click", mostrarOpciones);
}

function mostrarRecojo() {
    marcarBotonActivo("recojo");
    const mapaContainer = document.getElementById("mapa-container");
    mapaContainer.style.background = "none";
    contenidoDerecha.innerHTML = `
        <div class="w-100 h-100 p-4 bg-white rounded shadow-sm">
            <h4 class="mb-3 text-white">Selecciona tu sucursal</h4>
            <div class="d-flex mb-3"> 
                <select id="select-sucursal" class="form-select me-2">
                    <option value="">-- Selecciona --</option>
                    <option value="central">Sucursal San Martin de Porres</option>
                    <option value="norte">Sucursal Los Olivos</option>
                </select>
                <button id="btn-confirmar-sucursal" class="btn btn-success mt-3">Confirmar sucursal</button>
            </div>
            <div style="height: calc(100% - 120px);">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18..." 
                    width="100%" height="100%" style="border:0;" 
                    allowfullscreen="" loading="lazy">
                </iframe>
            </div>
            <button id="btn-volver-inicial-2" class="btn btn-secondary mt-3 ms-2">Volver</button>
        </div>
    `;

    document.getElementById("btn-confirmar-sucursal").addEventListener("click", () => {
        const select = document.getElementById("select-sucursal");
        const sucursal = select.value;
        if (!sucursal) {
            alert("Selecciona una sucursal antes de confirmar");
            return;
        }
        // Guardamos selección
        localStorage.setItem("entregaSeleccion", JSON.stringify({ metodo: "recojo", sucursal }));
        window.location.href = "../Compra/Compra.html"; 
    });

    document.getElementById("btn-volver-inicial-2").addEventListener("click", mostrarOpciones);
}

btnDelivery.addEventListener("click", mostrarDelivery);
btnRecojo.addEventListener("click", mostrarRecojo);