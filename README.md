# CoffeeShop GB - PWA

Una Progressive Web App (PWA) de una cafetería que permite ver diferentes tipos de café en un catálogo responsive y ver detalles de cada uno.

## Características

- **Diseño responsive**: Las cards se adaptan a cualquier tamaño de pantalla (4 columnas en desktop, 2 en tablet, 1 en móvil)
- **PWA (Progressive Web App)**: Instalable en el navegador Chrome con icono en la barra
- **8 variedades de café**: Espresso, Americano, Cappuccino, Latte, Macchiato, Mocha, Cortado, Flat White
- **Página de detalle**: Al hacer clic en una card, se muestra información extendida (nombre, precio, descripción, imagen grande)
- **Service Worker**: Cacheo de archivos para funcionamiento offline

## Estructura

```
/
  index.html      - Catálogo principal con 8 cards
  detalle.html    - Página de detalle individual por café
  css/style.css   - Estilos base
  js/app.js       - Lógica JavaScript y registro de Service Worker
  manifest.json   - Configuración PWA
  serviceworker.js - Service Worker para offline y instalación
  imagenes/
    icons/        - Iconos PWA (192x192, 512x512)
    imgcard/      - Imágenes de las tazas de café (taza1.png - taza8.png)
```

## Cómo ejecutar localmente

```powershell
cd "C:\Users\AORUS\Desktop\10mo cuatri\beltran"
python -m http.server 8000
```

Abre `http://localhost:8000` en tu navegador.

## Despliegue en GitHub Pages

1. Entra al repositorio en GitHub
2. Ve a **Settings → Pages**
3. Selecciona la rama `main` y el folder `/ (root)`
4. Tu sitio estará disponible en: `https://norberto666-dre.github.io/beltran/`