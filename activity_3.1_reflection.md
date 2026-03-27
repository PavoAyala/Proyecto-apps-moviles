# Reflexión y Análisis de Pruebas (Actividad 3.1)

A continuación, se detalla el análisis de los problemas encontrados durante el desarrollo de la aplicación móvil "Tacos El Güero", las soluciones implementadas y las propuestas de mejora para el proceso de pruebas.

---

## 1. ¿Qué errores encontraste?

Durante las fases de desarrollo y pruebas de la aplicación, se identificaron varios errores críticos y de interfaz que afectaban tanto la funcionalidad core como la experiencia del usuario (UX). Los principales errores fueron:

*   **Errores de Políticas de Seguridad (RLS) en Base de Datos:** Los usuarios (incluso autenticados) no podían ver la lista de productos ni las categorías en la pantalla principal. Esto devolvía un arreglo vacío o un error de permisos desde la API.
*   **Omisión de Datos en el Registro (Perfil de Usuario):** Al crear una cuenta nueva, el sistema solo solicitaba correo y contraseña. Como resultado, la pantalla de "Mi Perfil" mostraba el texto genérico inconsistente ("Usuario") porque el nombre real no se estaba guardando en los metadatos de Supabase ni en la tabla de perfiles.
*   **Problemas de Renderizado en Modo Oscuro (Dark Mode):** Al cambiar el tema del dispositivo a oscuro, varios componentes de la interfaz de usuario no se adaptaban correctamente. Textos oscuros sobre fondos oscuros, bordes invisibles y contrastes deficientes hacían que la aplicación fuera difícil de leer en pantallas como el carrito o los modales.
*   **Error Crítico de Lógica en el Carrito (Duplicate Keys):** Al agregar un mismo producto desde la pantalla de "Inicio" (sin notas) y luego desde la "Descripción del Producto" (con nota vacía `""` o `undefined`), el sistema de React arrojaba un error de consola tipo `Encountered two children with the same key`. Esto provocaba que en el carrito el producto apareciera duplicado visualmente o que la aplicación se cerrara de forma inesperada.

---

## 2. ¿Cómo los solucionaste?

Cada error requirió un enfoque distinto, combinando correcciones en el backend, refactorización de código React Native y ajustes de UI:

*   **Solución a las Políticas (RLS):** Se revisaron las políticas de seguridad a nivel de filas (Row Level Security) en Supabase para las tablas `productos` y `categorías`. Se configuraron políticas de lectura pública (`SELECT`) para permitir que cualquier usuario de la aplicación pudiera consumir el menú sin restricciones de acceso, solucionando el problema de carga.
*   **Solución al Registro de Usuarios:** Se modificó la pantalla de registro (`register.tsx`) para incluir un nuevo campo obligatorio (`Input`) llamado "Nombre Completo". Además, se actualizó la función `signUp` de Supabase para pasar este valor dentro del objeto `options.data.full_name`, asegurando que el nombre persista en los metadatos del usuario y se refleje correctamente en el modal de perfil.
*   **Solución al Modo Oscuro:** Se implementó un hook global `useColorScheme` en todos los componentes afectados. Se definió un sistema de colores estandarizado (`constants/theme.ts`) que mapea variables dinámicas (como `themeColors.background` o `themeColors.text`) para asegurar legibilidad. Los modales y tarjetas se reescribieron para usar fondos adaptativos estables (`rgba` condicionales).
*   **Solución al Error del Carrito:** Se rediseñó la estructura de datos en `CartContext.tsx`. En lugar de usar el `id` del producto como llave en los componentes tipo lista (`FlatList`), se creó un identificador único compuesto (`cartItemId`) concatenando el ID del producto y sus notas normalizadas. También se normalizaron los valores de las notas (convirtiendo cadenas vacías a `undefined`) para que el sistema pudiera agrupar correctamente productos idénticos sin importar de qué pantalla provinieran.

---

## 3. ¿Qué mejorarías en tu proceso de pruebas?

Basado en la experiencia de este desarrollo, el proceso de pruebas puede madurar en los siguientes aspectos:

*   **Implementación de Pruebas Unitarias (Automáticas):** Para la lógica de negocio profunda, como el cálculo de subtotales o la función de agrupar elementos en el carrito temporal (`CartContext`), se deben crear pruebas unitarias (por ejemplo, con Jest). Esto evitaría que errores como el de "Duplicate Keys" lleguen a la fase de pruebas manuales y a producción.
*   **Pruebas en Múltiples Ambientes Front-End:** El problema del Modo Oscuro reveló la necesidad de probar la aplicación en diferentes configuraciones de sistema. Se debe incluir un checklist obligatorio donde toda nueva vista se pruebe explícitamente alternando el esquema de colores (Dark/Light.
*   **Simulación de Escenarios (Edge Cases):** Para los errores de base de datos (RLS) y de flujo (Registro sin nombre), se requiere diseñar Casos de Uso más estrictos que contemplen no solo el "camino feliz" (Happy Path), sino también condiciones extremas o permisos insuficientes antes de conectar la aplicación con el entorno React.
