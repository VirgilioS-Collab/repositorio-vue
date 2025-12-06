-- Función para que un usuario se una directamente a un grupo sin solicitud de aprobación
-- Inserta el usuario en la tabla groupmembers sin validación de estado
DROP FUNCTION IF EXISTS public.fn_join_group_direct(integer, integer);
CREATE FUNCTION public.fn_join_group_direct(
    p_user_id INTEGER,
    p_group_id INTEGER
)
RETURNS TABLE(success BOOLEAN, message TEXT, data JSON) AS $$
DECLARE
    v_user_exists BOOLEAN;
    v_group_exists BOOLEAN;
    v_already_member BOOLEAN;
    v_member_role_id INTEGER;
    result_data JSON;
BEGIN
    -- Validar que el usuario existe
    SELECT EXISTS(SELECT 1 FROM public.users WHERE user_id = p_user_id) INTO v_user_exists;
    IF NOT v_user_exists THEN
        RETURN QUERY SELECT FALSE, 'El usuario no existe'::TEXT, '{}'::JSON;
        RETURN;
    END IF;

    -- Validar que el grupo existe
    SELECT EXISTS(SELECT 1 FROM public.groups WHERE group_id = p_group_id) INTO v_group_exists;
    IF NOT v_group_exists THEN
        RETURN QUERY SELECT FALSE, 'El grupo no existe'::TEXT, '{}'::JSON;
        RETURN;
    END IF;

    -- Validar que el usuario no es ya miembro del grupo (evitar duplicados)
    SELECT EXISTS(SELECT 1 FROM public.groupmembers WHERE user_id = p_user_id AND group_id = p_group_id) INTO v_already_member;
    IF v_already_member THEN
        RETURN QUERY SELECT FALSE, 'El usuario ya es miembro del grupo'::TEXT, '{}'::JSON;
        RETURN;
    END IF;

    -- Obtener el ID del rol "Miembro" de memberroles (en ESPAÑOL)
    SELECT role_id INTO v_member_role_id 
    FROM public.memberroles 
    WHERE mr_role_name ILIKE 'Miembro' 
    LIMIT 1;
    IF v_member_role_id IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Rol de miembro no encontrado en la base de datos'::TEXT, '{}'::JSON;
        RETURN;
    END IF;

    -- Insertar el usuario como miembro del grupo SIN validar estado
    INSERT INTO public.groupmembers (
        user_id, 
        group_id, 
        gm_signup_date, 
        gm_role_id, 
        gm_status_id, 
        gm_approved_by,
        gm_updated_at
    ) VALUES (
        p_user_id,
        p_group_id,
        CURRENT_TIMESTAMP,
        v_member_role_id,
        1,  -- Estado "Pendiente" por defecto (sin validar)
        p_user_id,
        CURRENT_TIMESTAMP
    );

    -- Armar JSON de respuesta con datos útiles
    SELECT json_build_object(
        'group_id', g.group_id,
        'group_name', g.g_group_name,
        'owner_id', g.g_group_owner_id
    ) INTO result_data
    FROM public.groups g
    WHERE g.group_id = p_group_id
    LIMIT 1;

    RETURN QUERY SELECT TRUE, 'Usuario unido al grupo exitosamente'::TEXT, result_data;
    RETURN;

EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, ('Error al insertar miembro: ' || SQLERRM)::TEXT, '{}'::JSON;
    RETURN;
END;
$$ LANGUAGE plpgsql;
