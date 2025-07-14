/**
 * @file src/services/dao/models/Admin.ts
 * @description Define los tipos y DTOs para el Panel de Administración.
 * Este archivo agrupa todos los contratos de datos necesarios para las
 * vistas de gestión del club.
 */

// --- DTOs para Ajustes del Club (RF5.4) ---

/**
 * @interface ClubSettingsDTO
 * @description Define los campos que se pueden actualizar en la
 * pantalla de ajustes generales del club.
 */
export interface ClubSettingsDTO {
    name?: string;
    logo_url?: string;
    description?: string;
    social_links?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        website?: string;
    };
    has_funds?: boolean;
}

/**
 * @interface PermissionUpdateDTO
 * @description Define la estructura para actualizar la matriz de permisos.
 */
export interface PermissionUpdateDTO {
    role: string;
    permissions: Record<string, boolean>;
}


// --- DTOs para Gestión de Miembros (RF5.2) ---

/**
 * @interface InviteMembersDTO
 * @description Define el payload para la API de invitar miembros.
 */
export interface InviteMembersDTO {
    emails: string[];
    role: string;
}

/**
 * @interface BulkMemberUpdateDTO
 * @description Define el payload para realizar acciones masivas sobre miembros.
 */
export interface BulkMemberUpdateDTO {
    member_ids: number[];
    action: 'activate' | 'deactivate' | 'change_role' | 'remove';
    new_role?: string;
}

/**
 * @interface AdminMemberListParams
 * @description Define los parámetros de consulta para filtrar y paginar
 * la lista de miembros en el panel de administración.
 */
export interface AdminMemberListParams {
    page: number;
    limit: number;
    query?: string;
    role?: string;
    status?: string;
}


// --- DTOs para Finanzas (RF5.3.4) ---

/**
 * @interface FinanceSummaryDTO
 * @description Define la estructura del resumen financiero que se
 * muestra en el dashboard del club.
 */
export interface FinanceSummaryDTO {
    income: number;
    expenses: number;
    balance: number;
    historical_dates?: string[];
    historical_balances?: number[];
}

/**
 * @interface TransactionDTO
 * @description Define la estructura de una transacción financiera.
 */
export interface TransactionDTO {
    id: number;
    date: string; // Formato ISO "YYYY-MM-DDTHH:MM:SSZ"
    description: string;
    category: string;
    type: 'income' | 'expense';
    amount: number;
}

/**
 * @type TransactionCreateDTO
 * @description Define el DTO para crear una nueva transacción,
 * omitiendo el 'id' que es generado por el servidor.
 */
export type TransactionCreateDTO = Omit<TransactionDTO, 'id'>;