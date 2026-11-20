# BRIEF — Nueva web de FRONTTIER (fronttier.io)

Para: Claude Code (o quien la construya)
De: Virginia E. Vegas (VE VEGAS), FRONTTIER AS
Fecha: 20 nov 2026

---

## 1. Qué hay que hacer

Una **landing de una sola página** para FRONTTIER AS, publicada **gratis** en **GitHub Pages** con el dominio **fronttier.io** (con doble T).

- Repositorio: `VEVEGAShouse/fronttier-web` (cuenta de GitHub **VEVEGAShouse**). Público.
- Sin coste: nada de hosting de pago, plantillas de pago ni fuentes con licencia comercial.
- Más adelante se añadirán páginas (por ejemplo, una por proyecto). Deja la estructura preparada para eso, pero ahora **solo hay una página**.

## 2. Reglas de trabajo

- **HTML + CSS a mano, en archivos estáticos.** Nada de frameworks, nada de paso de compilación y JavaScript mínimo, que la página debe funcionar sin él. Estructura: `index.html`, `styles.css`, `assets/`, `CNAME`, `favicon`.
- Virginia **no es programadora**. Explícale cada paso en español y en lenguaje sencillo. Enséñale una vista previa antes de publicar.
- **No toques el DNS ni ninguna cuenta sin que ella lo apruebe.** Cuando haya que cambiar algo en el registrador del dominio, dile exactamente qué líneas cambiar y que lo haga ella, o hazlo con su visto bueno.
- No envíes correos ni mensajes en su nombre.
- Haz commits pequeños con mensajes claros.

## 3. De dónde partimos

Había una web en Webflow: el proyecto «FRONTTIER landingpage» (`fronttier-2025`), ahora sin publicar. **A Virginia le gusta su estilo**, pero dice que **hablaba demasiado**. El encargo es **quedarse con la idea y la estética y quitar todo lo que sobra**: algo **elegante**, que quien entre en fronttier.io vea **cosas chulas** y entienda en diez segundos qué es FRONTTIER.

**Lo que tenía la web antigua (resumen):**

- Hero con una escultura abstracta azul de fondo, el titular «Strategies that shape the future.» y un botón «Let's talk».
- Un párrafo grande: consultora económica para la era de la innovación.
- «Featured projects»: Europeism, The Greenland Opportunity, ARCTICONOMICS y NORDIC RE:TURNS, cada uno con imagen, una línea y «Learn more».
- «Our capabilities»: el titular «We help find clarity in chaos», un párrafo y tres tarjetas.
- «Why FRONTTIER?»: tres puntos.
- «FRONTTIER by the numbers»: 2023, 300+ clientes, 50+ expertos, 15+ proyectos.
- Un CTA final, y un pie con dirección de Spaces Lysaker, teléfono, email, redes, menú, banner de cookies y política de privacidad.

## 4. La nueva página: estructura y textos

El texto final va **en inglés**. Lo que sigue es la propuesta. Puedes pulir el ritmo, pero sin añadir más texto.

### 4.1 Cabecera (fina, sin menú hamburguesa)
- Izquierda: el wordmark **FRONTTIER** (logo antiguo, ver Assets).
- Derecha: un único enlace, `Contact`, que abre un mailto a admin@fronttier.io.

### 4.2 Hero
- Imagen grande a casi todo el ancho, con esquinas redondeadas (como en la web antigua): la escultura azul.
- Titular grande sobre la imagen: **Strategies that shape the future.**
- Debajo, en pequeño: *An economic consultancy for the innovation age.*

### 4.3 Declaración (un solo párrafo, tipografía grande)
> We help founders, investors and institutions **make sense of innovation** — through unconventional thinking and economic reasoning.

Igual que en la web antigua, unas pocas palabras van en gris para dar ritmo.

### 4.4 Selected work (el momento «cosas chulas»)
Rejilla de 2×2 en escritorio y una columna en móvil. **Las imágenes mandan.** Solo título y una línea, sin «Learn more» (todavía no hay páginas de proyecto). Al pasar el ratón, un zoom muy sutil de la imagen.

| Proyecto | Línea |
|---|---|
| Europeism | Rethinking and relaunching the idea of Europe. |
| The Greenland Opportunity | An investment thesis for Greenland. |
| Arcticonomics | The Arctic as an economic system. |
| Nordic Re:turns | Returns from the efficient use of resources. |

### 4.5 Approach (tres líneas, nada más)
Encabezado: **Clarity in chaos.**
- **Unconventional thinking** — Economic rigour meets creative problem-solving.
- **Insight** — How innovation reshapes markets, sectors and outcomes.
- **Models & frameworks** — Tools that clarify thinking and support better decisions.

Opcional: usar como acento una sola de las imágenes antiguas de esta sección, el busto pixelado. No las tres tarjetas.

### 4.6 Cierre
Una frase grande enlazada a un mailto a admin@fronttier.io: **Explore the new fronttiers with us →**

### 4.7 Pie (una o dos líneas)
`FRONTTIER AS · Norway · admin@fronttier.io · LinkedIn · © 2026`

### 4.8 Lo que se elimina a propósito
- Los números (300+ clientes, 50+ expertos, etc.). **No se publican cifras.**
- El teléfono y la dirección completa de Spaces.
- El menú hamburguesa, «All projects», «Why FRONTTIER?» y la frase «Don't be left behind».
- El banner de cookies y la política de privacidad: **no hay analítica ni cookies**, así que no hacen falta. Si en el futuro se añade analítica, que sea sin cookies.
- El enlace a X/Twitter y a Instagram, salvo que Virginia diga lo contrario.

## 5. Dirección visual

Sobria, editorial y con aire. Mucho espacio en blanco y pocas cosas, cada una muy bien puesta.

- **Tipografía:** la web antigua usaba Neue Montreal (titulares) e Inter Tight (texto). Neue Montreal **requiere licencia para uso comercial**, así que usa **Inter Tight** (Google Fonts, gratis), autoalojada en `assets/fonts` si es posible. Titulares grandes, peso 500 y espaciado de letras ligeramente negativo. Texto a 17–18 px.
- **Colores:**
  - Tinta: `#252F45` (azul marino casi negro, el de la web antigua).
  - Gris de énfasis: `#8A8F99` aprox.
  - Fondo: blanco, o un blanco roto `#F5F5F4`.
  - Línea fina: `#E5E5E5`.
  - El color lo ponen **las imágenes**. No añadas más colores de interfaz.
- **Formas:** imágenes con un radio de 16–20 px. Botones discretos, o mejor enlaces con flecha.
- **Movimiento:** solo un fundido suave al aparecer cada sección y el zoom en hover. Respeta `prefers-reduced-motion`.
- **Ancho máximo** del contenido: unos 1200 px. **Móvil primero**: tiene que verse perfecta en un teléfono.

## 6. Assets (descárgalos al empezar)

Están en el CDN de Webflow del proyecto antiguo. Descárgalos a `assets/img/`, conviértelos a WebP (unos 1600 px de ancho como máximo para las grandes) y no enlaces nunca al CDN de Webflow. Casi todas son fotos de Unsplash, de uso libre. Asigna cada imagen al proyecto mirándolas:

- Europeism: escultura de láminas cobrizas/naranjas.
- Greenland: iglesia negra en la nieve.
- Arcticonomics: iceberg visto desde arriba sobre agua oscura.
- Nordic Re:turns: cubos negros conectados con líneas.

Base: `https://cdn.prod.website-files.com/67dc543bd7a45db2d9efbc74/`

- `67dc54d0c21cfcdb769632b3_fronttier_wordmark_black.png` (logo)
- `67dc7f0b3eba6c72e885eb94_3515758-uhd_3840_2160_25fps%20%281%29-poster-00001.jpg` (fondo del hero: escultura azul; era el póster de un vídeo)
- `67f1207a9fcb04b14eefc23d_Frame%20136%20(2).webp`
- `6a0451b8ce003312fc7710b3_dynamic-wang-S5pMXEuLI_Q-unsplash.jpg`
- `6a0447cad0db9e87476e8838_luke-stackpoole--iWsKM16ruo-unsplash.jpg`
- `683e973ea0ecf203551a341c_rod-long-oGYmOAVDDyw-unsplash.jpg`
- `683ea945110ae0605b89e8b8_shubham-dhage-R2HtYWs5-QA-unsplash.jpg`
- `67f121e46b0f2746dc07683f_resource-database-giRAZHzYtpw-unsplash%20(1).webp`
- `67dea938d88e614e5dc8c4c8_matt-ridley-mMgHe5h0_U4-unsplash.jpg`
- `67e8792f82ae2a6da4efe0e4_resource-database-TIUyoNGM0no-unsplash.jpg`
- `67dc9138cb88eaa8c6f39954_destiny-ayodele-0xdWoqxoF_Q-unsplash%20(2).jpg`

Si alguna no se descarga, pídele a Virginia que la exporte desde Webflow (Assets).

## 7. Detalles técnicos que no pueden faltar

- `<html lang="en">`.
- Title: `FRONTTIER — Strategies that shape the future`.
- Meta description de una línea.
- Open Graph (título, descripción e imagen del hero en 1200×630), para que se vea bien al compartir en LinkedIn.
- Favicon (una «F» con el color de tinta).
- Textos alternativos en todas las imágenes, contraste AA y navegable con teclado.
- Peso total por debajo de 1,5 MB: imágenes en WebP con `loading="lazy"` salvo el hero, y sin librerías externas.
- Un `404.html` sencillo con el mismo estilo.

## 8. Publicación y dominio (paso a paso con ella)

1. Crear o usar el repo `VEVEGAShouse/fronttier-web` y subir los archivos.
2. Ir a **Settings → Pages → Deploy from a branch → main / (root)**.
3. Añadir un archivo `CNAME` con el contenido `fronttier.io` y poner `fronttier.io` en *Custom domain*.
4. **Recomendado:** verificar el dominio en GitHub (Settings de la cuenta → Pages → *Verified domains*). Evita que otra persona lo use.
5. **DNS en el registrador del dominio** (probablemente GoDaddy; confírmalo con ella):
   - **Quitar** solo los registros que apuntaban a Webflow (A `198.202.211.1`, CNAME `proxy-ssl.webflow.com` o parecidos). Enséñaselos antes de borrar.
   - **Añadir** 4 registros A para `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y `185.199.111.153`.
   - **Añadir** un CNAME `www` → `vevegashouse.github.io`.
   - ⚠️ **NO TOCAR** los registros **MX** ni los **TXT** (SPF, DKIM, verificación de Google). Son el correo de Google Workspace de admin@fronttier.io. Si se rompen, deja de llegar el correo.
6. Cuando GitHub emita el certificado (puede tardar desde minutos hasta unas horas), activar **Enforce HTTPS**.
7. Comprobar que `fronttier.io` y `www.fronttier.io` cargan, que el candado funciona y que **el correo sigue llegando** (que ella se envíe un email de prueba).

## 9. Al terminar

Entrega a Virginia:

- el enlace,
- capturas de la web en móvil y en escritorio,
- un README corto en español: cómo cambiar un texto o una imagen desde la web de GitHub, sin programar.

No hace falta borrar el proyecto de Webflow: está en el plan gratuito y sirve de archivo.
