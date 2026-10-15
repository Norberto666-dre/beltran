// CoffeeShop GB - lógica compartida (inicio + detalle)

const coffees = [
  {
    id: 1,
    nombre: "Espresso",
    precio: "45",
    descripcion: "Café concentrado de sabor intenso, preparado con agua a alta presión. Cuerpo denso y crema dorada en la parte superior.",
    imagen: "taza1.png",
    notas: ["Chocolate negro", "Avellana", "Caramelo"],
    intensidad: 5
  },
  {
    id: 2,
    nombre: "Americano",
    precio: "50",
    descripcion: "Espresso suavizado con agua caliente, ideal para cualquier momento del día. Sabor más suave que el espresso puro.",
    imagen: "taza2.png",
    notas: ["Nuez", "Cacao", "Limpio"],
    intensidad: 3
  },
  {
    id: 3,
    nombre: "Cappuccino",
    precio: "55",
    descripcion: "Equilibrio perfecto entre espresso, leche vaporizada y espuma cremosa. Tradición italiana en cada taza.",
    imagen: "taza3.png",
    notas: ["Vainilla", "Leche", "Cacao"],
    intensidad: 3
  },
  {
    id: 4,
    nombre: "Latte",
    precio: "60",
    descripcion: "Espresso con abundante leche vaporizada, suave y sedoso al paladar. Perfecto para quienes prefieren menos intensidad.",
    imagen: "taza4.png",
    notas: ["Caramelo", "Almendra", "Crema"],
    intensidad: 2
  },
  {
    id: 5,
    nombre: "Macchiato",
    precio: "50",
    descripcion: "Espresso marcado con un toque de espuma de leche, intenso y aromático. Significa 'manchado' en italiano.",
    imagen: "taza5.png",
    notas: ["Miel", "Malta", "Espresso"],
    intensidad: 4
  },
  {
    id: 6,
    nombre: "Mocha",
    precio: "65",
    descripcion: "La combinación perfecta de espresso, chocolate y leche vaporizada. Para los amantes del chocolate con café.",
    imagen: "taza6.png",
    notas: ["Chocolate", "Cobre", "Postre"],
    intensidad: 4
  },
  {
    id: 7,
    nombre: "Cortado",
    precio: "50",
    descripcion: "Espresso cortado con un splash de leche caliente, balanceado y directo. Menor leche que un latte, más intensidad.",
    imagen: "taza7.png",
    notas: ["Nuez moscada", "Cacao", "Sedoso"],
    intensidad: 4
  },
  {
    id: 8,
    nombre: "Flat White",
    precio: "70",
    descripcion: "Doble espresso con leche micro-espumada, cremoso y sin burbujas grandes. Origen australiano, textura sedosa.",
    imagen: "taza8.png",
    notas: ["Caramelo", "Cacao", "Microespuma"],
    intensidad: 4
  }
];

const CLAVE_PEDIDO = "coffeeshop-pedido";

function obtenerParametro(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

function normalizar(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obtenerPedido() {
  try {
    return parseInt(localStorage.getItem(CLAVE_PEDIDO), 10) || 0;
  } catch (error) {
    return 0;
  }
}

function guardarPedido(total) {
  try {
    localStorage.setItem(CLAVE_PEDIDO, String(total));
  } catch (error) {
    // localStorage no disponible (modo privado): el contador solo vive en memoria
  }
}

function pintarContadorPedido(bump) {
  const contador = document.getElementById("cart-count");
  if (!contador) return;
  contador.textContent = String(obtenerPedido());
  if (bump) {
    contador.classList.remove("is-bump");
    void contador.offsetWidth;
    contador.classList.add("is-bump");
  }
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add("is-visible");
  clearTimeout(mostrarToast.timer);
  mostrarToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("serviceworker.js", { updateViaCache: "none" })
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const nuevo = registration.installing;
          if (!nuevo) return;
          nuevo.addEventListener("statechange", () => {
            if (nuevo.state === "installed" && navigator.serviceWorker.controller) {
              mostrarToast("Nueva versión disponible. Recarga para actualizar.");
            }
          });
        });
      })
      .catch((error) => console.error("Error al registrar el Service Worker:", error));
  });
}

function initBuscador() {
  const input = document.getElementById("buscar-cafe");
  const grid = document.getElementById("product-grid");
  const vacio = document.getElementById("empty-state");
  if (!input || !grid) return;

  const tarjetas = Array.from(grid.querySelectorAll(".product-card"));

  input.addEventListener("input", () => {
    const consulta = normalizar(input.value.trim());
    let visibles = 0;

    tarjetas.forEach((tarjeta) => {
      const texto = normalizar(
        `${tarjeta.dataset.nombre || ""} ${tarjeta.textContent}`
      );
      const coincide = !consulta || texto.includes(consulta);
      tarjeta.hidden = !coincide;
      if (coincide) visibles += 1;
    });

    if (vacio) vacio.hidden = visibles > 0;
  });
}

function pintarIntensidad(nivel) {
  const meter = document.getElementById("intensidad-placeholder");
  if (!meter) return;
  meter.innerHTML = "";
  for (let i = 1; i <= 5; i += 1) {
    const barra = document.createElement("span");
    if (i <= nivel) barra.className = "on";
    meter.appendChild(barra);
  }
}

function pintarNotas(notas) {
  const contenedor = document.getElementById("notas-placeholder");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  (notas || []).forEach((nota) => {
    const li = document.createElement("li");
    li.textContent = nota;
    contenedor.appendChild(li);
  });
}

function initControlesDetalle(cafe) {
  const input = document.getElementById("qty-input");
  const menos = document.getElementById("qty-minus");
  const mas = document.getElementById("qty-plus");
  const agregar = document.getElementById("btn-agregar");

  const cantidad = () => Math.max(1, parseInt(input.value, 10) || 1);

  if (menos) menos.addEventListener("click", () => (input.value = String(Math.max(1, cantidad() - 1))));
  if (mas) mas.addEventListener("click", () => (input.value = String(Math.min(99, cantidad() + 1))));

  if (agregar) {
    agregar.addEventListener("click", () => {
      const total = obtenerPedido() + cantidad();
      guardarPedido(total);
      pintarContadorPedido(true);
      mostrarToast(`${cantidad()} × ${cafe.nombre} agregado al pedido`);
    });
  }

  const anterior = document.getElementById("nav-anterior");
  const siguiente = document.getElementById("nav-siguiente");
  const previo = coffees.find((c) => c.id === cafe.id - 1);
  const proximo = coffees.find((c) => c.id === cafe.id + 1);

  if (anterior) {
    if (previo) {
      anterior.href = `detalle.html?id=${previo.id}`;
      anterior.querySelector("span:last-child").textContent = previo.nombre;
    } else {
      anterior.hidden = true;
    }
  }

  if (siguiente) {
    if (proximo) {
      siguiente.href = `detalle.html?id=${proximo.id}`;
      siguiente.querySelector("span:first-child").textContent = proximo.nombre;
    } else {
      siguiente.hidden = true;
    }
  }
}

function mostrarNoEncontrado(id) {
  const imgWrapper = document.getElementById("img-placeholder");
  if (imgWrapper) imgWrapper.innerHTML = '<span class="img-loading">Café no encontrado</span>';

  const titulo = document.getElementById("title-placeholder");
  if (titulo) titulo.textContent = "Café no encontrado";

  const precio = document.getElementById("precio-placeholder");
  if (precio) precio.textContent = "";

  const descripcion = document.getElementById("descripcion-placeholder");
  if (descripcion) descripcion.textContent = `El café con ID ${id || "?"} no existe en nuestro catálogo.`;

  const breadcrumb = document.getElementById("breadcrumb-actual");
  if (breadcrumb) breadcrumb.textContent = "No encontrado";

  const badge = document.getElementById("badge-placeholder");
  if (badge) badge.textContent = "—";

  const idElem = document.getElementById("id-placeholder");
  if (idElem) idElem.textContent = "?";

  pintarIntensidad(0);
  document.title = "Café no encontrado | CoffeeShop GB";
}

function pintarDetalle(id) {
  const cafe = coffees.find((c) => c.id === parseInt(id, 10));

  if (!cafe) {
    mostrarNoEncontrado(id);
    return false;
  }

  const imgWrapper = document.getElementById("img-placeholder");
  if (imgWrapper) {
    const img = document.createElement("img");
    img.src = `imagenes/imgcard/${cafe.imagen}`;
    img.alt = cafe.nombre;
    img.width = 300;
    img.height = 300;
    img.decoding = "async";
    imgWrapper.innerHTML = "";
    imgWrapper.appendChild(img);
  }

  const titulo = document.getElementById("title-placeholder");
  if (titulo) titulo.textContent = cafe.nombre;

  const precio = document.getElementById("precio-placeholder");
  if (precio) precio.innerHTML = `$${cafe.precio} <small>MXN</small>`;

  const descripcion = document.getElementById("descripcion-placeholder");
  if (descripcion) descripcion.textContent = cafe.descripcion;

  const badge = document.getElementById("badge-placeholder");
  if (badge) badge.textContent = cafe.nombre;

  const breadcrumb = document.getElementById("breadcrumb-actual");
  if (breadcrumb) breadcrumb.textContent = cafe.nombre;

  const idElem = document.getElementById("id-placeholder");
  if (idElem) idElem.textContent = String(cafe.id);

  pintarNotas(cafe.notas);
  pintarIntensidad(cafe.intensidad);
  initControlesDetalle(cafe);

  document.title = `${cafe.nombre} | CoffeeShop GB`;
  return true;
}

function esRutaDeDetalle() {
  const ruta = window.location.pathname.replace(/\/+$/, "");
  return /\/detalle$/.test(ruta);
}

document.addEventListener("DOMContentLoaded", () => {
  const detalleCard = document.getElementById("detalle-card");
  const btnVolver = document.getElementById("btn-volver");

  if (detalleCard) {
    // Seguridad: algunos servidores con "pretty URLs" o fallbacks SPA sirven
    // el contenido del index en rutas tipo /detalle. Redirigimos al archivo real.
    if (esRutaDeDetalle()) {
      window.location.replace(`detalle.html${window.location.search}`);
      return;
    }

    const id = obtenerParametro("id") || "1";
    pintarDetalle(id);

    if (btnVolver) {
      btnVolver.addEventListener("click", (evento) => {
        if (window.history.length > 1 && document.referrer) {
          evento.preventDefault();
          window.history.back();
        }
      });
    }
  } else {
    initBuscador();
  }

  pintarContadorPedido(false);

  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      const total = obtenerPedido();
      mostrarToast(
        total > 0
          ? `Tu pedido: ${total} café${total === 1 ? "" : "s"} listo(s) para pagar`
          : "Tu pedido está vacío. Agrega un café desde el catálogo."
      );
    });
  }

  const header = document.querySelector(".site-header");
  if (header) {
    const alHacerScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    alHacerScroll();
    window.addEventListener("scroll", alHacerScroll, { passive: true });
  }

  registrarServiceWorker();
});

window.coffees = coffees;
