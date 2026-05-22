const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const MOCK_FORMS = {
  contact: [
    '{"title": "Formulario de Contacto", "fields": [{"',
    'name": "nombre", "type": "text", "label": "Nombre", "placeholder": "Escribe tu nombre", "required": true, "colSpan": 6, "metadata": {"variant": "icon-start", "icon": "user"}},{"',
    'name": "email", "type": "email", "label": "Correo Electrónico", "placeholder": "ejemplo@correo.com", "required"',
    ': true, "colSpan": 6},{"name": "asunto", "type": "text", "label": "Asunto", "placeholder": "Motivo de tu contacto"',
    ',"required": false, "colSpan": 12},{"name": "mensaje", "type": "textarea", "label": "Mensaje", "placeholder": "Escribe tu mensaje',
    ' aquí", "required": true, "colSpan": 12}],"submitLabel": "Enviar Mensaje"}',
  ],
  register: [
    '{"title": "Crear Cuenta", "fields": [{"',
    'name": "nombre", "type": "text", "label": "Nombre de Usuario", "placeholder": "usuario123", "required": true, "minLength": 3, "maxLength": 20, "colSpan": 6, "metadata": {"variant": "icon-start", "icon": "user"}},{"',
    'name": "email", "type": "email", "label": "Correo Electrónico", "placeholder": "tu@correo.com", "required": true, "colSpan": 6},{"',
    'name": "password", "type": "password", "label": "Contraseña", "placeholder": "••••••••••••", "required": true, "colSpan": 12},{"',
    'name": "notificaciones", "type": "switch", "label": "Recibir notificaciones por correo", "required": false, "colSpan": 6},{"',
    'name": "terminos", "type": "checkbox", "label": "Acepto los términos y condiciones", "required": true, "colSpan": 6}],"submitLabel": "Crear Cuenta"}',
  ],
  product_config: [
    '{"title": "Configura tu Producto", "fields": [{"',
    'name": "categoria", "type": "select", "label": "Categoría", "options": ["Electrónicos", "Ropa", "Hogar", "Deportes"], "required": true, "colSpan": 12, "metadata": {"variant": "icon", "icon": "search"}},{"',
    'name": "talla", "type": "radio", "label": "Talla", "options": ["S", "M", "L", "XL"], "required": true, "colSpan": 6},{"',
    'name": "cantidad", "type": "number-stepper", "label": "Cantidad", "required": true, "minLength": 1, "maxLength": 10, "colSpan": 6},{"',
    'name": "garantia", "type": "switch", "label": "Incluir garantía extendida", "required": false, "colSpan": 6},{"',
    'name": "etiquetas", "type": "multi-select", "label": "Etiquetas", "options": ["Nuevo", "Oferta", "Popular", "Limitado"], "required": false, "colSpan": 6, "metadata": {"creatable": true, "maxSelected": 3}},{"',
    'name": "presupuesto", "type": "slider", "label": "Presupuesto máximo", "required": true, "minLength": 0, "maxLength": 1000, "colSpan": 12, "metadata": {"mode": "single", "step": 10}}],"submitLabel": "Guardar Configuración"}',
  ],
  payment: [
    '{"title": "Información de Pago", "fields": [{"',
    'name": "tarjeta", "type": "card-details", "label": "Datos de la Tarjeta", "required": true, "colSpan": 12},{"',
    'name": "telefono", "type": "phone", "label": "Teléfono de Contacto", "placeholder": "555-123-4567", "required": true, "colSpan": 6},{"',
    'name": "codigo_promo", "type": "text", "label": "Código Promocional", "placeholder": "DESCUENTO10", "required": false, "colSpan": 6, "metadata": {"variant": "button", "buttonLabel": "Validar"}},{"',
    'name": "codigo_2fa", "type": "otp", "label": "Código de Verificación", "required": true, "colSpan": 12, "metadata": {"slots": 6}}],"submitLabel": "Pagar Ahora"}',
  ],
  variants_demo: [
    '{"title": "Variantes de Campos", "fields": [{"',
    'name": "nombre", "type": "text", "label": "Nombre", "placeholder": "Escribe tu nombre", "required": true, "colSpan": 6, "metadata": {"variant": "icon-start", "icon": "user"}},{"',
    'name": "correo", "type": "text", "label": "Correo con error", "placeholder": "correo@invalido", "required": true, "colSpan": 6, "metadata": {"variant": "error"}},{"',
    'name": "busqueda", "type": "text", "label": "Buscar", "placeholder": "Buscar producto...", "required": false, "colSpan": 6, "metadata": {"variant": "icon-start", "icon": "search"}},{"',
    'name": "url_sitio", "type": "text", "label": "URL del sitio", "placeholder": "mi-sitio", "required": false, "colSpan": 6, "metadata": {"variant": "addons", "startAddon": "https://", "endAddon": ".com"}},{"',
    'name": "bio", "type": "textarea", "label": "Biografía", "placeholder": "Escribe sobre ti...", "required": false, "maxLength": 200, "colSpan": 12, "metadata": {"variant": "character-limit"}},{"',
    'name": "hora_cita", "type": "masked-time", "label": "Hora de la cita", "placeholder": "HH:MM:ss", "required": true, "colSpan": 12}],"submitLabel": "Enviar Demo"}',
  ],
  survey: [
    '{"title": "Encuesta de Satisfacción", "fields": [{"',
    'name": "servicios", "type": "checkbox-group", "label": "Servicios utilizados", "options": ["Soporte Técnico", "Facturación", "Ventas", "Instalación"], "required": true, "colSpan": 12},{"',
    'name": "satisfaccion", "type": "slider", "label": "Nivel de Satisfacción", "required": true, "minLength": 0, "maxLength": 10, "colSpan": 12, "metadata": {"mode": "range", "step": 1}},{"',
    'name": "recomendacion", "type": "radio", "label": "¿Nos recomendarías?", "options": ["Sí", "No", "Tal vez"], "required": true, "colSpan": 6},{"',
    'name": "comentarios", "type": "textarea", "label": "Comentarios", "placeholder": "Escribe aquí...", "required": false, "colSpan": 6, "metadata": {"variant": "error"}},{"',
    'name": "intereses", "type": "multi-select", "label": "Áreas de interés", "options": ["Tecnología", "Salud", "Educación", "Finanzas"], "required": false, "colSpan": 12, "metadata": {"maxSelected": 2}}],"submitLabel": "Enviar Encuesta"}',
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
