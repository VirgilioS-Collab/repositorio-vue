-- Devuelve el user_id interno a partir del UID de autenticación de Supabase
CREATE OR REPLACE FUNCTION get_user_id_by_auth_uid(auth_uid UUID)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    result INT;
BEGIN
    SELECT user_id INTO result FROM Users WHERE auth_uid = auth_uid;

    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error en get_user_id_by_auth_uid: %', SQLERRM;
END;
$$;