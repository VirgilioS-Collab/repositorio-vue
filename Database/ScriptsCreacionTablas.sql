-- Tabla userTypes
CREATE TABLE userTypes (
    type_id INT PRIMARY KEY,
    ut_type_name VARCHAR(100),
    ut_description TEXT
);

-- Tabla userStatus
CREATE TABLE userStatus (
    user_status_id INT PRIMARY KEY,
    us_status_name VARCHAR(100),
    us_description TEXT
);

-- Tabla Users
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    u_name VARCHAR(100),
    u_last_name VARCHAR(100),
    u_username VARCHAR(100),
    u_email VARCHAR(100),
    u_phone VARCHAR(20),
    u_about_me TEXT,
    u_password VARCHAR(100),
    u_last_password_update DATE,
    u_profile_photo_url VARCHAR(255),
    u_user_type_id INT,
    u_user_status_id INT,
    u_creation_date DATE,
    u_last_login_date DATE,
    FOREIGN KEY (u_user_type_id) REFERENCES userTypes(type_id),
    FOREIGN KEY (u_user_status_id) REFERENCES userStatus(user_status_id)
);

-- Tabla groupCategories
CREATE TABLE groupCategories (
    group_category_id INT PRIMARY KEY,
    gc_category_name VARCHAR(100),
    gc_description TEXT
);

-- Tabla groupStatus
CREATE TABLE groupStatus (
    group_status_id INT PRIMARY KEY,
    gs_status_name VARCHAR(100),
    gs_description TEXT
);

-- Tabla Groups
CREATE TABLE Groups (
    group_id INT PRIMARY KEY,
    g_group_name VARCHAR(100),
    g_group_description TEXT,
    g_group_status_id INT,
    g_group_owner_id INT,
    g_group_category_id INT,
    FOREIGN KEY (g_group_status_id) REFERENCES groupStatus(group_status_id),
    FOREIGN KEY (g_group_owner_id) REFERENCES Users(user_id),
    FOREIGN KEY (g_group_category_id) REFERENCES groupCategories(group_category_id)
);

-- Tabla groupMemberStatus
CREATE TABLE groupMemberStatus (
    group_member_status_id INT PRIMARY KEY,
    gms_status_name VARCHAR(100),
    gms_description TEXT
);

-- Tabla memberRoles
CREATE TABLE memberRoles (
    role_id INT PRIMARY KEY,
    mr_role_name VARCHAR(100),
    mr_description TEXT
);

-- Tabla groupMembers
CREATE TABLE groupMembers (
    user_id INT,
    group_id INT,
    gm_signup_date DATE,
    gm_role_id INT,
    gm_status_id INT,
    gm_approved_by INT,
    gm_updated_at DATE,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (gm_role_id) REFERENCES memberRoles(role_id),
    FOREIGN KEY (gm_status_id) REFERENCES groupMemberStatus(group_member_status_id),
    FOREIGN KEY (gm_approved_by) REFERENCES Users(user_id)
);

-- Tabla groupsContacts
CREATE TABLE groupsContacts (
    contact_info_id INT PRIMARY KEY,
    group_id INT,
    gc_contact_name VARCHAR(100),
    gc_contact_type VARCHAR(50),
    gc_contact_value VARCHAR(100),
    gc_is_primary BOOLEAN,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id)
);

-- Tabla groupJoinRequests
CREATE TABLE groupJoinRequests (
    request_id INT PRIMARY KEY,
    gjr_group_id INT,
    gjr_user_id INT,
    gjr_request_status_id INT,
    gjr_created_at DATE,
    gjr_updated_at DATE,
    FOREIGN KEY (gjr_group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (gjr_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (gjr_request_status_id) REFERENCES groupMemberStatus(group_member_status_id)
);

-- Tabla activityTypes
CREATE TABLE activityTypes (
    activity_type_id INT PRIMARY KEY,
    at_activity_type_name VARCHAR(100),
    at_description TEXT
);

-- Tabla activityStatus
CREATE TABLE activityStatus (
    activity_status_id INT PRIMARY KEY,
    as_activity_status_name VARCHAR(100)
);

-- Tabla groupActivities
CREATE TABLE groupActivities (
    activity_id INT PRIMARY KEY,
    ga_activity_name VARCHAR(100),
    ga_activity_description TEXT,
    ga_max_participants INT,
    ga_activity_type INT,
    ga_activity_status INT,
    ga_group_id INT,
    ga_creator_id INT,
    FOREIGN KEY (ga_activity_type) REFERENCES activityTypes(activity_type_id),
    FOREIGN KEY (ga_activity_status) REFERENCES activityStatus(activity_status_id),
    FOREIGN KEY (ga_group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (ga_creator_id) REFERENCES Users(user_id)
);

-- Tabla activitiesSchedule
CREATE TABLE activitiesSchedule (
    schedule_id INT PRIMARY KEY,
    as_activity_id INT,
    as_activity_start_date DATE,
    as_activity_end_date DATE,
    as_activity_location VARCHAR(255),
    FOREIGN KEY (as_activity_id) REFERENCES groupActivities(activity_id)
);

-- Tabla activityParticipants
CREATE TABLE activityParticipants (
    participant_id INT PRIMARY KEY,
    ap_user_id INT,
    ap_activity_id INT,
    ap_registration_date DATE,
    ap_attendance_date DATE,
    FOREIGN KEY (ap_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (ap_activity_id) REFERENCES groupActivities(activity_id)
);

-- Tabla de tipos de documento
CREATE TABLE documentTypes (
    document_type_id INT PRIMARY KEY,
    dt_type_name VARCHAR(50),        -- Ej: "Cédula", "Pasaporte"
    dt_description TEXT
);

-- Tabla de tipos de género
CREATE TABLE genderTypes (
    gender_id INT PRIMARY KEY,
    g_gender_name VARCHAR(50),       -- Ej: "Masculino", "Femenino", "No binario"
    g_description TEXT
);

--------------ALTERS------------------
ALTER TABLE Users
ADD COLUMN u_birth_date DATE,
ADD COLUMN u_document_number VARCHAR(50),
ADD COLUMN u_document_type_id INT,
ADD COLUMN u_gender_id INT,
ADD FOREIGN KEY (u_document_type_id) REFERENCES documentTypes(document_type_id),
ADD FOREIGN KEY (u_gender_id) REFERENCES genderTypes(gender_id);
