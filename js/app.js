// Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('serviceworker.js')
      .then(registration => {
        console.log('SW registrado con scopes:', registration.scope);
      })
      .catch(registrationError => {
        console.error('Error al registrar SW:', registrationError);
      });
  });
}

// Datos de los 8 cafés (precios y descripciones de ejemplo)
const cafes = [
  {
    id: 1,
    nombre: "Espresso",
    precio: "$45 MXN",
    descripcion: "Café concentrado de sabor intenso, preparado con agua a alta presión. Cuerpo denso y crema dorada en la parte superior.",
    imagen: "taza1.png",
    imagenGrande: "taza1.png"
  },
  {
    id: 2,
    nombre: "Americano",
    precio: "$50 MXN",
    descripcion: "Espresso suavizado con agua caliente, ideal para cualquier momento del día. Sabor más suave que el espresso puro.",
    imagen: "taza2.png",
    imagenGrande: "taza2.png"
  },
  {
    id: 3,
    nombre: "Cappuccino",
    precio: "$55 MXN",
    descripcion: "Equilibrio perfecto entre espresso, leche vaporizada y espuma cremosa. Tradición italiana en cada taza.",
    imagen: "taza3.png",
    imagenGrande: "taza3.png"
  },
  {
    id: 4,
    nombre: "Latte",
    precio: "$60 MXN",
    descripcion: "Espresso con abundante leche vaporizada, suave y sedoso al paladar. Perfecto para quienes prefieren menos intensidad.",
    imagen: "taza4.png",
    imagenGrande: "taza4.png"
  },
  {
    id: 5,
    nombre: "Macchiato",
    precio: "$50 MXN",
    descripcion: "Espresso marcado con un toque de espuma de leche, intenso y aromático. Significa 'manchado' en italiano.",
    imagen: "taza5.png",
    imagenGrande: "taza5.png"
  },
  {
    id: 6,
    nombre: "Mocha",
    precio: "$65 MXN",
    descripcion: "La combinación perfecta de espresso, chocolate y leche vaporizada. Para los amantes del chocolate con café.",
    imagen: "taza6.png",
    imagenGrande: "taza6.png"
  },
  {
    id: 7,
    nombre: "Cortado",
    precio: "$50 MXN",
    descripcion: "Espresso cortado con un splash de leche caliente, balanceado y directo. Menor leche que un latte, más intensidad.",
    imagen: "taza7.png",
    imagenGrande: "taza7.png"
  },
  {
    id: 8,
    nombre: "Flat White",
    precio: "$70 MXN",
    descripcion: "Doble espresso con leche micro-espumada, cremoso y sin burbujas grandes. Origen australiano, textura sedosa.",
    imagen: "taza8.png",
    imagenGrande: "taza8.png"
  }
];

// Elementos del DOM - se obtienen después de cargar el DOM
let detalleDiv = null;
const imgPlaceholder = null; // Se obtendrá en DOMContentLoaded
const titlePlaceholder = null;
const precioPlaceholder = null;
const descripcionPlaceholder = null;
const idPlaceholder = null;

// Función para parsear los parámetros de la URL
function obtenerParametro(nombre) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(nombre);
}

// Función para rellenar la card con los datos del café
function rellenarCard(id) {
  const cafe = cafes.find(c => c.id === parseInt(id));
  
  if (!cafe) {
    // Mostrar estado de "no encontrado"
    const imgWrapper = document.getElementById('img-placeholder');
    const title = document.getElementById('title-placeholder');
    const precio = document.getElementById('precio-placeholder');
    const descripcion = document.getElementById('descripcion-placeholder');
    const idElem = document.getElementById('id-placeholder');
    
    if (imgWrapper) imgWrapper.innerHTML = "Café no encontrado";
    if (title) title.textContent = "Café no encontrado";
    if (precio) precio.textContent = "";
    if (descripcion) descripcion.textContent = `El café con ID ${id} no existe en nuestro catálogo.`;
    if (idElem) idElem.textContent = "";
    return;
  }
  
  // Rellenar la card con los datos del café
  const imgWrapper = document.getElementById('img-placeholder');
  const title = document.getElementById('title-placeholder');
  const precioElem = document.getElementById('precio-placeholder');
  const descripcionElem = document.getElementById('descripcion-placeholder');
  const idElem = document.getElementById('id-placeholder');
  
  if (imgWrapper) {
    // Crear elemento de imagen
    const imgElem = document.createElement('img');
    imgElem.src = `imagenes/imgcard/${cafe.imagenGrande}`;
    imgElem.alt = cafe.nombre;
    imgElem.style.width = "100%";
    imgElem.style.height = "200px";
    imgElem.style.objectFit = "cover";
    imgElem.style.borderRadius = "8px";
    imgElem.style.marginBottom = "1rem";
    imgWrapper.innerHTML = "";
    imgWrapper.appendChild(imgElem);
  }
  
  if (title) title.textContent = cafe.nombre;
  if (precioElem) precioElem.textContent = cafe.precio;
  if (descripcionElem) descripcionElem.textContent = cafe.descripcion;
  if (idElem) idElem.textContent = `#${cafe.id}`;
}

// Evento: al cargar la página, verificar si hay un parámetro 'id'
document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a los elementos después de que el DOM esté listo
  const imgWrapper = document.getElementById('img-placeholder');
  const title = document.getElementById('title-placeholder');
  const precio = document.getElementById('precio-placeholder');
  const descripcion = document.getElementById('descripcion-placeholder');
  const idElem = document.getElementById('id-placeholder');
  const btnVolver = document.getElementById('btn-volver');
  
  // Obtener el parámetro id de la URL
  const id = obtenerParametro('id');
  
  if (id) {
    // Estamos en detalle.html con un ID
    rellenarCard(id);
  } else {
    // Si no hay ID, mostramos el primer café por defecto
    rellenarCard(1);
  }
  
  // Evento del botón volver
  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
});

// Exportar funciones para uso global si es necesario
window.caFes = cafes;
window.rellenarCard = rellenarCard;