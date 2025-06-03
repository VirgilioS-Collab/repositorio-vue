// src/utils/icons.ts
export const ICONS = {
    /*  navegación / layout  */
    dashboard     : 'layout-dashboard',
    calendar      : 'calendar',
    users         : 'users',
    settings      : 'settings',
    bell          : 'bell',
    logout        : 'log-out',
    mapPin        : 'map-pin',

    /*  métricas  / tarjetas  */
    trendingUp    : 'trending-up',
    userPlus      : 'user-plus',
    activity      : 'activity',

    /*  acciones rápidas / botones  */
    plus          : 'plus',
    search        : 'search',
    download      : 'download',
    mail          : 'mail',
    userCheck     : 'user-check',
    userX         : 'user-x',
    logOut        : 'log-out',

    /*  multimedia / tipos de actividad  */
    camera        : 'camera',
    image         : 'image',

    /*  formularios / UI misc  */
    check         : 'check',
    x             : 'x',
    alertTriangle : 'alert-triangle',
    info          : 'info',
    chevronLeft   : 'chevron-left',
    chevronRight  : 'chevron-right',

    /*  redes sociales  */
    facebook      : 'facebook',
    instagram     : 'instagram',
    twitter       : 'twitter',

    /*  iconos “clásicos”  */
    book          : 'book',
    pencil        : 'pencil',
    lock          : 'lock',
    code          : 'code-2',
    cpu           : 'cpu',
    award         : 'award',
    database      : 'database',
    palette       : 'palette',
    shield        : 'shield',
    smartphone    : 'smartphone',
    brain         : 'brain',
    user          : 'user'
} as const

export type IconKey = keyof typeof ICONS
