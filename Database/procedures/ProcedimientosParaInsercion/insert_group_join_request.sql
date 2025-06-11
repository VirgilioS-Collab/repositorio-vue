
CREATE OR REPLACE PROCEDURE insert_group_join_request(
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
        gjr_group_id, gjr_user_id, gjr_request_status_id,
        gjr_created_at, gjr_updated_at
    )
    VALUES (
        p_gjr_group_id, p_gjr_user_id, p_gjr_request_status_id,
        p_gjr_created_at, p_gjr_updated_at
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in procedure insert_group_join_request: %', SQLERRM;
END;
$$;
