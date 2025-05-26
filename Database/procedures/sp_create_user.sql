-- PROCEDURE: public.sp_create_user(character varying, character varying, character varying, character varying, character varying, text, text, text, integer, integer, text, text, text, boolean, integer)

-- DROP PROCEDURE IF EXISTS public.sp_create_user(character varying, character varying, character varying, character varying, character varying, text, text, text, integer, integer, text, text, text, boolean, integer);

CREATE OR REPLACE PROCEDURE public.sp_create_user(
	IN p_name character varying,
	IN p_last_name character varying,
	IN p_username character varying,
	IN p_email character varying,
	IN p_phone character varying,
	IN p_about_me text,
	IN p_password_hash text,
	IN p_profile_photo_url text,
	IN p_user_type_id integer,
	IN p_user_status_id integer,
	INOUT r_username text DEFAULT NULL::text,
	INOUT r_email text DEFAULT NULL::text,
	INOUT r_message text DEFAULT NULL::text,
	INOUT r_success boolean DEFAULT false,
	INOUT r_user_id integer DEFAULT NULL::integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    -- Validar existencia de user_type_id y user_status_id
    IF NOT EXISTS (SELECT 1 FROM userTypes WHERE type_id = p_user_type_id) THEN
        r_message := 'Tipo de usuario no válido';
        r_success := FALSE;
        RETURN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM userStatus WHERE user_status_id = p_user_status_id) THEN
        r_message := 'Estado de usuario no válido';
        r_success := FALSE;
        RETURN;
    END IF;

    BEGIN
        INSERT INTO users (
            name, last_name, username, email, phone, about_me,
            password, profile_photo_url, user_type_id, user_status_id,
            last_password_update, creation_date
        )
        VALUES (
            p_name, p_last_name, p_username, p_email, p_phone, p_about_me,
            p_password_hash, p_profile_photo_url, p_user_type_id, p_user_status_id,
            NOW(), NOW()
        )
        RETURNING user_id INTO r_user_id;

        r_username := p_username;
        r_email := p_email;
        r_message := 'Usuario creado exitosamente';
        r_success := TRUE;

    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS r_message = MESSAGE_TEXT;
        r_success := FALSE;

        -- Manejar errores específicos por texto
        IF r_message LIKE '%unique constraint%' AND r_message LIKE '%username%' THEN
            r_message := 'El nombre de usuario ya está en uso';
            r_username := p_username;
        ELSIF r_message LIKE '%unique constraint%' AND r_message LIKE '%email%' THEN
            r_message := 'El email ya está registrado';
            r_email := p_email;
        ELSIF r_message LIKE '%foreign key violation%' THEN
            r_message := 'Error en las referencias de tipo o estado de usuario';
        END IF;
    END;
END;
$BODY$;
ALTER PROCEDURE public.sp_create_user(character varying, character varying, character varying, character varying, character varying, text, text, text, integer, integer, text, text, text, boolean, integer)