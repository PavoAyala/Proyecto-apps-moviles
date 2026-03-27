# 📔 Resumen Técnico del Proyecto: Tacos El Güero

Este documento resume los conceptos clave, componentes y arquitectura de la aplicación para ayudarte en tus pruebas académicas.

---

## 🏗️ Arquitectura y Tecnologías
- **Framework:** [Expo](https://expo.dev/) (React Native). Permite desarrollo multiplataforma (iOS/Android/Web) con una sola base de código.
- **Backend:** [Supabase](https://supabase.com/). Provee base de datos PostgreSQL, autenticación de usuarios y almacenamiento de imágenes.
- **Enrutamiento:** [Expo Router](https://docs.expo.dev/router/introduction/). Navegación basada en archivos (similar a Next.js).
- **Lenguaje:** **TypeScript**. Añade tipado estático a JavaScript para reducir errores en tiempo de ejecución.

---

## 🧩 Componentes Principales (UI)
Los componentes son las piezas reutilizables de la interfaz:
1. **`Button.tsx`**: Botón personalizado con variantes (`primary`, `outline`) y estado de carga (`loading`).
2. **`Input.tsx`**: Campo de texto estilizado que maneja etiquetas (`label`) y errores.
3. **`ProductCard.tsx`**: Tarjeta que muestra la imagen, nombre y precio de un producto en el menú.
4. **`ProfileModal.tsx`**: Ventana emergente con los datos del usuario, estadísticas de pedidos y opción de cerrar sesión.
5. **`CardPaymentModal.tsx`**: Modal premium con una tarjeta virtual que se actualiza en tiempo real mientras el usuario escribe.
6. **`OrderTypeModal.tsx`**: Selector para elegir entre "Comer aquí" o "Para llevar".

---

## 📦 Gestión de Estado (Context API)
Utilizamos **React Context** para compartir datos globalmente sin pasar "props" manualmente a cada nivel:
- **`CartContext.tsx`**: Gestiona el carrito de compras (añadir, eliminar, actualizar cantidades y calcular el total dinámicamente).
- **`OrderTypeContext.tsx`**: Almacena si la orden es para comedor o para llevar, accesible desde cualquier pantalla.

---

## 🛣️ Sistema de Rutas y Pantallas
- **`/auth`**: Contiene `login.tsx` y `register.tsx` (Autenticación).
- **`/(tabs)`**: Pestañas inferiores:
    - `index.tsx` (Menú principal).
    - `cart.tsx` (Carrito con desglose de precios).
    - `pedidos.tsx` (Historial de órdenes).
- **`product/[id].tsx`**: Ruta dinámica que muestra el detalle de un producto específico basado en su ID.

---

## 🔑 Conceptos de Programación Utilizados
- **Hooks (`useState`, `useEffect`)**: Para manejar estados locales y efectos (como cargar datos al abrir la app).
- **Props**: Para pasar información de un componente padre a un hijo (ej. pasar el objeto `product` a `ProductCard`).
- **Navegación Dinámica**: Uso de `useRouter` y parámetros dinámicos (ej. `[id]`).
- **Asincronismo (`async/await`)**: Para peticiones a la base de datos sin bloquear la interfaz.
- **Temas Dinámicos**: Uso de `useColorScheme` para soportar Modo Claro y Modo Oscuro.

---

## 💾 Base de Datos (Tablas en Supabase)
- **`profiles`**: Almacena el nombre y rol de los usuarios.
- **`products`**: Información de los tacos, bebidas y precios.
- **`orders`**: Registro de las órdenes realizadas (total, tipo de orden, usuario).
- **`order_items`**: Detalle de qué productos contiene cada orden.
- **`payments`**: Registro de si se pagó en efectivo o tarjeta.

---
*¡Mucho éxito en tu prueba! Tienes un proyecto muy sólido y bien estructurado.*
