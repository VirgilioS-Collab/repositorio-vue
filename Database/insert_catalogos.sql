
-- Tabla: userTypes
INSERT INTO userTypes (type_id, ut_type_name, ut_description) VALUES
(1, 'Estudiante', 'Usuario con rol de estudiante'),
(2, 'Profesor', 'Usuario con rol de docente'),
(3, 'Administrador', 'Usuario con privilegios administrativos');

-- Tabla: userStatus
INSERT INTO userStatus (user_status_id, us_status_name, us_description) VALUES
(1, 'Activo', 'Usuario activo en la plataforma'),
(2, 'Inactivo', 'Usuario deshabilitado o suspendido');

-- Tabla: documentTypes
INSERT INTO documentTypes (document_type_id, dt_type_name, dt_description) VALUES
(1, 'Cédula', 'Documento nacional de identidad'),
(2, 'Pasaporte', 'Documento oficial para viajes internacionales');

-- Tabla: genderTypes
INSERT INTO genderTypes (gender_id, g_gender_name, g_description) VALUES
(1, 'Masculino', 'Identifica como hombre'),
(2, 'Femenino', 'Identifica como mujer'),
(4, 'Prefiero no decirlo', 'Prefiere no especificar su género');

-- Tabla: groupCategories
INSERT INTO groupCategories (group_category_id, gc_category_name, gc_description) VALUES
(1, 'Académico', 'Grupos relacionados con asignaturas o clases'),
(2, 'Deportivo', 'Grupos de actividad física o deportiva'),
(3, 'Cultural', 'Grupos artísticos y culturales');

-- Tabla: groupStatus
INSERT INTO groupStatus (group_status_id, gs_status_name, gs_description) VALUES
(1, 'Activo', 'Grupo en funcionamiento'),
(2, 'Inactivo', 'Grupo cerrado o en pausa');

-- Tabla: groupMemberStatus
INSERT INTO groupMemberStatus (group_member_status_id, gms_status_name, gms_description) VALUES
(1, 'Pendiente', 'Solicitud en espera de aprobación'),
(2, 'Aprobado', 'Miembro aprobado'),
(3, 'Rechazado', 'Solicitud denegada');

-- Tabla: memberRoles
INSERT INTO memberRoles (role_id, mr_role_name, mr_description) VALUES
(1, 'Miembro', 'Miembro regular del grupo'),
(2, 'Moderador', 'Miembro con permisos limitados de gestión'),
(3, 'Administrador', 'Responsable del grupo');

-- Tabla: activityTypes
INSERT INTO activityTypes (activity_type_id, at_activity_type_name, at_description) VALUES
(1, 'Taller', 'Actividad práctica de aprendizaje'),
(2, 'Charla', 'Conferencia o sesión informativa'),
(3, 'Evento Social', 'Actividad recreativa');

-- Tabla: activityStatus
INSERT INTO activityStatus (activity_status_id, as_activity_status_name) VALUES
(1, 'Programada'),
(2, 'Realizada'),
(3, 'Cancelada');
