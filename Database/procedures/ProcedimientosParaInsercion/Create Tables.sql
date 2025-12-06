-- Tabla de estado de miembros del grupo (debe crearse primero)
CREATE TABLE public.groupmemberstatus (
  group_member_status_id serial PRIMARY KEY,
  gms_status_name character varying,
  gms_description text
);

-- Tabla de tipos de usuarios
CREATE TABLE public.usertypes (
  type_id serial PRIMARY KEY,
  ut_type_name character varying,
  ut_description text
);

-- Tabla de estados de usuario
CREATE TABLE public.userstatus (
  user_status_id serial PRIMARY KEY,
  us_status_name character varying,
  us_description text
);

-- Tabla de tipos de documentos
CREATE TABLE public.documenttypes (
  document_type_id serial PRIMARY KEY,
  dt_type_name character varying,
  dt_description text
);

-- Tabla de géneros
CREATE TABLE public.gendertypes (
  gender_id serial PRIMARY KEY,
  g_gender_name character varying,
  g_description text
);

-- Tabla de usuarios
CREATE TABLE public.users (
  user_id serial PRIMARY KEY,
  u_name character varying,
  u_last_name character varying,
  u_username character varying UNIQUE,
  u_email character varying UNIQUE,
  u_phone character varying,
  u_about_me text,
  u_password text,
  u_last_password_update timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  u_profile_photo_url character varying,
  u_user_type_id integer NOT NULL,
  u_user_status_id integer NOT NULL,
  u_creation_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  u_last_login_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  u_birth_date date,
  u_document_number character varying,
  u_document_type_id integer,
  u_gender_id integer,
  user_uuid uuid DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT users_u_gender_id_fkey FOREIGN KEY (u_gender_id) REFERENCES public.gendertypes(gender_id),
  CONSTRAINT users_u_user_type_id_fkey FOREIGN KEY (u_user_type_id) REFERENCES public.usertypes(type_id),
  CONSTRAINT users_u_user_status_id_fkey FOREIGN KEY (u_user_status_id) REFERENCES public.userstatus(user_status_id),
  CONSTRAINT users_u_document_type_id_fkey FOREIGN KEY (u_document_type_id) REFERENCES public.documenttypes(document_type_id)
);

-- Tabla de categorías de grupo
CREATE TABLE public.groupcategories (
  group_category_id serial PRIMARY KEY,
  gc_category_name character varying,
  gc_description text
);

-- Tabla de estados de grupo
CREATE TABLE public.groupstatus (
  group_status_id serial PRIMARY KEY,
  gs_status_name character varying,
  gs_description text
);

-- Tabla de roles de miembros
CREATE TABLE public.memberroles (
  role_id serial PRIMARY KEY,
  mr_role_name character varying,
  mr_description text
);

-- Tabla de grupos
CREATE TABLE public.groups (
  group_id serial PRIMARY KEY,
  g_group_name character varying,
  g_group_description text,
  g_group_status_id integer NOT NULL,
  g_group_owner_id integer NOT NULL,
  g_group_category_id integer NOT NULL,
  group_uuid uuid DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT groups_g_group_category_id_fkey FOREIGN KEY (g_group_category_id) REFERENCES public.groupcategories(group_category_id),
  CONSTRAINT groups_g_group_owner_id_fkey FOREIGN KEY (g_group_owner_id) REFERENCES public.users(user_id),
  CONSTRAINT groups_g_group_status_id_fkey FOREIGN KEY (g_group_status_id) REFERENCES public.groupstatus(group_status_id)
);

-- Tabla de contactos de grupo
CREATE TABLE public.groupscontacts (
  contact_info_id serial PRIMARY KEY,
  group_id integer NOT NULL,
  gc_contact_name character varying,
  gc_contact_type character varying,
  gc_contact_value character varying,
  gc_is_primary boolean,
  CONSTRAINT groupscontacts_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id)
);

-- Tabla de tipos de actividad
CREATE TABLE public.activitytypes (
  activity_type_id serial PRIMARY KEY,
  at_activity_type_name character varying,
  at_description text
);

-- Tabla de estados de actividad
CREATE TABLE public.activitystatus (
  activity_status_id serial PRIMARY KEY,
  as_activity_status_name character varying
);

-- Tabla de actividades de grupo
CREATE TABLE public.groupactivities (
  activity_id serial PRIMARY KEY,
  ga_activity_name character varying,
  ga_activity_description text,
  ga_max_participants integer,
  ga_activity_type integer NOT NULL,
  ga_activity_status integer NOT NULL,
  ga_group_id integer NOT NULL,
  ga_creator_id integer NOT NULL,
  activity_uuid uuid DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT groupactivities_ga_activity_type_fkey FOREIGN KEY (ga_activity_type) REFERENCES public.activitytypes(activity_type_id),
  CONSTRAINT groupactivities_ga_activity_status_fkey FOREIGN KEY (ga_activity_status) REFERENCES public.activitystatus(activity_status_id),
  CONSTRAINT groupactivities_ga_group_id_fkey FOREIGN KEY (ga_group_id) REFERENCES public.groups(group_id),
  CONSTRAINT groupactivities_ga_creator_id_fkey FOREIGN KEY (ga_creator_id) REFERENCES public.users(user_id)
);

-- Tabla de solicitud de unión a grupos
CREATE TABLE public.groupjoinrequests (
  request_id serial PRIMARY KEY,
  gjr_group_id integer NOT NULL,
  gjr_user_id integer NOT NULL,
  gjr_request_status_id integer NOT NULL,
  gjr_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  gjr_updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  request_uuid uuid DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT groupjoinrequests_gjr_request_status_id_fkey FOREIGN KEY (gjr_request_status_id) REFERENCES public.groupmemberstatus(group_member_status_id),
  CONSTRAINT groupjoinrequests_gjr_user_id_fkey FOREIGN KEY (gjr_user_id) REFERENCES public.users(user_id),
  CONSTRAINT groupjoinrequests_gjr_group_id_fkey FOREIGN KEY (gjr_group_id) REFERENCES public.groups(group_id)
);

-- Tabla de miembros de grupo
CREATE TABLE public.groupmembers (
  user_id integer NOT NULL,
  group_id integer NOT NULL,
  gm_signup_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  gm_role_id integer NOT NULL,
  gm_status_id integer NOT NULL,
  gm_approved_by integer NOT NULL,
  gm_updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT groupmembers_pkey PRIMARY KEY (user_id, group_id),
  CONSTRAINT groupmembers_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id),
  CONSTRAINT groupmembers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT groupmembers_gm_role_id_fkey FOREIGN KEY (gm_role_id) REFERENCES public.memberroles(role_id),
  CONSTRAINT groupmembers_gm_status_id_fkey FOREIGN KEY (gm_status_id) REFERENCES public.groupmemberstatus(group_member_status_id),
  CONSTRAINT groupmembers_gm_approved_by_fkey FOREIGN KEY (gm_approved_by) REFERENCES public.users(user_id)
);

-- Tabla de participantes de actividad
CREATE TABLE public.activityparticipants (
  participant_id serial PRIMARY KEY,
  ap_user_id integer NOT NULL,
  ap_activity_id integer NOT NULL,
  ap_registration_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ap_attendance_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  participant_uuid uuid DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT activityparticipants_ap_activity_id_fkey FOREIGN KEY (ap_activity_id) REFERENCES public.groupactivities(activity_id),
  CONSTRAINT activityparticipants_ap_user_id_fkey FOREIGN KEY (ap_user_id) REFERENCES public.users(user_id)
);

-- Tabla de programación de actividades
CREATE TABLE public.activitiesschedule (
  schedule_id serial PRIMARY KEY,
  as_activity_id integer NOT NULL,
  as_activity_start_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  as_activity_end_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  as_activity_location character varying,
  CONSTRAINT activitiesschedule_as_activity_id_fkey FOREIGN KEY (as_activity_id) REFERENCES public.groupactivities(activity_id)
);
