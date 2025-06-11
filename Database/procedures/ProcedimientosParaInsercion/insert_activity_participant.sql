
CREATE OR REPLACE PROCEDURE insert_activity_participant(
    p_ap_user_id INT,
    p_ap_activity_id INT,
    p_ap_registration_date DATE,
    p_ap_attendance_date DATE
)
LANGUAGE plpgsql
AS $$

BEGIN
    INSERT INTO activityParticipants (
        ap_user_id, ap_activity_id,
        ap_registration_date, ap_attendance_date
    )
    VALUES (
        p_ap_user_id, p_ap_activity_id,
        p_ap_registration_date, p_ap_attendance_date
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in procedure insert_activity_participant: %', SQLERRM;
END;
$$;
