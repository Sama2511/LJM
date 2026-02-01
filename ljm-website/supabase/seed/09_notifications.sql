-- =============================================
-- SEED DATA: Notifications Table
-- =============================================
-- System and user notifications

INSERT INTO public.notifications (id, type, title, message, reference_type, reference_id, user_id, created_at)
VALUES
  -- Global notifications (user_id is NULL - visible to all)
  ('90000000-0000-0000-0000-000000000001', 'event_created', 'New Event Available', 'River Cleanup Day is now open for volunteers', 'event', '30000000-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '3 days'),
  ('90000000-0000-0000-0000-000000000002', 'event_created', 'New Event Available', 'Community Health Fair is now open for volunteers', 'event', '30000000-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '5 days'),
  ('90000000-0000-0000-0000-000000000003', 'event_created', 'New Event Available', 'Youth Sports Day is now open for volunteers', 'event', '30000000-0000-0000-0000-000000000003', NULL, NOW() - INTERVAL '7 days'),
  ('90000000-0000-0000-0000-000000000004', 'announcement', 'Welcome to Kindlewood!', 'Thank you for joining our community. Check out our upcoming events!', NULL, NULL, NULL, NOW() - INTERVAL '30 days'),

  -- User-specific notifications (Application approvals)
  ('90000000-0000-0000-0000-000000000005', 'application_approved', 'Crew Application Approved', 'Congratulations! Your crew application has been approved. Welcome to the team!', 'application', 'f0000000-0000-0000-0000-000000000016', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '99 days'),
  ('90000000-0000-0000-0000-000000000006', 'application_approved', 'Crew Application Approved', 'Congratulations! Your crew application has been approved. Welcome to the team!', 'application', 'f0000000-0000-0000-0000-000000000017', 'd0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '94 days'),
  ('90000000-0000-0000-0000-000000000007', 'application_approved', 'Crew Application Approved', 'Congratulations! Your crew application has been approved. Welcome to the team!', 'application', 'f0000000-0000-0000-0000-000000000018', 'd0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '89 days'),

  -- Event update notifications
  ('90000000-0000-0000-0000-000000000008', 'event_updated', 'Event Updated', 'Beach Cleanup Drive has been updated. Please check the new details.', 'event', '10000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '92 days'),
  ('90000000-0000-0000-0000-000000000009', 'event_updated', 'Event Updated', 'Beach Cleanup Drive has been updated. Please check the new details.', 'event', '10000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '92 days'),

  -- Recent notifications
  ('90000000-0000-0000-0000-000000000010', 'event_created', 'New Event Available', 'Charity Gala Support is now open for volunteers', 'event', '30000000-0000-0000-0000-000000000006', NULL, NOW() - INTERVAL '8 days'),
  ('90000000-0000-0000-0000-000000000011', 'event_created', 'New Event Available', 'Habitat for Humanity Build is now open for volunteers', 'event', '30000000-0000-0000-0000-000000000011', NULL, NOW()),
  ('90000000-0000-0000-0000-000000000012', 'event_created', 'New Event Available', 'Mental Health Awareness Walk is now open for volunteers', 'event', '30000000-0000-0000-0000-000000000012', NULL, NOW()),

  -- More user-specific notifications
  ('90000000-0000-0000-0000-000000000013', 'reminder', 'Event Reminder', 'River Cleanup Day is in 3 days. Don''t forget!', 'event', '30000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
  ('90000000-0000-0000-0000-000000000014', 'reminder', 'Event Reminder', 'River Cleanup Day is in 3 days. Don''t forget!', 'event', '30000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day'),
  ('90000000-0000-0000-0000-000000000015', 'thank_you', 'Thank You!', 'Thank you for volunteering at Street Clean-up Campaign. Your contribution makes a difference!', 'event', '20000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', NOW())

ON CONFLICT (id) DO NOTHING;

-- Total: 15 notifications
