-- Verifica si un usuario pertenece a un grupo con estado 'aceptado'
CREATE OR REPLACE FUNCTION is_user_member_of_group(user_id INT, group_id INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    result BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM groupMembers
        WHERE user_id = $1 AND group_id = $2 AND gm_status_id = 2
    ) INTO result;

    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error en is_user_member_of_group: %', SQLERRM;
END;
$$;