
CREATE OR REPLACE PROCEDURE insert_group_activity(
    p_ga_activity_name VARCHAR,
    p_ga_activity_description TEXT,
    p_ga_max_participants INT,
    p_ga_activity_type INT,
    p_ga_activity_status INT,
    p_ga_group_id INT,
    p_ga_creator_id INT
)
LANGUAGE plpgsql
AS $$

BEGIN
    INSERT INTO groupActivities (
        ga_activity_name, ga_activity_description,
        ga_max_participants, ga_activity_type, ga_activity_status,
        ga_group_id, ga_creator_id
    )
    VALUES (
        p_ga_activity_name, p_ga_activity_description,
        p_ga_max_participants, p_ga_activity_type, p_ga_activity_status,
        p_ga_group_id, p_ga_creator_id
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in procedure insert_group_activity: %', SQLERRM;
END;
$$;
