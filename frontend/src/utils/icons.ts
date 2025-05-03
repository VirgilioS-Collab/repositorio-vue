/**
 * ------------------------------------------------------------------
 * Catálogo central de *identificadores* de Lucide que usa la app.
 *
 *  • La clave es el nombre que se maneja en la lógica (p. ej. `calendar`)
 *  • El valor es el string que Lucide espera en el atributo `data-lucide`
 *
 *  Ejemplo en una plantilla Vue:
 *    <i :data-lucide="ICONS.calendar" class="w-4 h-4" />
 * ------------------------------------------------------------------ */

export const ICONS = {
    /* Acciones rápidas */
    plus   : 'plus',
    users  : 'users',
    search : 'search',

    /* Cabeceras / UI */
    calendar : 'calendar',
    location : 'map-pin',
    user     : 'user',
    book     : 'book',
    edit     : 'pencil',   // ←  cambia ‘edit’ → ‘pencil’
    lock     : 'lock',
    logout   : 'log-out',

    /* Grupos */
    code        : 'code-2',
    cpu         : 'cpu',
    award       : 'award',
    database    : 'database',
    palette     : 'palette',
    shield      : 'shield',
    smartphone  : 'smartphone',
    brain       : 'brain'
} as const


/** Tipo auxiliar para que las props de Vue puedan ponerse en clave fuerte */
export type IconKey = keyof typeof ICONS
