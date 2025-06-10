
CREATE OR REPLACE PROCEDURE insert_user(
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
    p_u_last_login_date DATE,
    p_u_birth_date DATE,
    p_u_document_number VARCHAR,
    p_u_document_type_id INT,
    p_u_gender_id INT
)
LANGUAGE plpgsql
AS $$

BEGIN
    INSERT INTO Users (
        u_name, u_last_name, u_username, u_email, u_phone,
        u_about_me, u_password, u_last_password_update, u_profile_photo_url,
        u_user_type_id, u_user_status_id, u_creation_date, u_last_login_date,
        u_birth_date, u_document_number, u_document_type_id, u_gender_id
    )
    VALUES (
        p_u_name, p_u_last_name, p_u_username, p_u_email, p_u_phone,
        p_u_about_me, p_u_password, p_u_last_password_update, p_u_profile_photo_url,
        p_u_user_type_id, p_u_user_status_id, p_u_creation_date, p_u_last_login_date,
        p_u_birth_date, p_u_document_number, p_u_document_type_id, p_u_gender_id
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in procedure insert_user: %', SQLERRM;
END;
$$;
