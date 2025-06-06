-- ============================================
-- approve_group_member.sql
-- Aprueba a un usuario como miembro oficial de un grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE approve_group_member(
    p_user_id INT,
    p_group_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE groupMembers
    SET gm_status_id = 2, -- Aprobado
        gm_updated_at = CURRENT_DATE
    WHERE user_id = p_user_id AND group_id = p_group_id;
END;
$$;

-- ============================================
-- delete_group_member.sql
-- Elimina a un usuario de un grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE delete_group_member(
    p_user_id INT,
    p_group_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM groupMembers
    WHERE user_id = p_user_id AND group_id = p_group_id;
END;
$$;

-- ============================================
-- insert_activity_participant.sql
-- Registra a un usuario como participante de una actividad.
-- ============================================
CREATE OR REPLACE PROCEDURE insert_activity_participant(
    p_participant_id INT,
    p_ap_user_id INT,
    p_ap_activity_id INT,
    p_ap_registration_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO activityParticipants (
        participant_id, ap_user_id, ap_activity_id, ap_registration_date
    )
    VALUES (
        p_participant_id, p_ap_user_id, p_ap_activity_id, p_ap_registration_date
    );
END;
$$;

-- ============================================
-- insert_activity_schedule.sql
-- Asocia una actividad con fecha, hora y lugar.
-- ============================================
CREATE OR REPLACE PROCEDURE insert_activity_schedule(
    p_schedule_id INT,
    p_as_activity_id INT,
    p_as_activity_start_date DATE,
    p_as_activity_end_date DATE,
    p_as_activity_location VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO activitiesSchedule (
        schedule_id, as_activity_id, as_activity_start_date,
        as_activity_end_date, as_activity_location
    )
    VALUES (
        p_schedule_id, p_as_activity_id, p_as_activity_start_date,
        p_as_activity_end_date, p_as_activity_location
    );
END;
$$;

-- ============================================
-- insert_group.sql
-- Crea un nuevo grupo con su nombre, descripción y categoría.
-- ============================================
CREATE OR REPLACE PROCEDURE insert_group(
    p_group_id INT,
    p_g_group_name VARCHAR,
    p_g_group_description TEXT,
    p_g_group_status_id INT,
    p_g_group_owner_id INT,
    p_g_group_category_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Groups (
        group_id, g_group_name, g_group_description, g_group_status_id,
        g_group_owner_id, g_group_category_id
    )
    VALUES (
        p_group_id, p_g_group_name, p_g_group_description, p_g_group_status_id,
        p_g_group_owner_id, p_g_group_category_id
    );
END;
$$;

-- ============================================
-- insert_group_activity.sql
-- Crea una actividad asociada a un grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE insert_group_activity(
    p_activity_id INT,
    p_ga_activity_name VARCHAR,
    p_ga_activity_description TEXT,
    p_ga_max_participants INT,
    p_ga_activity_type INT,
    p_ga_activity_status INT,
    p_ga_group_id INT,
    p_ga_creator_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO groupActivities (
        activity_id, ga_activity_name, ga_activity_description,
        ga_max_participants, ga_activity_type, ga_activity_status,
        ga_group_id, ga_creator_id
    )
    VALUES (
        p_activity_id, p_ga_activity_name, p_ga_activity_description,
        p_ga_max_participants, p_ga_activity_type, p_ga_activity_status,
        p_ga_group_id, p_ga_creator_id
    );
END;
$$;

-- ============================================
-- insert_group_contact.sql
-- Agrega información de contacto a un grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE insert_group_contact(
    p_contact_info_id INT,
    p_group_id INT,
    p_gc_contact_name VARCHAR,
    p_gc_contact_type VARCHAR,
    p_gc_contact_value VARCHAR,
    p_gc_is_primary BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO groupsContacts (
        contact_info_id, group_id, gc_contact_name,
        gc_contact_type, gc_contact_value, gc_is_primary
    )
    VALUES (
        p_contact_info_id, p_group_id, p_gc_contact_name,
        p_gc_contact_type, p_gc_contact_value, p_gc_is_primary
    );
END;
$$;

-- ============================================
-- insert_group_join_request.sql
-- Registra una solicitud para unirse a un grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE insert_group_join_request(
    p_request_id INT,
    p_gjr_group_id INT,
    p_gjr_user_id INT,
    p_gjr_request_status_id INT,
    p_gjr_created_at DATE,
    p_gjr_updated_at DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO groupJoinRequests (
        request_id, gjr_group_id, gjr_user_id,
        gjr_request_status_id, gjr_created_at, gjr_updated_at
    )
    VALUES (
        p_request_id, p_gjr_group_id, p_gjr_user_id,
        p_gjr_request_status_id, p_gjr_created_at, p_gjr_updated_at
    );
END;
$$;

-- ============================================
-- insert_group_member.sql
-- Registra un usuario como miembro de un grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE insert_group_member(
    p_user_id INT,
    p_group_id INT,
    p_gm_signup_date DATE,
    p_gm_role_id INT,
    p_gm_status_id INT,
    p_gm_approved_by INT,
    p_gm_updated_at DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO groupMembers (
        user_id, group_id, gm_signup_date, gm_role_id, gm_status_id,
        gm_approved_by, gm_updated_at
    )
    VALUES (
        p_user_id, p_group_id, p_gm_signup_date, p_gm_role_id, p_gm_status_id,
        p_gm_approved_by, p_gm_updated_at
    );
END;
$$;

-- ============================================
-- insert_user.sql
-- Inserta un nuevo usuario con todos sus datos personales y estado.
-- ============================================
CREATE OR REPLACE PROCEDURE insert_user(
    p_user_id INT,
    p_u_name VARCHAR,
    p_u_last_name VARCHAR,
    p_u_username VARCHAR,
    p_u_email VARCHAR,
    p_u_phone VARCHAR,
    p_u_about_me TEXT,
    p_u_password VARCHAR,
    p_u_last_password_update DATE,
    p_u_profile_photo_url VARCHAR,
    p_u_user_type_id INT,
    p_u_user_status_id INT,
    p_u_creation_date DATE,
    p_u_last_login_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Users (
        user_id, u_name, u_last_name, u_username, u_email, u_phone,
        u_about_me, u_password, u_last_password_update, u_profile_photo_url,
        u_user_type_id, u_user_status_id, u_creation_date, u_last_login_date
    )
    VALUES (
        p_user_id, p_u_name, p_u_last_name, p_u_username, p_u_email, p_u_phone,
        p_u_about_me, p_u_password, p_u_last_password_update, p_u_profile_photo_url,
        p_u_user_type_id, p_u_user_status_id, p_u_creation_date, p_u_last_login_date
    );
END;
$$;

-- ============================================
-- update_group.sql
-- Actualiza el nombre y descripción de un grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE update_group(
    p_group_id INT,
    p_g_group_name VARCHAR,
    p_g_group_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Groups
    SET g_group_name = p_g_group_name,
        g_group_description = p_g_group_description
    WHERE group_id = p_group_id;
END;
$$;

-- ============================================
-- update_group_activity.sql
-- Modifica los datos de una actividad existente.
-- ============================================
CREATE OR REPLACE PROCEDURE update_group_activity(
    p_activity_id INT,
    p_ga_activity_name VARCHAR,
    p_ga_activity_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE groupActivities
    SET ga_activity_name = p_ga_activity_name,
        ga_activity_description = p_ga_activity_description
    WHERE activity_id = p_activity_id;
END;
$$;

-- ============================================
-- update_group_member_role.sql
-- Cambia el rol de un miembro dentro de un grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE update_group_member_role(
    p_user_id INT,
    p_group_id INT,
    p_role_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE groupMembers
    SET gm_role_id = p_role_id,
        gm_updated_at = CURRENT_DATE
    WHERE user_id = p_user_id AND group_id = p_group_id;
END;
$$;

-- ============================================
-- update_group_status.sql
-- Cambia el estado de un grupo (activo, inactivo, etc.).
-- ============================================
CREATE OR REPLACE PROCEDURE update_group_status(
    p_group_id INT,
    p_status_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Groups
    SET g_group_status_id = p_status_id
    WHERE group_id = p_group_id;
END;
$$;

-- ============================================
-- update_join_request_status.sql
-- Actualiza el estado de una solicitud de ingreso a grupo.
-- ============================================
CREATE OR REPLACE PROCEDURE update_join_request_status(
    p_request_id INT,
    p_status_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE groupJoinRequests
    SET gjr_request_status_id = p_status_id,
        gjr_updated_at = CURRENT_DATE
    WHERE request_id = p_request_id;
END;
$$;

-- ============================================
-- update_participant_attendance.sql
-- Marca la asistencia de un participante.
-- ============================================
CREATE OR REPLACE PROCEDURE update_participant_attendance(
    p_participant_id INT,
    p_ap_attendance_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE activityParticipants
    SET ap_attendance_date = p_ap_attendance_date
    WHERE participant_id = p_participant_id;
END;
$$;

-- ============================================
-- update_user_password.sql
-- Actualiza la contraseña y la fecha de cambio de un usuario.
-- ============================================
CREATE OR REPLACE PROCEDURE update_user_password(
    p_user_id INT,
    p_new_password VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Users
    SET u_password = p_new_password,
        u_last_password_update = CURRENT_DATE
    WHERE user_id = p_user_id;
END;
$$;

-- ============================================
-- update_user_status.sql
-- Cambia el estado del usuario (activo, suspendido, etc.).
-- ============================================
CREATE OR REPLACE PROCEDURE update_user_status(
    p_user_id INT,
    p_status_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Users
    SET u_user_status_id = p_status_id
    WHERE user_id = p_user_id;
END;
$$;