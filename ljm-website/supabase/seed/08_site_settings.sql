-- =============================================
-- SEED DATA: Site Settings Table
-- =============================================
-- Configuration settings for the website

INSERT INTO public.site_settings (id, setting_key, setting_value, updated_at)
VALUES
  ('80000000-0000-0000-0000-000000000001', 'site_name', 'Kindlewood Community', NOW() - INTERVAL '100 days'),
  ('80000000-0000-0000-0000-000000000002', 'contact_email', 'info@kindlewood.org.au', NOW() - INTERVAL '100 days'),
  ('80000000-0000-0000-0000-000000000003', 'contact_phone', '(02) 9876 5432', NOW() - INTERVAL '100 days'),
  ('80000000-0000-0000-0000-000000000004', 'address', '123 Community Lane, Kindlewood NSW 2000', NOW() - INTERVAL '100 days'),
  ('80000000-0000-0000-0000-000000000005', 'facebook_url', 'https://facebook.com/kindlewood', NOW() - INTERVAL '90 days'),
  ('80000000-0000-0000-0000-000000000006', 'instagram_url', 'https://instagram.com/kindlewood', NOW() - INTERVAL '90 days'),
  ('80000000-0000-0000-0000-000000000007', 'twitter_url', 'https://twitter.com/kindlewood', NOW() - INTERVAL '90 days'),
  ('80000000-0000-0000-0000-000000000008', 'donation_url', 'https://give.kindlewood.org.au', NOW() - INTERVAL '80 days'),
  ('80000000-0000-0000-0000-000000000009', 'office_hours', 'Monday - Friday: 9am - 5pm', NOW() - INTERVAL '70 days'),
  ('80000000-0000-0000-0000-000000000010', 'tagline', 'Kindling Community Spirit', NOW() - INTERVAL '60 days')

ON CONFLICT (id) DO NOTHING;

-- Total: 10 settings
