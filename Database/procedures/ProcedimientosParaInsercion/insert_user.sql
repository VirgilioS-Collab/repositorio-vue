CREATE OR REPLACE PROCEDURE insert_user(
    p_u_name VARCHAR,
    p_u_last_name VARCHAR,
    p_u_username VARCHAR,
    p_u_email VARCHAR,
    p_u_phone VARCHAR,
    p_u_about_me TEXT,
    p_u_password VARCHAR,
    p_u_user_type_id INT,
    p_u_user_status_id INT,
    p_u_birth_date DATE,
    p_u_document_number VARCHAR,
    p_u_document_type_id INT,
    p_u_gender_id INT
)
LANGUAGE plpgsql
AS $$

DECLARE
    v_user_type_id INT;
    v_user_status_id INT;
    v_doc_type_id INT;
    v_gender_id INT;
BEGIN
    -- Buscar ID del tipo de usuario
    SELECT id INTO v_user_type_id
    FROM usertypes
    WHERE ut_type_name = 'Usuario'
    LIMIT 1;

    IF v_user_type_id IS NULL THEN
        RAISE NOTICE 'Tipo de usuario "Usuario" no encontrado';
        RETURN;
    END IF;

    -- Buscar ID del estado de usuario
    SELECT id INTO v_user_status_id
    FROM userstatuses
    WHERE us_type_name = 'Activo'
    LIMIT 1;

    IF v_user_status_id IS NULL THEN
        RAISE NOTICE 'Estado de usuario "Activo" no encontrado';
        RETURN;
    END IF;

    -- Buscar ID del tipo de documento
    SELECT id INTO v_doc_type_id
    FROM documenttypes
    WHERE name = p_u_document_type_name
    LIMIT 1;

    IF v_doc_type_id IS NULL THEN
        RAISE NOTICE 'Tipo de documento "%" no encontrado', p_u_document_type_name;
        RETURN;
    END IF;

    -- Buscar ID del género
    SELECT id INTO v_gender_id
    FROM genders
    WHERE name = p_u_gender_name
    LIMIT 1;

    IF v_gender_id IS NULL THEN
        RAISE NOTICE 'Género "%" no encontrado', p_u_gender_name;
        RETURN;
    END IF;

    -- Insertar usuario
    INSERT INTO Users (
        u_name, u_last_name, u_username, u_email, u_phone,
        u_about_me, u_password, u_last_password_update, u_profile_photo_url,
        u_user_type_id, u_user_status_id, u_creation_date, u_last_login_date,
        u_birth_date, u_document_number, u_document_type_id, u_gender_id
    )
    VALUES (
        p_u_name, p_u_last_name, p_u_username, p_u_email, p_u_phone,
        p_u_about_me, p_u_password, NULL, NULL,
        v_user_type_id, v_user_status_id, NOW(), NULL,
        p_u_birth_date, p_u_document_number, v_doc_type_id, v_gender_id
    );

    RAISE NOTICE 'Usuario creado exitosamente';
END;
$$;
