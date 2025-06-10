
CREATE OR REPLACE PROCEDURE insert_group(
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
        g_group_name, g_group_description, g_group_status_id,
        g_group_owner_id, g_group_category_id
    )
    VALUES (
        p_g_group_name, p_g_group_description, p_g_group_status_id,
        p_g_group_owner_id, p_g_group_category_id
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in procedure insert_group: %', SQLERRM;
END;
$$;
