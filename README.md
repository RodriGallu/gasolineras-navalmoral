# ⛽ Gasolineras Navalmoral de la Mata

Aplicación web en **Next.js 14** con **TypeScript** y **Tailwind CSS** para consultar los precios de gasolina en tiempo real en Navalmoral de la Mata (Cáceres), usando la API pública del Ministerio de Industria de España.

## ✨ Características

- 🔴 **Datos en tiempo real** del Ministerio de Industria
- 🏆 **Ordenación automática** por precio más barato
- 🟢 **Resaltado visual** de la gasolinera más barata
- 📊 **Estadísticas**: precio mínimo y media por combustible
- 🔍 **Búsqueda** por nombre o dirección
- 🔄 **Alternancia** entre ordenar por Gasolina 95 o Gasóleo A
- 📱 **Diseño responsive** adaptado a móvil, tablet y escritorio
- ⚡ **Caché ISR** con revalidación cada 30 minutos
- 💰 **Diferencia de precio** respecto a la más barata

---

## 🚀 Instrucciones de uso

### 1. Ejecutar en local

```bash
# 1. Clona el repositorio o copia los archivos
cd gasolineras-navalmoral

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev

# 4. Abre en tu navegador
# http://localhost:3000
```

### 2. Buscar otras ciudades

Puedes añadir el municipio como query param en la URL:

```
http://localhost:3000?municipio=PLASENCIA&provincia=CÁCERES
http://localhost:3000?municipio=BADAJOZ&provincia=BADAJOZ
http://localhost:3000?municipio=TRUJILLO&provincia=CÁCERES
```

---

## 📂 Estructura del proyecto

```
gasolineras-navalmoral/
├── app/
│   ├── layout.tsx        # Root layout con metadatos y fuentes
│   ├── page.tsx          # Server Component — fetching de datos
│   ├── loading.tsx       # Skeleton de carga
│   ├── error.tsx         # Página de error
│   └── globals.css       # Estilos globales + variables CSS
├── components/
│   └── GasStationsClient.tsx  # Client Component — UI interactiva
├── lib/
│   └── api.ts            # Fetch + parsing + filtrado de la API
├── types/
│   └── index.ts          # TypeScript types
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## ☁️ Desplegar en Vercel

### Opción A: Desde GitHub (recomendado)

1. **Crea un repositorio en GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: gasolineras navalmoral"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/gasolineras-navalmoral.git
   git push -u origin main
   ```

2. **Importa en Vercel:**
   - Ve a [vercel.com](https://vercel.com) → **New Project**
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `gasolineras-navalmoral`
   - Haz clic en **Deploy** (sin configuración extra necesaria ✅)

3. **¡Listo!** Vercel detecta Next.js automáticamente.

### Opción B: Con Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🔧 API utilizada

**Ministerio de Industria, Comercio y Turismo de España**

```
GET https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/
```

- Sin autenticación requerida ✅
- Datos públicos y gratuitos ✅
- Formato JSON ✅
- Actualización diaria por parte del Ministerio

---

## 🛠️ Tecnologías

| Tecnología     | Uso                              |
|----------------|----------------------------------|
| Next.js 14     | Framework + App Router + ISR     |
| TypeScript     | Tipado estático                  |
| Tailwind CSS   | Estilos utility-first            |
| Lucide React   | Iconos SVG                       |
| Vercel         | Despliegue sin configuración     |

---

## 📝 Notas técnicas

- Los precios de la API vienen como `string` con coma decimal (`"1,589"`). Se normalizan a `number` en `lib/api.ts`.
- La caché ISR (`revalidate = 1800`) hace que la página se regenere en servidor cada 30 min, combinado con el `next: { revalidate: 1800 }` del fetch.
- El municipio y provincia son configurables por query params, lo que permite reutilizar la app para cualquier ciudad de España.

---

Desarrollado usando datos públicos del Gobierno de España.
Pedro Sánchez Perro.
