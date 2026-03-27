# Pruebas de Usuario (UAT) - Tacos El Güero

**Tester (Usuario Final):** Patricio Perez  
**Fecha de Pruebas:** 25 de Marzo de 2026  
**Dispositivo:** Emulador / Smartphone genérico  
**Objetivo General:** Validar que la aplicación sea intuitiva y funcional desde la perspectiva de un cliente real que desea realizar y pagar un pedido.

---

## Prueba de Usuario 1: Registro Personalizado y Validación de Perfil

**Descripción de la prueba:**  
El usuario (Patricio) descarga la aplicación por primera vez y desea crear una cuenta. El objetivo es verificar que el formulario de registro sea fácil de usar y que, una vez dentro de la app, su nombre aparezca correctamente en su perfil en lugar de un nombre genérico.

**Funcionalidad Probada:**  
- Creación de cuenta (Auth).
- Persistencia de datos en perfil (Supabase Metadata).

**Pasos realizados por Patricio:**  
1. Abrir la aplicación y visualizar la pantalla de bienvenida (Landing Page).
2. Tocar el botón "Regístrate".
3. Llenar el campo "Nombre Completo" con "Patricio Perez".
4. Ingresar un correo de prueba (`patricio.perez@email.com`) y una contraseña segura.
5. Presionar el botón "Registrarse".
6. Una vez dentro de la app (Menú principal), tocar el ícono de perfil en la esquina superior derecha.

**Resultados obtenidos:**  
✅ **Aprobado.** El sistema permitió crear la cuenta sin problemas. Al abrir el modal del perfil, Patricio pudo ver inmediatamente su nombre ("Patricio Perez") en letras grandes, además de ver su cuenta como "Miembro desde" el día de hoy, validando que la información se guardó correctamente en la base de datos.

---

## Prueba de Usuario 2: Configuración Compleja en el Carrito de Compras

**Descripción de la prueba:**  
Patricio es un cliente exigente. Quiere pedir dos órdenes del mismo platillo (ej. Tacos de Bistec), pero con requerimientos diferentes para cada una (una orden normal y otra con notas especiales). El objetivo es comprobar que el carrito no se confunda y separe ambos productos para cobrarlos correctamente.

**Funcionalidad Probada:**  
- Lógica de adición al carrito (CartContext).
- Generación de identificadores únicos (`cartItemId`).
- Prevención de llaves duplicadas (Bug Fix).

**Pasos realizados por Patricio:**  
1. Navegar por el Menú y seleccionar "Tacos de Bistec".
2. Presionar "Agregar al Carrito" rápidamente (agregando la orden estándar sin notas).
3. Volver a seleccionar los mismos "Tacos de Bistec" para ver el detalle.
4. En el campo de notas, escribir: "Sin cebolla por favor".
5. Presionar "Añadir al carrito".
6. Navegar a la pestaña inferior del "Carrito".

**Resultados obtenidos:**  
✅ **Aprobado.** En la pantalla del carrito, Patricio observó dos líneas distintas para los "Tacos de Bistec". Una línea reflejaba la orden normal y la otra incluía un texto en cursiva que decía *"Nota: Sin cebolla por favor"*. El contador del carrito en la parte superior y el badge rojo en la pestaña inferior mostraban correctamente "2" artículos. La aplicación no se cerró y cobró ambas órdenes.

---

## Prueba de Usuario 3: Experiencia de Pago Premium con Tarjeta

**Descripción de la prueba:**  
Patricio ya tiene sus tacos en el carrito y está listo para pagar. Decide no usar efectivo y prefiere usar su tarjeta de crédito. El objetivo es evaluar si el modal de pago le genera confianza y si el flujo de "checkout" es claro.

**Funcionalidad Probada:**  
- Modal de pago interactivo (CardPaymentModal).
- Formateo de inputs en tiempo real.
- Finalización de orden en base de datos.

**Pasos realizados por Patricio:**  
1. Estando en la pestaña "Carrito", revisar que el subtotal es correcto.
2. Tocar el botón rojo "Pagar" en la parte inferior.
3. En la ventana emergente de confirmación, seleccionar el tipo de orden ("Para llevar").
4. Seleccionar el método de pago ("Tarjeta").
5. Tocar nuevamente el botón "Pagar".
6. Al abrirse el *Modal de Tarjeta Premium*, Patricio ingresa sus 16 dígitos. 
*(Observa cómo la tarjeta virtual en la parte superior se completa automáticamente con espacios cada 4 dígitos).*
7. Ingresa "04/28" como expiración y su CVV oculto.
8. Presiona "Pagar ahora".

**Resultados obtenidos:**  
✅ **Aprobado.** Patricio reportó que la tarjeta virtual se veía "muy profesional y segura", dándole confianza para poner sus datos. Al presionar "Pagar ahora", el botón mostró un estado de "Procesando...", luego desapareció dando lugar a un mensaje verde de "¡Tu orden ha sido realizada correctamente!". Al revisar la pestaña "Pedidos", su orden ya aparecía con estado "Pendiente", confirmando el éxito del flujo.
