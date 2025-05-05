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
    pencil   : 'pencil',     
    lock     : 'lock',
    logout   : 'log-out',
    x        : 'x',

    logOut   : 'log-out',

    /* Grupos */
    code       : 'code-2',
    cpu        : 'cpu',
    award      : 'award',
    database   : 'database',
    palette    : 'palette',
    shield     : 'shield',
    smartphone : 'smartphone',
    brain      : 'brain',
} as const

export type IconKey = keyof typeof ICONS
