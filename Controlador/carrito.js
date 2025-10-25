document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
});

function cargarCarrito() {
    fetch("scripts/carrito.php")
        .then(response => response.json())
        .then(productos => {
            mostrarCarrito(productos);
        })
        .catch(error => console.error("Error al cargar el carrito:", error));
}

function mostrarCarrito(productos) {
    const contenedor = document.getElementById("lista-carrito");
    const detalleResumen = document.getElementById("detalle-resumen");
    const contadorCarrito = document.querySelector(".contador"); // Seleccionar el contador

    contenedor.innerHTML = `
        <div id="encabezado-carrito">
            <span>PRODUCTO</span>
            <span>PRECIO</span>
            <span>CANTIDAD</span>
            <span>TOTAL</span>
        </div>
    `; // Nueva cabecera

    detalleResumen.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    if (productos.length === 0) {
        contenedor.innerHTML += "<p>El carrito está vacío.</p>";
        detalleResumen.innerHTML = "<p>No hay productos en el resumen.</p>";
        contadorCarrito.textContent = "0"; // Actualizar el contador a 0 si el carrito está vacío
        return;
    }

    productos.forEach(producto => {
        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;

        const tallaGuardada = localStorage.getItem(`talla-${producto.id}`) || "34";
        const colorGuardado = localStorage.getItem(`color-${producto.id}`) || "ninguno";

        const item = document.createElement("div");
        item.classList.add("item-carrito");

        item.innerHTML = `
            <div class="detalle">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-producto">
                <h3>${producto.nombre}</h3>

                <label for="talla-${producto.id}">Talla:</label>
                <select id="talla-${producto.id}" onchange="guardarSeleccion(${producto.id})">
                    ${generarOpcionesTalla(tallaGuardada)}
                </select>

                <label for="color-${producto.id}">Color:</label>
                <select id="color-${producto.id}" onchange="guardarSeleccion(${producto.id})">
                    <option value="ninguno" ${colorGuardado === "ninguno" ? "selected" : ""}>Ninguno</option>
                    <option value="azul" ${colorGuardado === "azul" ? "selected" : ""}>Azul</option>
                    <option value="rojo" ${colorGuardado === "rojo" ? "selected" : ""}>Rojo</option>
                    <option value="amarillo" ${colorGuardado === "amarillo" ? "selected" : ""}>Amarillo</option>
                </select>
            </div>

            <span>S/${parseFloat(producto.precio).toFixed(2)}</span>

            <div class="controles-cantidad">
                <button onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                <span id="cantidad-${producto.id}">${producto.cantidad}</span>
                <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
            </div>

            <span>S/${(producto.precio * producto.cantidad).toFixed(2)}</span>

            <button onclick="confirmarEliminacion(${producto.id})" class="eliminar">
                <img src="recursos/imagen/eliminar.png" alt="Eliminar producto" style="width: 24px; height: 30px;">
            </button>
        `;
        contenedor.appendChild(item);
    });

    // Actualizar solo la parte de productos y total en el resumen
    detalleResumen.innerHTML = `
        <p>Productos: ${cantidadTotal}</p>
        <p>Total: S/${total.toFixed(2)}</p>
        <button onclick="vaciarCarrito()">Vaciar carrito</button>
    `;

    // Actualizar el contador del carrito
    contadorCarrito.textContent = cantidadTotal;
}

// Generar opciones de talla
function generarOpcionesTalla(tallaSeleccionada) {
    let opciones = "";
    for (let i = 34; i <= 44; i++) {
        opciones += `<option value="${i}" ${i == tallaSeleccionada ? "selected" : ""}>${i}</option>`;
    }
    return opciones;
}

// Guardar selecciones en localStorage
function guardarSeleccion(id) {
    const talla = document.getElementById(`talla-${id}`).value;
    const color = document.getElementById(`color-${id}`).value;
    localStorage.setItem(`talla-${id}`, talla);
    localStorage.setItem(`color-${id}`, color);
}

// Confirmar eliminación de producto
function confirmarEliminacion(id) {
    if (confirm("¿Seguro que deseas eliminar este producto del carrito?")) {
        eliminarDelCarrito(id);
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    fetch("scripts/carrito.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        alert(data.success || data.error);
        localStorage.removeItem(`talla-${id}`);
        localStorage.removeItem(`color-${id}`);
        cargarCarrito();
    })
    .catch(error => console.error("Error al eliminar producto:", error));
}

// Cambiar cantidad de productos
function cambiarCantidad(id, cambio) {
    let cantidadElemento = document.getElementById(`cantidad-${id}`);
    let nuevaCantidad = parseInt(cantidadElemento.textContent) + cambio;

    if (nuevaCantidad < 1) return; // No permitir cantidades menores a 1

    fetch("scripts/carrito.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `producto_id=${id}&cantidad=${cambio}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cantidadElemento.textContent = nuevaCantidad;
            cargarCarrito();
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error("Error al actualizar cantidad:", error));
}

// Vaciar carrito
function vaciarCarrito() {
    if (confirm("¿Seguro que deseas vaciar todo el carrito?")) {
        fetch("scripts/carrito.php?vaciar=1", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.success || data.error);
            localStorage.clear(); // Limpiar la talla y color de los productos guardados
            cargarCarrito(); // Recargar el carrito vacío
        })
        .catch(error => console.error("Error al vaciar el carrito:", error));
    }
}

