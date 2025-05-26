
-- DROP FUNCTION IF EXISTS public.vw_group_members(integer);

CREATE OR REPLACE FUNCTION public.vw_group_members(
	vw_group_id integer)
    RETURNS TABLE(full_name text, status character varying, role character varying, last_seen timestamp without time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
	BEGIN
	RETURN QUERY 
			SELECT
				u.Name ||' '||u.last_name AS full_name,
				gms.status_name AS status,
				mr.role_name AS role,
				u.last_login_date AS last_seen
			FROM
				public.group_members gm
					INNER JOIN public.users u ON u.user_id = gm.user_id
					INNER JOIN public.group_member_status gms ON gms.group_member_status_id = gm.status_id
					INNER JOIN public.member_roles mr ON mr.role_id = gm.role_id
			WHERE
				gm.group_id IN (vw_group_id);
	END;
$BODY$;

ALTER FUNCTION public.vw_group_members(integer)