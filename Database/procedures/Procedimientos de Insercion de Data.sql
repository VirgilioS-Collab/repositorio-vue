--Procedimientos Postgre sql

--1. UserTypes

CREATE OR REPLACE PROCEDURE insert_user_type(
    p_type_id INT,
    p_ut_type_name VARCHAR,
    p_ut_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO userTypes (type_id, ut_type_name, ut_description)
    VALUES (p_type_id, p_ut_type_name, p_ut_description);
END;
$$;


--2. UserStatus
	
CREATE OR REPLACE PROCEDURE insert_user_status(
    p_user_status_id INT,
    p_us_status_name VARCHAR,
    p_us_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO userStatus (user_status_id, us_status_name, us_description)
    VALUES (p_user_status_id, p_us_status_name, p_us_description);
END;
$$;



--3. Users

CREATE OR REPLACE PROCEDURE insert_user(
    p_user_id INT,
    p_u_name VARCHAR,
    p_u_last_name VARCHAR,
    p_u_username VARCHAR,
    p_u_email VARCHAR,
    p_u_phone VARCHAR,
    p_u_about_me TEXT,
    p_u_password VARCHAR,
    p_u_last_password_update DATE,
    p_u_profile_photo_url VARCHAR,
    p_u_user_type_id INT,
    p_u_user_status_id INT,
    p_u_creation_date DATE,
    p_u_last_login_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Users (
        user_id, u_name, u_last_name, u_username, u_email, u_phone,
        u_about_me, u_password, u_last_password_update, u_profile_photo_url,
        u_user_type_id, u_user_status_id, u_creation_date, u_last_login_date
    )
    VALUES (
        p_user_id, p_u_name, p_u_last_name, p_u_username, p_u_email, p_u_phone,
        p_u_about_me, p_u_password, p_u_last_password_update, p_u_profile_photo_url,
        p_u_user_type_id, p_u_user_status_id, p_u_creation_date, p_u_last_login_date
    );
END;
$$;


--4. groupCategories

CREATE OR REPLACE PROCEDURE insert_group_category(
    p_group_category_id INT,
    p_gc_category_name VARCHAR,
    p_gc_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO groupCategories (group_category_id, gc_category_name, gc_description)
    VALUES (p_group_category_id, p_gc_category_name, p_gc_description);
END;
$$;


--5. groupStatus

CREATE OR REPLACE PROCEDURE insert_group_status(
    p_group_status_id INT,
    p_gs_status_name VARCHAR,
    p_gs_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO groupStatus (group_status_id, gs_status_name, gs_description)
    VALUES (p_group_status_id, p_gs_status_name, p_gs_description);
END;
$$;


--6. Groups

CREATE OR REPLACE PROCEDURE insert_group(
    p_group_id INT,
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
        group_id, g_group_name, g_group_description, g_group_status_id,
        g_group_owner_id, g_group_category_id
    )
    VALUES (
        p_group_id, p_g_group_name, p_g_group_description, p_g_group_status_id,
        p_g_group_owner_id, p_g_group_category_id
    );
END;
$$;


7. groupMemberStatus

CREATE OR REPLACE PROCEDURE insert_group_member_status(
    p_group_member_status_id INT,
    p_gms_status_name VARCHAR,
    p_gms_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO groupMemberStatus (group_member_status_id, gms_status_name, gms_description)
    VALUES (p_group_member_status_id, p_gms_status_name, p_gms_description);
END;
$$;


--8. memberRoles

CREATE OR REPLACE PROCEDURE insert_member_role(
    p_role_id INT,
    p_mr_role_name VARCHAR,
    p_mr_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO memberRoles (role_id, mr_role_name, mr_description)
    VALUES (p_role_id, p_mr_role_name, p_mr_description);
END;
$$;


--9. groupMembers

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
END;
$$;


--10. groupsContacts

CREATE OR REPLACE PROCEDURE insert_group_contact(
    p_contact_info_id INT,
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
        contact_info_id, group_id, gc_contact_name, gc_contact_type,
        gc_contact_value, gc_is_primary
    )
    VALUES (
        p_contact_info_id, p_group_id, p_gc_contact_name, p_gc_contact_type,
        p_gc_contact_value, p_gc_is_primary
    );
END;
$$;


--11. groupJoinRequests

CREATE OR REPLACE PROCEDURE insert_group_join_request(
    p_request_id INT,
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
        request_id, gjr_group_id, gjr_user_id, gjr_request_status_id,
        gjr_created_at, gjr_updated_at
    )
    VALUES (
        p_request_id, p_gjr_group_id, p_gjr_user_id, p_gjr_request_status_id,
        p_gjr_created_at, p_gjr_updated_at
    );
END;
$$;


--12. activityTypes

CREATE OR REPLACE PROCEDURE insert_activity_type(
    p_activity_type_id INT,
    p_at_activity_type_name VARCHAR,
    p_at_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO activityTypes (activity_type_id, at_activity_type_name, at_description)
    VALUES (p_activity_type_id, p_at_activity_type_name, p_at_description);
END;
$$;


--13. activityStatus

CREATE OR REPLACE PROCEDURE insert_activity_status(
    p_activity_status_id INT,
    p_as_activity_status_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO activityStatus (activity_status_id, as_activity_status_name)
    VALUES (p_activity_status_id, p_as_activity_status_name);
END;
$$;


--14. groupActivities

CREATE OR REPLACE PROCEDURE insert_group_activity(
    p_activity_id INT,
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
        activity_id, ga_activity_name, ga_activity_description,
        ga_max_participants, ga_activity_type, ga_activity_status,
        ga_group_id, ga_creator_id
    )
    VALUES (
        p_activity_id, p_ga_activity_name, p_ga_activity_description,
        p_ga_max_participants, p_ga_activity_type, p_ga_activity_status,
        p_ga_group_id, p_ga_creator_id
    );
END;
$$;


--15. activitiesSchedule

CREATE OR REPLACE PROCEDURE insert_activity_schedule(
    p_schedule_id INT,
    p_as_activity_id INT,
    p_as_activity_start_date DATE,
    p_as_activity_end_date DATE,
    p_as_activity_location VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO activitiesSchedule (
        schedule_id, as_activity_id, as_activity_start_date,
        as_activity_end_date, as_activity_location
    )
    VALUES (
        p_schedule_id, p_as_activity_id, p_as_activity_start_date,
        p_as_activity_end_date, p_as_activity_location
    );
END;
$$;


--16. activityParticipants

CREATE OR REPLACE PROCEDURE insert_activity_participant(
    p_participant_id INT,
    p_ap_user_id INT,
    p_ap_activity_id INT,
    p_ap_registration_date DATE,
    p_ap_attendance_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO activityParticipants (
        participant_id, ap_user_id, ap_activity_id,
        ap_registration_date, ap_attendance_date
    )
    VALUES (
        p_participant_id, p_ap_user_id, p_ap_activity_id,
        p_ap_registration_date, p_ap_attendance_date
    );
END;
$$;
