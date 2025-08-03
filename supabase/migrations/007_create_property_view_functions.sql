-- Migration: Create property view tracking functions
-- Created: 2024-01-25

-- Function to increment property views
CREATE OR REPLACE FUNCTION public.increment_property_views(property_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a view record
  INSERT INTO public.property_views (property_id, viewed_at)
  VALUES (property_id, now());
  
  -- Update the view count in the properties table
  UPDATE public.properties 
  SET view_count = view_count + 1, updated_at = now()
  WHERE id = property_id;
END;
$$;

-- Function to get property view count
CREATE OR REPLACE FUNCTION public.get_property_view_count(property_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  view_count integer;
BEGIN
  SELECT COUNT(*) INTO view_count
  FROM public.property_views
  WHERE property_views.property_id = get_property_view_count.property_id;
  
  RETURN COALESCE(view_count, 0);
END;
$$;

-- Function to sync view counts (utility function)
CREATE OR REPLACE FUNCTION public.sync_property_view_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.properties 
  SET view_count = (
    SELECT COUNT(*)
    FROM public.property_views
    WHERE property_views.property_id = properties.id
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.increment_property_views(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_property_view_count(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_property_view_counts() TO authenticated;

-- Add comments
COMMENT ON FUNCTION public.increment_property_views(uuid) IS 'Increments property view count and records view event';
COMMENT ON FUNCTION public.get_property_view_count(uuid) IS 'Returns the total view count for a property';
COMMENT ON FUNCTION public.sync_property_view_counts() IS 'Syncs view counts from property_views to properties table'; 