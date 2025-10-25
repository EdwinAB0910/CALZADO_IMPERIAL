document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    cargarProductos();
    configurarFiltros();
    configurarPaginacion();
    iniciarTransicionAutomatica();
});

let productos = [];
let productosFiltrados = [];
let paginaActual = 0;
const productosPorPagina = 4;
let transicionAutomatica;

function actualizarContadorCarrito() {
    fetch("scripts/carrito.php")
        .then(response => response.json())
        .then(productos => {
            let cantidadTotal = productos.reduce((total, producto) => total + producto.cantidad, 0);
            document.querySelector(".contador").textContent = cantidadTotal;
        })
        .catch(error => console.error("Error al actualizar el contador del carrito:", error));
}

function cargarProductos() {
    fetch("scripts/productos.php")
        .then(response => response.json())
        .then(data => {
            productos = data;
            productosFiltrados = [...productos];
            mostrarProductos();
            llenarFiltros();
        })
        .catch(error => console.error("Error cargando productos:", error));
}

function mostrarProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    let inicio = paginaActual * productosPorPagina;
    let productosPagina = productosFiltrados.slice(inicio, inicio + productosPorPagina);

    productosPagina.forEach(producto => {
        const productoHTML = `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>Precio: S/${producto.precio}</p>
                <p>Stock: ${producto.stock > 0 ? producto.stock : "<span class='sin-stock'>Agotado</span>"}</p>
                <button class="agregar-carrito" data-id="${producto.id}" ${producto.stock > 0 ? "" : "disabled style='background-color: grey; cursor: not-allowed;'"}>Agregar</button>
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });

    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", () => {
            let productoId = boton.dataset.id;
            agregarAlCarrito(productoId);
        });
    });

    document.getElementById("prev").disabled = paginaActual === 0;
    document.getElementById("next").disabled = (inicio + productosPorPagina) >= productosFiltrados.length;
}

function filtrarPorPrecio(precio, filtro) {
    switch (filtro) {
        case "menos-200": return precio < 200;
        case "200-500": return precio >= 200 && precio <= 500;
        case "500-1000": return precio > 500 && precio <= 1000;
        case "1000-2000": return precio > 1000 && precio <= 2000;
        case "mas-2000": return precio > 2000;
        default: return true;
    }
}

function agregarAlCarrito(productoId) {
    fetch("scripts/carrito.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto_id: productoId, cantidad: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Producto agregado al carrito");
        } else {
            alert("Error al agregar producto: " + data.error);
        }
    })
    .catch(error => console.error("Error al enviar al carrito:", error));
}

function configurarFiltros() {
    document.getElementById("filtro-precio").addEventListener("change", aplicarFiltros);
    document.getElementById("filtro-genero").addEventListener("change", aplicarFiltros);
    document.getElementById("filtro-categoria").addEventListener("change", () => {
        actualizarMarcas();
        aplicarFiltros();
    });
    document.getElementById("filtro-marca").addEventListener("change", aplicarFiltros);
    document.getElementById("buscar").addEventListener("input", aplicarFiltros);
}

function actualizarMarcas() {
    const filtroMarca = document.getElementById("filtro-marca");
    const categoriaSeleccionada = document.getElementById("filtro-categoria").value;

    let marcasFiltradas = productos
        .filter(p => p.categoria === categoriaSeleccionada)
        .map(p => p.marca);
    
    filtroMarca.innerHTML = `<option value="">-- Seleccionar marca --</option>`;
    [...new Set(marcasFiltradas)].forEach(marca => {
        filtroMarca.innerHTML += `<option value="${marca}">${marca}</option>`;
    });
}

function actualizarFiltrosActivos() {
    const contenedor = document.getElementById("filtros-activos");
    contenedor.innerHTML = "";

    document.querySelectorAll("#barra-filtros select, #buscar").forEach(filtro => {
        if (filtro.value !== "") {
            const div = document.createElement("div");
            div.className = "filtro-activo";
            div.innerHTML = `${filtro.options[filtro.selectedIndex].text} <span class="eliminar-filtro" data-id="${filtro.id}">×</span>`;
            contenedor.appendChild(div);
        }
    });

    document.querySelectorAll(".eliminar-filtro").forEach(btn => {
        btn.addEventListener("click", e => {
            document.getElementById(e.target.dataset.id).value = "";
            aplicarFiltros();
        });
    });
}

function aplicarFiltros() {
    clearInterval(transicionAutomatica);
    
    let precio = document.getElementById("filtro-precio").value;
    let genero = document.getElementById("filtro-genero").value;
    let categoria = document.getElementById("filtro-categoria").value;
    let marca = document.getElementById("filtro-marca").value;
    let busqueda = document.getElementById("buscar").value.toLowerCase();

    productosFiltrados = productos.filter(producto => {
        return (
            (precio === "" || filtrarPorPrecio(producto.precio, precio)) &&
            (genero === "" || producto.genero === genero) &&
            (categoria === "" || producto.categoria === categoria) &&
            (marca === "" || producto.marca === marca) &&
            (busqueda === "" || producto.nombre.toLowerCase().includes(busqueda))
        );
    });

    paginaActual = 0;
    mostrarProductos();
    actualizarFiltrosActivos();
}

function iniciarTransicionAutomatica() {
    transicionAutomatica = setInterval(() => {
        if (paginaActual < Math.ceil(productosFiltrados.length / productosPorPagina) - 1) {
            paginaActual++;
        } else {
            paginaActual = 0;
        }
        mostrarProductos();
    }, 100000);
}

function configurarPaginacion() {
    document.getElementById("prev").addEventListener("click", () => {
        if (paginaActual > 0) {
            paginaActual--;
            mostrarProductos();
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        let maxPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) - 1;
        if (paginaActual < maxPaginas) {
            paginaActual++;
            mostrarProductos();
        }
    });
}