
CREATE OR REPLACE PROCEDURE insert_group_contact(
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
        group_id, gc_contact_name, gc_contact_type,
        gc_contact_value, gc_is_primary
    )
    VALUES (
        p_group_id, p_gc_contact_name, p_gc_contact_type,
        p_gc_contact_value, p_gc_is_primary
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in procedure insert_group_contact: %', SQLERRM;
END;
$$;
