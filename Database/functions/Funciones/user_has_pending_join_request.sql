-- Verifica si un usuario ya tiene una solicitud pendiente para un grupo
CREATE OR REPLACE FUNCTION user_has_pending_join_request(user_id INT, group_id INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    result BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM groupJoinRequests
        WHERE gjr_user_id = $1 AND gjr_group_id = $2 AND gjr_request_status_id = 1
    ) INTO result;

    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error en user_has_pending_join_request: %', SQLERRM;
END;
$$;