# 🌮 Tacos El Güero - Aplicación de Usuarios

![Versión](https://img.shields.io/badge/versión-1.0.0-red)
![Platform](https://img.shields.io/badge/Plataforma-Expo/React--Native-blue)
![Backend](https://img.shields.io/badge/Backend-Supabase-green)

Una aplicación móvil moderna, rápida y atractiva diseñada para la taquería "Tacos El Güero". Permite a los usuarios explorar el menú, personalizar sus pedidos y realizar procesos de pago de forma intuitiva, con soporte completo para temas claro y oscuro.

---

## ✨ Características Principales

### 🔐 Autenticación y Perfil
- Registro e inicio de sesión seguro gestionado por **Supabase Auth**.
- Manejo de sesiones persistentes.
- Perfil de usuario con detalles personalizados.

### 📜 Menú Interactivo
- Exploración de categorías de productos (Tacos, Bebidas, etc.) con carga dinámica desde el servidor.
- Imágenes en alta resolución optimizadas.
- **Preferencias Especiales:** Opción de añadir notas personalizadas por cada producto (ej. "sin cebolla", "con extra salsa").

### 🛒 Carrito de Compras Avanzado
- **Lógica de Agrupación:** Sistema inteligente que combina productos iguales automáticamente o los separa si tienen notas distintas.
- **Contador en Tiempo Real:** 
    - Badge de notificación rojo en la barra de navegación inferior.
    - Contador detallado en la cabecera de la pantalla de carrito.
- **Gestión de Cantidades:** Ajuste dinámico de unidades y eliminación rápida de items.

### 💳 Proceso de Pago (Checkout)
- **Confirmación de Orden:** Selección entre "Para comer aquí" o "Para llevar".
- **Métodos de Pago:**
    - **Efectivo:** Confirmación directa para pago en caja.
    - **Tarjeta (Premium):** Modal interactivo con previsualización de tarjeta virtual, formato automático de dígitos (espacios y diagonales) y validación de campos.

### 🕒 Historial de Pedidos
- Consulta de órdenes anteriores ordenadas cronológicamente.
- Estados en tiempo real: Pendiente / Completado.
- Desglose de productos, subtotales y monto total.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Expo SDK 54](https://expo.dev/) (React Native).
- **Lenguaje:** TypeScript.
- **Navegación:** Expo Router (Enrutamiento basado en archivos).
- **Backend as a Service:** [Supabase](https://supabase.com/) (PostgreSQL & Auth).
- **Estilos:** Vanilla StyleSheet con sistema de temas dinámico (Light/Dark mode).
- **Componentes Extra:**
    - `expo-linear-gradient` para acabados visuales premium.
    - `expo-haptics` para retroalimentación táctil al navegar.
    - `@expo/vector-icons` para iconografía consistente.

---

## 📁 Estructura del Proyecto

```text
├── app/                  # Sistema de rutas y navegación
│   ├── (tabs)/           # Pestañas principales (Inicio, Pedidos, Carrito)
│   ├── auth/             # Pantallas de Login y Registro
│   └── product/[id].tsx  # Vista detallada de productos
├── components/           # Componentes globales reutilizables
│   ├── ui/               # Elementos base de diseño
│   └── CardPaymentModal  # Modal interactivo de tarjeta
├── context/              # Contextos de React (Carrito, Configuración de orden)
├── lib/                  # Lógica de API y cliente de Supabase
├── constants/            # Tokens de diseño y configuración de temas
└── assets/               # Recursos estáticos (Imágenes, Fuentes)
```

---

## 🚀 Instalación y Ejecución

1. **Clonar el proyecto:**
   ```bash
   git clone [url-del-repo]
   cd Proyecto-apps-moviles-Users
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Configura el archivo `.env` en la raíz:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=tu_instancia_de_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_key
   ```

4. **Lanzar la aplicación:**
   ```bash
   npx expo start
   ```

---

## 🎨 Filosofía de Diseño
El diseño prioriza la **vialidad visual** y el **engagement**. Utilizamos el rojo (`#D92323`) como color de acción principal para evocar el apetito y la marca, combinado con gradientes suaves y micro-interacciones que hacen que la aplicación se sienta "viva" y profesional.

---

## ⚖️ Licencia
Desarrollado como proyecto académico para la materia de Desarrollo de Aplicaciones Móviles.
