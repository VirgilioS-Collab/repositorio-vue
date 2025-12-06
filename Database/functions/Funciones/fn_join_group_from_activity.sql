-- Crea/actualiza la función para que un usuario se una directamente a un grupo
-- Basada en la lógica de inscripción a actividad, adaptada a miembros de grupo
DROP FUNCTION IF EXISTS public.fn_join_group_direct(integer, integer);
CREATE FUNCTION public.fn_join_group_direct(
  p_user_id INTEGER,
  p_group_id INTEGER
)
RETURNS TABLE(success BOOLEAN, message TEXT, data JSON) AS $$
DECLARE
  v_group_exists BOOLEAN;
  v_owner BOOLEAN;
  v_already_member BOOLEAN;
  v_approved_status_id INTEGER;
  v_member_role_id INTEGER;
  result_data JSON;
BEGIN
  -- Validar que el grupo existe
  SELECT EXISTS(SELECT 1 FROM public.groups WHERE group_id = p_group_id) INTO v_group_exists;
  IF NOT v_group_exists THEN
    RETURN QUERY SELECT FALSE, 'El grupo no existe.', '{}'::json;
    RETURN;
  END IF;

  -- Verificar si el usuario es el dueño del grupo
  SELECT EXISTS(SELECT 1 FROM public.groups WHERE group_id = p_group_id AND g_group_owner_id = p_user_id) INTO v_owner;
  IF v_owner THEN
    RETURN QUERY SELECT FALSE, 'El usuario es el dueño del grupo.', '{}'::json;
    RETURN;
  END IF;

  -- Verificar si ya es miembro aprobado
  SELECT EXISTS(
    SELECT 1 FROM public.groupmembers gm
    WHERE gm.user_id = p_user_id
      AND gm.group_id = p_group_id
  ) INTO v_already_member;

  IF v_already_member THEN
    RETURN QUERY SELECT FALSE, 'Ya eres miembro del grupo.', '{}'::json;
    RETURN;
  END IF;

  INSERT INTO public.groupmembers(user_id, group_id, gm_signup_date, gm_role_id, gm_status_id, gm_approved_by, gm_updated_at)
  VALUES (p_user_id, p_group_id, CURRENT_TIMESTAMP, 1, 2, p_user_id, CURRENT_TIMESTAMP);

  -- Eliminar cualquier solicitud previa (pendiente o rechazada) para este usuario y grupo
  DELETE FROM public.groupjoinrequests
  WHERE gjr_user_id = p_user_id
    AND gjr_group_id = p_group_id;

  -- Generar notificación
  PERFORM fn_sys_generate_notifications(
    p_user_id,
    'Te has unido exitosamente al grupo.'
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

  RETURN QUERY SELECT TRUE, 'Te has unido al grupo correctamente.', result_data;
  RETURN;

EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, 'Ocurrió un error al unirte al grupo: ' || SQLERRM, '{}'::json;
    RETURN;
END;
$$ LANGUAGE plpgsql;
