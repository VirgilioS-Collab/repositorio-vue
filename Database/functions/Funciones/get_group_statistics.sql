-- Devuelve estadísticas de un grupo: cantidad de miembros, actividades y participantes
CREATE OR REPLACE FUNCTION get_group_statistics(group_id INT)
RETURNS TABLE (
    member_count INT,
    activity_count INT,
    participant_count INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM groupMembers WHERE group_id = group_id AND gm_status_id = 2),
        (SELECT COUNT(*) FROM groupActivities WHERE ga_group_id = group_id),
        (SELECT COUNT(*) FROM activityParticipants ap
         JOIN groupActivities ga ON ap.ap_activity_id = ga.activity_id
         WHERE ga.ga_group_id = group_id);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error en get_group_statistics: %', SQLERRM;
END;
$$;