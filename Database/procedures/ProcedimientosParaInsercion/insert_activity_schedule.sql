
CREATE OR REPLACE PROCEDURE insert_activity_schedule(
    p_as_activity_id INT,
    p_as_activity_start_date DATE,
    p_as_activity_end_date DATE,
    p_as_activity_location VARCHAR
)
LANGUAGE plpgsql
AS $$

BEGIN
    INSERT INTO activitiesSchedule (
        as_activity_id, as_activity_start_date,
        as_activity_end_date, as_activity_location
    )
    VALUES (
        p_as_activity_id, p_as_activity_start_date,
        p_as_activity_end_date, p_as_activity_location
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in procedure insert_activity_schedule: %', SQLERRM;
END;
$$;
