const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const MOCK_FORMS = {
  contact: [
    '{"title": "Formulario de Contacto", "fields": [{"',
    'name": "nombre", "type": "text", "label": "Nombre Completo", "placeholder": "Escribe tu nombre", "required": true},{"',
    'name": "email", "type": "email", "label": "Correo Electrónico", "placeholder": "ejemplo@correo.com", "required"',
    ': true},{"name": "asunto", "type": "text", "label": "Asunto", "placeholder": "Motivo de tu contacto"',
    ',"required": false},{"name": "mensaje", "type": "textarea", "label": "Mensaje", "placeholder": "Escribe tu mensaje',
    ' aquí", "required": true}],"submitLabel": "Enviar Mensaje"}',
  ],
  register: [
    '{"title": "Crear Cuenta", "fields": [{"',
    'name": "nombre", "type": "text", "label": "Nombre de Usuario", "placeholder": "usuario123", "required": true, "minLength": 3, "maxLength": 20},{"',
    'name": "email", "type": "email", "label": "Correo Electrónico", "placeholder": "tu@correo.com", "required": true},{"',
    'name": "password", "type": "password", "label": "Contraseña", "placeholder": "••••••••••••", "required": true},{"',
    'name": "notificaciones", "type": "switch", "label": "Recibir notificaciones por correo", "required": false},{"',
    'name": "terminos", "type": "checkbox", "label": "Acepto los términos y condiciones", "required": true}],"submitLabel": "Crear Cuenta"}',
  ],
  product_config: [
    '{"title": "Configura tu Producto", "fields": [{"',
    'name": "categoria", "type": "select", "label": "Categoría", "options": ["Electrónicos", "Ropa", "Hogar", "Deportes"], "required": true, "metadata": {"variant": "icon", "icon": "search"}},{"',
    'name": "talla", "type": "radio", "label": "Talla", "options": ["S", "M", "L", "XL"], "required": true},{"',
    'name": "cantidad", "type": "number-stepper", "label": "Cantidad", "required": true, "minLength": 1, "maxLength": 10},{"',
    'name": "garantia", "type": "switch", "label": "Incluir garantía extendida", "required": false},{"',
    'name": "etiquetas", "type": "multi-select", "label": "Etiquetas", "options": ["Nuevo", "Oferta", "Popular", "Limitado"], "required": false, "metadata": {"creatable": true, "maxSelected": 3}},{"',
    'name": "presupuesto", "type": "slider", "label": "Presupuesto máximo", "required": true, "minLength": 0, "maxLength": 1000, "metadata": {"mode": "single", "step": 10}}],"submitLabel": "Guardar Configuración"}',
  ],
  payment: [
    '{"title": "Información de Pago", "fields": [{"',
    'name": "tarjeta", "type": "card-details", "label": "Datos de la Tarjeta", "required": true},{"',
    'name": "telefono", "type": "phone", "label": "Teléfono de Contacto", "placeholder": "555-123-4567", "required": true},{"',
    'name": "codigo_promo", "type": "text", "label": "Código Promocional", "placeholder": "DESCUENTO10", "required": false, "metadata": {"variant": "button", "buttonLabel": "Validar"}},{"',
    'name": "codigo_2fa", "type": "otp", "label": "Código de Verificación", "required": true, "metadata": {"slots": 6}}],"submitLabel": "Pagar Ahora"}',
  ],
  variants_demo: [
    '{"title": "Demostración de Variantes", "fields": [{"',
    'name": "nombre", "type": "text", "label": "Nombre (default)", "placeholder": "Variante básica", "required": true},{"',
    'name": "correo_error", "type": "text", "label": "Correo (error)", "placeholder": "correo@invalido", "required": true, "metadata": {"variant": "error"}},{"',
    'name": "busqueda", "type": "text", "label": "Buscar (icon-start)", "placeholder": "Buscar producto...", "required": false, "metadata": {"variant": "icon-start", "icon": "search"}},{"',
    'name": "url_sitio", "type": "text", "label": "URL (addons)", "placeholder": "mi-sitio", "required": false, "metadata": {"variant": "addons", "startAddon": "https://", "endAddon": ".com"}},{"',
    'name": "bio", "type": "textarea", "label": "Biografía (char-limit)", "placeholder": "Escribe sobre ti...", "required": false, "maxLength": 200, "metadata": {"variant": "character-limit"}},{"',
    'name": "hora_cita", "type": "masked-time", "label": "Hora de la cita", "placeholder": "HH:MM:ss", "required": true}],"submitLabel": "Enviar Demo"}',
  ],
  survey: [
    '{"title": "Encuesta de Satisfacción", "fields": [{"',
    'name": "servicios", "type": "checkbox-group", "label": "Servicios utilizados", "options": ["Soporte Técnico", "Facturación", "Ventas", "Instalación"], "required": true},{"',
    'name": "satisfaccion", "type": "slider", "label": "Nivel de Satisfacción", "required": true, "minLength": 0, "maxLength": 10, "metadata": {"mode": "range", "step": 1}},{"',
    'name": "recomendacion", "type": "radio", "label": "¿Nos recomendarías?", "options": ["Sí", "No", "Tal vez"], "required": true},{"',
    'name": "comentarios", "type": "textarea", "label": "Comentarios (error demo)", "placeholder": "Escribe aquí...", "required": false, "metadata": {"variant": "error"}},{"',
    'name": "intereses", "type": "multi-select", "label": "Áreas de interés", "options": ["Tecnología", "Salud", "Educación", "Finanzas"], "required": false, "metadata": {"maxSelected": 2}}],"submitLabel": "Enviar Encuesta"}',
  ],
} as const

export type MockFormKey = keyof typeof MOCK_FORMS

export const MOCK_FORM_KEYS: MockFormKey[] = Object.keys(MOCK_FORMS) as MockFormKey[]

export function mockGenerateFormStream(formKey: MockFormKey = 'contact') {
  const chunks = MOCK_FORMS[formKey]

  async function* textStream() {
    for (const chunk of chunks) {
      yield chunk
      await sleep(300)
    }
  }

  return { textStream: textStream() }
}
