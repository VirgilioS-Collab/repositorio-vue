-- Devuelve todas las actividades futuras de los grupos a los que pertenece el usuario
CREATE OR REPLACE FUNCTION get_upcoming_activities(user_id INT)
RETURNS TABLE (
    activity_id INT,
    activity_name VARCHAR,
    start_date DATE,
    location VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.activity_id,
        a.ga_activity_name,
        s.as_activity_start_date,
        s.as_activity_location
    FROM groupActivities a
    JOIN activitiesSchedule s ON s.as_activity_id = a.activity_id
    WHERE a.ga_group_id IN (
        SELECT group_id FROM groupMembers
        WHERE user_id = user_id AND gm_status_id = 2
    )
    AND s.as_activity_start_date >= CURRENT_DATE;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error en get_upcoming_activities: %', SQLERRM;
END;
$$;