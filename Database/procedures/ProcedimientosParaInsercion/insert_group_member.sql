
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
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in procedure insert_group_member: %', SQLERRM;
END;
$$;
