# Preguntas predefinidas por rol y etapa — para integrar en un chat con IA

Esta guía describe cómo enriquecer un asistente conversacional con **preguntas sugeridas contextuales**, que cambian automáticamente según el **rol del usuario** y la **etapa o pantalla** en la que se encuentre. Es aplicable a cualquier sistema que gestione procesos con diferentes perfiles (ej. candidatos, formadores, administradores) y estados (ej. pipeline de contratación, flujos de trabajo).

El objetivo es ofrecer al usuario un conjunto de preguntas frecuentes relevantes en cada momento, mostradas como **chips / quick replies** en el chat. Al hacer clic en una, se envía a la IA, que puede usar la respuesta de referencia asociada como *grounding* para dar una respuesta consistente con la lógica del sistema.

---

## 1. Concepto general y requisitos funcionales

En la aplicación existe un **asistente de soporte flotante** (widget de chat) que presenta un catálogo de preguntas **contextual**. El listado de preguntas se actualiza automáticamente al cambiar de rol o de etapa/pantalla. El catálogo se define como un conjunto de **sets** (rol → etapa → preguntas). El sistema debe:

1. **Detectar el contexto actual** del usuario:  
   - Rol (ej. `candidato`, `formador`, `administrador`).  
   - Etapa dentro del proceso principal (ej. estado del pipeline, vista activa, sub-paso).  
   - Si no se puede determinar, usar un set `default` genérico.

2. **Seleccionar el set adecuado** mediante una función que recibe la clave de contexto (ej. `ctxKey`) y devuelve la lista de preguntas correspondiente.

3. **Mostrar las preguntas** como sugerencias clicables (chips / quick replies) en la interfaz del chat.

4. **Al hacer clic en una pregunta**, enviarla al motor de IA. La respuesta de referencia (campo `a`) puede usarse como información base para que la IA responda de forma alineada con la lógica del sistema.

5. **Actualizar las sugerencias** cada vez que el contexto cambie (cambio de rol, navegación a otra pantalla, avance en el pipeline).

---

## 2. Lógica de determinación del contexto (genérica)

A modo de ejemplo, se detalla una lógica típica que puede adaptarse a cada sistema:

### 2.1. Para el rol de **candidato** (persona que aplica a procesos)
- Si está en la vista de "búsqueda de oportunidades" → clave `cand_buscar`.
- Si no tiene procesos activos → clave `cand_sin`.
- Si tiene procesos en curso, se toma el proceso **más avanzado** y su estado en el pipeline define la clave `cand_<estado>` (ej. `cand_invitado`, `cand_postulado`, `cand_filtros_ok`, …).
- Si el proceso está cerrado (rechazado, descartado, filtrado) → `cand_cerrado`.

### 2.2. Para el rol de **formador** (gestor del proceso)
- Si está en la vista de notificaciones → `form_notif`.
- Si está dentro de una vacante, se determina el sub-paso actual (0–6) y se usa `form_sub<subpaso>`.
- En cualquier otra vista (panel principal) → `form_home`.

### 2.3. Para el rol de **administrador** (supervisor)
- Si está en la vista de notificaciones → `admin_notif`.
- Según la vista activa (ej. listado de vacantes, creación de nueva vacante, pool de candidatos) → `admin_<vista>`.

### 2.4. Fallback
- Si no se cumple ninguna condición → clave `default`.

---

## 3. Catálogo de preguntas (estructura JSON)

El siguiente JSON contiene todos los sets. Cada objeto incluye:
- `role`: rol al que aplica (o `general` para fallback).
- `stageKey`: clave única de la etapa (coincide con el contexto detectado).
- `stageLabel`: etiqueta legible para depuración.
- `trigger`: descripción de la condición que activa este set.
- `questions[]`: arreglo de objetos con `q` (pregunta) y `a` (respuesta de referencia).

```json
{
  "meta": {
    "source": "Catálogo de preguntas contextuales por rol y etapa",
    "descripcion": "Las preguntas se actualizan automáticamente según el rol y la etapa del usuario. El set 'default' se usa cuando no hay coincidencia."
  },
  "sets": [
    {
      "role": "general",
      "stageKey": "default",
      "stageLabel": "General (fallback)",
      "trigger": "Ninguna etapa específica coincide",
      "questions": [
        {"q": "¿Qué es [nombre del sistema]?", "a": "Es una plataforma para gestionar procesos de forma autónoma, con apoyo de IA en las distintas fases."},
        {"q": "¿Cómo cambio de rol?", "a": "Usa el menú de navegación o el selector de perfil para alternar entre los roles disponibles."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_sin",
      "stageLabel": "Sin postulaciones activas",
      "trigger": "Candidato sin procesos en curso",
      "questions": [
        {"q": "¿Cómo empiezo a buscar oportunidades?", "a": "Accede a la sección de búsqueda, filtra por tus preferencias y postúlate a las que te interesen."},
        {"q": "¿Conviene completar mi perfil primero?", "a": "Sí, un perfil completo mejora la compatibilidad y facilita la postulación."},
        {"q": "¿Cómo mejoro mi compatibilidad?", "a": "Asegúrate de incluir todas tus habilidades, experiencia y documentos requeridos."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_buscar",
      "stageLabel": "Buscando oportunidades",
      "trigger": "Vista de búsqueda activa",
      "questions": [
        {"q": "¿Qué significa el porcentaje de compatibilidad?", "a": "Es una estimación de qué tan bien encaja tu perfil con los requisitos de la oportunidad."},
        {"q": "¿Cómo me postulo?", "a": "Abre el detalle de la oportunidad y usa el botón 'Aplicar'; completa las preguntas filtro si las hay."},
        {"q": "¿Para qué sirve la opción de guardar favoritos?", "a": "Te permite marcar oportunidades para acceder rápidamente más tarde."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_invitado",
      "stageLabel": "Invitado a un proceso",
      "trigger": "Estado del pipeline: invitado",
      "questions": [
        {"q": "Me invitaron a un proceso, ¿qué hago?", "a": "Revisa la invitación y confirma tu interés postulándote o recházala si no te interesa."},
        {"q": "¿Puedo rechazar la invitación?", "a": "Sí, encontrarás una opción para hacerlo; el motivo es opcional."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_postulado",
      "stageLabel": "Postulado / filtros iniciales",
      "trigger": "Estado del pipeline: postulado",
      "questions": [
        {"q": "¿Qué documentos debo subir?", "a": "Constancias, exámenes, autorizaciones según lo requiera el proceso."},
        {"q": "¿El examen psicométrico caduca?", "a": "Suele tener vigencia de 6 meses; si ya lo realizaste, se reutiliza."},
        {"q": "¿Cuándo puedo enviar mi documentación?", "a": "Cuando todos los campos obligatorios estén completos y la casilla de autorización marcada."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_filtros_ok",
      "stageLabel": "Filtros superados",
      "trigger": "Estado del pipeline: filtros_ok",
      "questions": [
        {"q": "Pasé los filtros, ¿qué sigue?", "a": "Realiza la siguiente etapa (ej. entrevista con IA) para avanzar en el proceso."},
        {"q": "¿Es obligatoria la siguiente fase?", "a": "Sí, es necesaria para que el gestor pueda evaluarte."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_evaluado",
      "stageLabel": "Evaluación completada",
      "trigger": "Estado del pipeline: evaluado",
      "questions": [
        {"q": "Terminé la evaluación, ¿ahora qué?", "a": "El gestor revisará los resultados y, si avanzas, recibirás una invitación para la siguiente etapa."},
        {"q": "¿Puedo ver mi puntuación actual?", "a": "Tu avance se muestra en el panel de mis procesos."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_slots_enviados",
      "stageLabel": "Horarios de entrevista recibidos",
      "trigger": "Estado del pipeline: slots_enviados",
      "questions": [
        {"q": "El gestor me envió horarios, ¿cómo elijo?", "a": "Selecciona el que te convenga; se generará automáticamente la reunión."},
        {"q": "¿Qué pasa si un horario ya no está disponible?", "a": "Aparecerá como 'no disponible'; elige otro de los restantes."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_agendado",
      "stageLabel": "Entrevista agendada",
      "trigger": "Estado del pipeline: agendado",
      "questions": [
        {"q": "Ya agendé mi entrevista, ¿dónde veo el enlace?", "a": "En los detalles del proceso encontrarás el enlace para conectarte."},
        {"q": "¿Puedo contactar al gestor para dudas?", "a": "Sí, usa el chat o la mensajería interna para comunicarte directamente."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_entrevistado",
      "stageLabel": "Entrevistado (esperando decisión)",
      "trigger": "Estado del pipeline: entrevistado",
      "questions": [
        {"q": "Ya me entrevisté, ¿cuándo sabré el resultado?", "a": "El gestor registrará su decisión y recibirás una notificación cuando esté disponible."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_seleccionado",
      "stageLabel": "Seleccionado / documentación",
      "trigger": "Estado del pipeline: seleccionado",
      "questions": [
        {"q": "¡Me seleccionaron! ¿Qué documentos debo presentar?", "a": "Los solicitados (identificación, comprobantes, cuenta bancaria, etc.) en el formato indicado."},
        {"q": "¿Cómo registro mi cuenta bancaria?", "a": "Usa la opción 'Ingresar número de cuenta' en el checklist."},
        {"q": "¿Cómo agendo el examen médico (si aplica)?", "a": "Captura tu ubicación, elige una sucursal y una fecha; el gestor validará el resultado."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_docs_completos",
      "stageLabel": "Documentación completa",
      "trigger": "Estado del pipeline: docs_completos",
      "questions": [
        {"q": "Ya completé mi documentación, ¿qué sigue?", "a": "El gestor revisará que todo esté en orden y te enviará la oferta formal."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_oferta_enviada",
      "stageLabel": "Oferta recibida",
      "trigger": "Estado del pipeline: oferta_enviada",
      "questions": [
        {"q": "Recibí mi oferta, ¿qué incluye?", "a": "Detalles del puesto, sueldo, fecha de inicio y lugar de presentación."},
        {"q": "¿Cómo acepto la oferta?", "a": "Desde tu panel confirma la aceptación; recibirás la bienvenida y los siguientes pasos."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_contratado",
      "stageLabel": "Contratado",
      "trigger": "Estado del pipeline: contratado",
      "questions": [
        {"q": "¡Ya estoy contratado! ¿Cuándo y dónde me presento?", "a": "En la bienvenida encontrarás la fecha, hora y ubicación; la firma es presencial el primer día."},
        {"q": "¿Qué debo llevar el primer día?", "a": "Documentos originales; recibirás el kit de inducción."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_cerrado",
      "stageLabel": "Proceso cerrado",
      "trigger": "Estado terminal (rechazado, descartado, filtrado)",
      "questions": [
        {"q": "Mi proceso se cerró, ¿puedo aplicar a otras oportunidades?", "a": "Sí, puedes buscar nuevas oportunidades desde la sección correspondiente."},
        {"q": "¿Puedo ver retroalimentación?", "a": "En el historial de tus procesos, cuando esté disponible, encontrarás comentarios."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_home",
      "stageLabel": "Inicio / Mis procesos",
      "trigger": "Vista principal del gestor",
      "questions": [
        {"q": "¿Qué veo en mi panel principal?", "a": "El listado de procesos asignados a ti, con su etapa actual."},
        {"q": "¿Cómo funciona el flujo del proceso?", "a": "Suele tener fases: búsqueda, selección y contratación; cada una se subdivide en pasos."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_notif",
      "stageLabel": "Notificaciones",
      "trigger": "Vista de notificaciones",
      "questions": [
        {"q": "¿Qué notificaciones recibo?", "a": "Eventos como asignación de procesos, respuestas de candidatos, cambios de estado, etc. Al hacer clic en una, accedes al detalle."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub0",
      "stageLabel": "Fase de búsqueda · Descriptivo",
      "trigger": "Proceso en subpaso 0",
      "questions": [
        {"q": "¿Puedo modificar el descriptivo?", "a": "Sí, antes de aprobarlo puedes solicitar cambios al administrador."},
        {"q": "¿Cómo inicio la búsqueda de candidatos?", "a": "Cuando el descriptivo esté correcto, aprueba el proceso; la IA comenzará a buscar perfiles."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub1",
      "stageLabel": "Búsqueda · Pool de candidatos",
      "trigger": "Proceso en subpaso 1",
      "questions": [
        {"q": "¿Qué es el pool de candidatos?", "a": "El conjunto de perfiles que la IA ha identificado como potenciales para el proceso."},
        {"q": "¿Cómo organizo a los candidatos?", "a": "Puedes marcarlos como favoritos, agruparlos, filtrarlos por habilidades, etc."},
        {"q": "¿Y si quiero más candidatos?", "a": "Usa la opción 'Solicitar más' para ampliar la búsqueda."},
        {"q": "¿Cómo invito a alguien?", "a": "Abre su perfil y usa la invitación directa; entrará al proceso."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub2",
      "stageLabel": "Selección · Ranking",
      "trigger": "Proceso en subpaso 2",
      "questions": [
        {"q": "¿Cómo leo el ranking?", "a": "Los perfiles se clasifican por bandas (ej. ideales, adecuados, adicionales) según su compatibilidad."},
        {"q": "¿Puedo ver la grabación de la entrevista con IA?", "a": "Sí, desde el detalle del candidato puedes reproducirla y ver el resumen."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub3",
      "stageLabel": "Selección · Entrevistas",
      "trigger": "Proceso en subpaso 3",
      "questions": [
        {"q": "¿Cómo agendo entrevistas?", "a": "Invitas al candidato y propones horarios; él confirma uno y se genera la reunión."},
        {"q": "¿Cómo registro la entrevista?", "a": "La IA toma notas; tú añades tu calificación y retroalimentación."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub4",
      "stageLabel": "Selección · Selección y documentos",
      "trigger": "Proceso en subpaso 4",
      "questions": [
        {"q": "¿Cómo selecciono al candidato ideal?", "a": "Compara tu terna y elige al que mejor se ajuste; el sistema le pedirá la documentación."},
        {"q": "¿Qué reviso de su documentación?", "a": "Ves el checklist en modo solo lectura y validas si cumple con todos los requisitos."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub5",
      "stageLabel": "Contratación · Oferta",
      "trigger": "Proceso en subpaso 5",
      "questions": [
        {"q": "¿Cómo genero la oferta formal?", "a": "Define el sueldo, fecha de inicio y lugar de presentación; el candidato la recibe al instante."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub6",
      "stageLabel": "Contratación · Alta",
      "trigger": "Proceso en subpaso 6",
      "questions": [
        {"q": "¿Qué pasa cuando el candidato acepta?", "a": "El proceso se completa y queda registrado como contratado; se confirman los datos de ingreso."}
      ]
    },
    {
      "role": "admin",
      "stageKey": "admin_vacantes",
      "stageLabel": "Vacantes",
      "trigger": "Vista de catálogo de procesos",
      "questions": [
        {"q": "¿Qué administro aquí?", "a": "El catálogo de procesos: creas nuevos, revisas datos y atiendes solicitudes de cambios."},
        {"q": "¿Cómo atiendo una solicitud de cambios?", "a": "Revisas cada ajuste, lo aceptas o rechazas, y notificas al gestor."}
      ]
    },
    {
      "role": "admin",
      "stageKey": "admin_nueva",
      "stageLabel": "Nuevo proceso",
      "trigger": "Vista de creación de proceso",
      "questions": [
        {"q": "¿Qué datos debo completar?", "a": "Título, área, nivel, ubicación, requisitos, condiciones, etc. El formulario guía por secciones."},
        {"q": "¿Qué son los campos 'no relevantes'?", "a": "Requisitos que no penalizan en el match; se marcan para no filtrar candidatos."}
      ]
    },
    {
      "role": "admin",
      "stageKey": "admin_candidatos",
      "stageLabel": "Pool de candidatos",
      "trigger": "Vista de base de datos de candidatos",
      "questions": [
        {"q": "¿Qué veo en el pool?", "a": "El padrón de perfiles que alimenta el match de los procesos; puedes darlos de alta y editarlos."}
      ]
    },
    {
      "role": "admin",
      "stageKey": "admin_notif",
      "stageLabel": "Notificaciones",
      "trigger": "Vista de notificaciones del administrador",
      "questions": [
        {"q": "¿Qué notificaciones recibe el administrador?", "a": "Avisos sobre cambios en procesos, solicitudes de gestores, etc."}
      ]
    }
  ]
}
```

---

## 4. (Anexo) Otros conjuntos de preguntas dinámicas (no contextuales)

Además del catálogo contextual anterior, el sistema puede tener otras listas de preguntas que se **generan en tiempo real** a partir de datos específicos (ej. perfil del candidato, descripción del proceso) y no varían por etapa del usuario. Estos conjuntos se incluyen solo como referencia, por si se desea reutilizar su lógica.

### 4.1 Preguntas sugeridas durante una entrevista en vivo
Se generan con plantillas que toman información del proceso y del candidato:
1. `Cuéntame de un logro concreto como [puesto] y cómo lo mediste.`
2. `¿Cómo aplicarías [habilidad técnica principal] en los retos de este puesto?`
3. `Describe una situación donde demostraste [habilidad blanda principal].`
4. `¿Qué te motiva de esta posición y del esquema [modalidad]?`
5. `¿Cuál es tu expectativa salarial y disponibilidad?`

### 4.2 Preguntas para una entrevista grabada con IA (filtro inicial)
Guion de preguntas y respuestas modelo:
1. `Preséntate: trayectoria, especialidad y lo que buscas en tu siguiente reto.`
2. `Cuéntame un proyecto donde aplicaste [habilidades técnicas requeridas].`
3. `¿Cómo describirías tu nivel en [especialidad requerida]?`
4. `Describe una situación difícil con un cliente o compañero y cómo la resolviste.`
5. `¿Por qué te interesa esta posición y qué disponibilidad tienes?`

---

## 5. Instrucciones para la integración (genéricas)

Para incorporar este catálogo en el chat con IA de tu sistema, sigue estos pasos:

1. **Define la función de detección de contexto**  
   - Crea un servicio que, dado el estado actual de la aplicación (rol del usuario, pantalla activa, datos del proceso), devuelva una clave de etapa (ej. `cand_buscar`, `form_sub3`, `admin_vacantes`).  
   - Usa la lógica descrita en la Sección 2 o adapta a tu propio flujo.

2. **Almacena el catálogo JSON**  
   - Puedes incrustarlo en el código como un objeto constante o cargarlo desde un archivo de configuración.

3. **Implementa un selector de preguntas**  
   - Función `obtenerPreguntas(ctxKey)` que recorre el arreglo `sets` y devuelve el arreglo `questions` del primer set cuyo `role` coincida con el rol actual y `stageKey` con la clave detectada.  
   - Si no hay coincidencia, devuelve el set con `role: "general"` y `stageKey: "default"`.

4. **Conecta el selector al widget de chat**  
   - Cuando el chat se abre o el contexto cambia, llama al selector y actualiza la interfaz con los chips de preguntas.  
   - Cada chip debe mostrar el texto `q` y, al hacer clic, enviar esa cadena al motor de IA.

5. **Usa la respuesta de referencia (`a`) como *grounding***  
   - Opcionalmente, puedes inyectar el contenido de `a` en el prompt de la IA (ej. "Responde a la siguiente pregunta usando esta información base: ...") para asegurar coherencia con la lógica del sistema.

6. **Mantén la actualización automática**  
   - Suscríbete a los eventos de cambio de rol, navegación o estado del pipeline para refrescar las sugerencias sin que el usuario tenga que recargar.

