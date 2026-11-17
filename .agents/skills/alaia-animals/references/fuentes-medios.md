# Fuentes de medios y licencias

## Principio

Cada archivo debe poder justificarse con una página, un autor y una licencia verificables. Si falta uno de los tres, la fuente no sirve. No inventes datos para que el JSON valide: es preferible dejar el medio anterior y explicar el bloqueo.

Prioriza, en este orden:

1. Dominio público o CC0.
2. CC BY (con atribución).
3. Pexels License para video.
4. CC BY-NC-SA para los signos de la Fundación CNSE, que ya forman parte del proyecto.

Evita material sin licencia clara, marcas de agua, recopilaciones de YouTube o sitios que no indiquen el origen.

## Video: Pexels

### Buscar

Usa una búsqueda web con términos concretos en inglés, por ejemplo:

```text
pexels video white horse grazing green meadow
pexels video pig farm close up
pexels video koala eucalyptus
```

Abre la ficha del candidato y comprueba que el animal sea el protagonista, que no haya personas o texto dominando la escena y que el clip dure al menos 6 segundos.

### Leer metadatos

La página de Pexels suele devolver `403` a las peticiones directas. Usa el proxy de lectura:

```text
https://r.jina.ai/https://www.pexels.com/video/<slug>-<id>/
```

El título suele incluir `Video by <autor> on Pexels`. Copia el autor exacto, la URL canónica y el `downloadId` (el número final de la URL).

### Descargar

```bash
curl -L \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" \
  -o /tmp/alaia-<id>/source.mp4 \
  "https://www.pexels.com/download/video/<downloadId>/"
```

Sin el User-Agent de navegador la descarga puede fallar. Comprueba el archivo con `ffprobe` antes de continuar.

### Licencia

`Pexels License`. La atribución no es obligatoria según la licencia, pero el proyecto la conserva y la muestra en la página de créditos. No presentes un video de Pexels como si fuera de otra fuente.

## Audio: Wikimedia Commons

### Buscar

```text
https://commons.wikimedia.org/w/index.php?search=<término>&title=Special:MediaSearch&type=audio
```

También puedes usar la API:

```text
https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=<término>&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|extmetadata&format=json
```

Prefiere archivos con vocalización aislada, sin música ni ambiente urbano. Escucha o revisa la forma de onda completa; el primer segundo no siempre representa el clip.

### Descargar

La página del archivo suele ofrecer una versión MP3 transcodificada:

```text
https://upload.wikimedia.org/wikipedia/commons/transcoded/<a>/<ab>/<archivo>.ogg/<archivo>.ogg.mp3
```

Copia la URL exacta desde la ficha o desde la API. En el JSON, `title` debe empezar por `File:` y `page` debe ser la página del archivo.

### Licencia

Registra la licencia tal como aparece en la ficha (`Public domain`, `CC0`, `CC BY 3.0`, `CC BY 4.0`, etc.) y el autor o autores. Si la ficha da varios autores, cópialos separados por comas; no los resumas.

### Errores frecuentes

- `429`: has hecho demasiadas peticiones. Espera y reintenta; no borres el audio que ya funciona.
- El MP3 transcodificado no existe para todos los archivos; en ese caso usa el OGG original o busca otra fuente.
- Algunos archivos tienen mucho silencio inicial: usa `trimSilence: true` o ajusta `start`.

## Audio: Freesound

### Buscar

```text
https://freesound.org/search/?q=<término>&f=license:%22Creative+Commons+0%22
```

Abre la ficha y verifica autor, licencia y duración. Para este proyecto prioriza `CC0`; si usas otra licencia, debe permitir el uso y la atribución debe quedar registrada.

### Descargar el preview

Freesound sirve previews públicos en:

```text
https://cdn.freesound.org/previews/<id/1000>/<soundId>_<userId>-hq.mp3
```

Ejemplo: el sonido `110011` del usuario `1537422` está en:

```text
https://cdn.freesound.org/previews/110/110011_1537422-hq.mp3
```

El directorio es el ID dividido entre 1000 (parte entera). El `userId` aparece en el HTML de la ficha o en el enlace de preview; no lo inventes. Para encontrar el enlace:

```bash
curl -sL -A "Mozilla/5.0" "https://freesound.org/people/<autor>/sounds/<id>/" \
  | grep -o "https://cdn.freesound.org/previews/[^\"']*"
```

Si la página no devuelve el enlace por JavaScript, usa `r.jina.ai` o busca el sonido en los resultados de búsqueda, que sí incluyen el preview.

### Licencia

Copia la licencia exacta (`CC0`, `CC BY 4.0`, etc.) y el autor. En el JSON, `provider` debe ser exactamente `Freesound`; la página de créditos y las pruebas dependen de ese valor.

## Signos: Fundación CNSE

La página del animal suele seguir este patrón:

```text
https://www.fundacioncnse.org/educa/bancolse/animales-<id>.php
```

Y el recurso descargable:

```text
https://www.fundacioncnse.org/educa/bancolse/naturaleza/animales/descargas/<id>2-sinlogo.png
```

No todos los animales tienen signo. Si no existe:

- no reutilices el signo de otro animal;
- no inventes una URL;
- avisa a la persona usuaria y propone un animal alternativo o dejar el signo pendiente.

El texto alternativo debe seguir el patrón existente:

```text
Signo de <animal> en Lengua de Signos Española (LSE): ilustración del animal y secuencia del signo.
```

Licencia: `CC BY-NC-SA 3.0`, autor `Fundación CNSE`, proveedor `Fundación CNSE · Mis primeros signos`.

## Qué guardar en el JSON

Para cada fuente:

- `provider`: el valor exacto que esperan las pruebas (`Pexels`, `Wikimedia Commons`, `Freesound`).
- `page`: la ficha pública, no el enlace directo de descarga.
- `author`: el autor o autores tal como aparecen.
- `license`: la licencia textual de la ficha.
- `downloadId` para Pexels.
- `downloadUrl` para audio y signo.
- `title` para audio de Wikimedia (`File:...`) o el título del sonido en Freesound.

## Comprobación final de la fuente

- [ ] La página abre y muestra el mismo autor y licencia.
- [ ] El archivo descargado no está vacío ni es un HTML de error.
- [ ] El contenido corresponde al animal y no tiene texto, marca de agua o voces.
- [ ] La licencia permite el uso en este proyecto.
- [ ] Los datos copiados coinciden carácter por carácter con la ficha.