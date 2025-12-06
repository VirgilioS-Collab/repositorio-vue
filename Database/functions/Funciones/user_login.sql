
CREATE FUNCTION public.user_login(
	p_username character varying,
	p_email character varying)
    RETURNS TABLE(user_id integer, username character varying, email character varying, name character varying, last_name character varying, profile_photo_url text, user_type character varying, user_status character varying, en_password TEXT, message text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
	BEGIN
		RETURN QUERY
	    SELECT 
	        u.user_id,
	        u.username,
	        u.email,
	        u.name,
	        u.last_name,
	        u.profile_photo_url,
	        ut.type_name AS user_type,
	        us.status_name AS user_status,
	        u.password AS en_password,
	        CASE 
	            WHEN u.user_id IS NULL THEN 'Usuario no encontrado'
				WHEN u.email IS NULL THEN 'email incorrecto'
	            ELSE NULL
	        END AS message
	    FROM 
	        Users u
	        JOIN userTypes ut ON u.user_type_id = ut.type_id
	        JOIN userStatus us ON u.user_status_id = us.user_status_id
    WHERE 
        (p_username IS NOT NULL AND u.username = p_username)  -- Login por username
        OR 
        (p_email IS NOT NULL AND u.email = p_email)           -- Login por email
      	--Evitar que ambos sean NULL
        AND NOT (p_username IS NULL AND p_email IS NULL);
	END;
	
$BODY$;

ALTER FUNCTION public.user_login(character varying, character varying)
    OWNER TO postgres;
