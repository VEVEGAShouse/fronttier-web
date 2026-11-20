# fronttier.io

La web de FRONTTIER AS. Es una sola página en HTML y CSS, sin programas ni pasos de compilación. GitHub Pages la publica gratis.

## Archivos

- `index.html`: la página (textos e imágenes).
- `styles.css`: el diseño (colores, tamaños, espacios).
- `404.html`: la página que se ve si alguien entra en una dirección que no existe.
- `favicon.svg`: el iconito de la pestaña.
- `CNAME`: le dice a GitHub que la web va en fronttier.io. No lo borres.
- `BRIEF.md`: el encargo original, por si alguien tiene que seguir construyendo.

## Cómo cambiar un texto sin programar

1. En GitHub, abre `index.html` y pulsa el lápiz (✏️ «Edit this file»).
2. Busca la frase con Ctrl+F (o Cmd+F), cámbiala y no toques lo que va entre `< >`.
3. Pulsa **Commit changes…** y después **Commit changes**.
4. En uno o dos minutos la web se actualiza sola.

## Cómo cambiar una imagen

Las imágenes de los proyectos vienen de Unsplash (gratis, de uso libre). Cada una es una dirección que empieza por `https://images.unsplash.com/photo-...`. Para cambiar una, sustituye esa dirección por la de otra foto.

Los parámetros del final (`w=1200&h=900`) recortan la foto a ese tamaño.

El logo y la imagen de portada siguen alojados en Webflow, en el proyecto «FRONTTIER landingpage». **No borres ese proyecto de Webflow** mientras la web los use.

## Colores

- Tinta: `#252f45`
- Gris: `#8a8f99`
- Fondo: blanco

Se cambian al principio de `styles.css`.
