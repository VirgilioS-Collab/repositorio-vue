-- ============================================
-- get_user_id_by_auth_uid
-- Devuelve el user_id interno a partir del UID de autenticación de Supabase
-- ============================================
CREATE OR REPLACE FUNCTION get_user_id_by_auth_uid(auth_uid UUID)
RETURNS INT
LANGUAGE sql
AS $$
    SELECT user_id FROM Users WHERE auth_uid = auth_uid;
$$;

-- ============================================
-- is_user_member_of_group
-- Verifica si un usuario pertenece a un grupo con estado "aceptado"
-- ============================================
CREATE OR REPLACE FUNCTION is_user_member_of_group(user_id INT, group_id INT)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
    SELECT EXISTS (
        SELECT 1 FROM groupMembers
        WHERE user_id = $1 AND group_id = $2 AND gm_status_id = 2
    );
$$;

-- ============================================
-- get_upcoming_activities
-- Devuelve todas las actividades futuras de los grupos a los que pertenece el usuario
-- ============================================
CREATE OR REPLACE FUNCTION get_upcoming_activities(user_id INT)
RETURNS TABLE (
    activity_id INT,
    activity_name VARCHAR,
    start_date DATE,
    location VARCHAR
)
LANGUAGE sql
AS $$
    SELECT
        a.activity_id,
        a.ga_activity_name,
        s.as_activity_start_date,
        s.as_activity_location
    FROM groupActivities a
    JOIN activitiesSchedule s ON s.as_activity_id = a.activity_id
    WHERE a.ga_group_id IN (
        SELECT group_id FROM groupMembers
        WHERE user_id = $1 AND gm_status_id = 2
    )
    AND s.as_activity_start_date >= CURRENT_DATE;
$$;

-- ============================================
-- get_group_statistics
-- Devuelve estadísticas de un grupo: cantidad de miembros, actividades y participantes
-- ============================================
CREATE OR REPLACE FUNCTION get_group_statistics(group_id INT)
RETURNS TABLE (
    member_count INT,
    activity_count INT,
    participant_count INT
)
LANGUAGE sql
AS $$
    SELECT
        (SELECT COUNT(*) FROM groupMembers WHERE group_id = $1 AND gm_status_id = 2),
        (SELECT COUNT(*) FROM groupActivities WHERE ga_group_id = $1),
        (SELECT COUNT(*) FROM activityParticipants ap
         JOIN groupActivities ga ON ap.ap_activity_id = ga.activity_id
         WHERE ga.ga_group_id = $1);
$$;

-- ============================================
-- user_has_pending_join_request
-- Verifica si un usuario ya tiene una solicitud pendiente para un grupo
-- ============================================
CREATE OR REPLACE FUNCTION user_has_pending_join_request(user_id INT, group_id INT)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
    SELECT EXISTS (
        SELECT 1 FROM groupJoinRequests
        WHERE gjr_user_id = $1 AND gjr_group_id = $2 AND gjr_request_status_id = 1
    );
$$;