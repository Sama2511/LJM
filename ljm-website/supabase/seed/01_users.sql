-- =============================================
-- SEED DATA: Users Table
-- =============================================
-- NOTE: These users reference auth.users, so you need to create auth users first
-- or use existing auth user IDs from your Supabase project.
--
-- OPTION 1: If you want to use existing auth users, replace the UUIDs below
-- with real auth.users IDs from your project.
--
-- OPTION 2: Run this in Supabase SQL Editor to create test users directly
-- (This bypasses auth.users requirement for testing purposes)

-- First, let's insert mock users with various roles
-- Replace these UUIDs with real auth.users IDs if needed

INSERT INTO public.users (id, firstname, lastname, email, role, formcompleted, avatar_url, created_at)
VALUES
  -- Admins (3)
  ('a0000000-0000-0000-0000-000000000001', 'Admin', 'Smith', 'admin1@ljm.org', 'admin', true, null, NOW() - INTERVAL '180 days'),
  ('a0000000-0000-0000-0000-000000000002', 'Sarah', 'Johnson', 'admin2@ljm.org', 'admin', true, null, NOW() - INTERVAL '150 days'),
  ('a0000000-0000-0000-0000-000000000003', 'Michael', 'Brown', 'admin3@ljm.org', 'admin', true, null, NOW() - INTERVAL '120 days'),

  -- Fire-keepers (5)
  ('b0000000-0000-0000-0000-000000000001', 'Emma', 'Wilson', 'emma.wilson@email.com', 'Fire-keepers', true, null, NOW() - INTERVAL '200 days'),
  ('b0000000-0000-0000-0000-000000000002', 'James', 'Taylor', 'james.taylor@email.com', 'Fire-keepers', true, null, NOW() - INTERVAL '190 days'),
  ('b0000000-0000-0000-0000-000000000003', 'Olivia', 'Anderson', 'olivia.anderson@email.com', 'Fire-keepers', true, null, NOW() - INTERVAL '185 days'),
  ('b0000000-0000-0000-0000-000000000004', 'William', 'Thomas', 'william.thomas@email.com', 'Fire-keepers', true, null, NOW() - INTERVAL '175 days'),
  ('b0000000-0000-0000-0000-000000000005', 'Sophia', 'Jackson', 'sophia.jackson@email.com', 'Fire-keepers', true, null, NOW() - INTERVAL '170 days'),

  -- Flame (10)
  ('c0000000-0000-0000-0000-000000000001', 'Liam', 'White', 'liam.white@email.com', 'Flame', true, null, NOW() - INTERVAL '160 days'),
  ('c0000000-0000-0000-0000-000000000002', 'Ava', 'Harris', 'ava.harris@email.com', 'Flame', true, null, NOW() - INTERVAL '155 days'),
  ('c0000000-0000-0000-0000-000000000003', 'Noah', 'Martin', 'noah.martin@email.com', 'Flame', true, null, NOW() - INTERVAL '150 days'),
  ('c0000000-0000-0000-0000-000000000004', 'Isabella', 'Garcia', 'isabella.garcia@email.com', 'Flame', true, null, NOW() - INTERVAL '145 days'),
  ('c0000000-0000-0000-0000-000000000005', 'Ethan', 'Martinez', 'ethan.martinez@email.com', 'Flame', true, null, NOW() - INTERVAL '140 days'),
  ('c0000000-0000-0000-0000-000000000006', 'Mia', 'Robinson', 'mia.robinson@email.com', 'Flame', true, null, NOW() - INTERVAL '135 days'),
  ('c0000000-0000-0000-0000-000000000007', 'Lucas', 'Clark', 'lucas.clark@email.com', 'Flame', true, null, NOW() - INTERVAL '130 days'),
  ('c0000000-0000-0000-0000-000000000008', 'Charlotte', 'Rodriguez', 'charlotte.rodriguez@email.com', 'Flame', true, null, NOW() - INTERVAL '125 days'),
  ('c0000000-0000-0000-0000-000000000009', 'Mason', 'Lewis', 'mason.lewis@email.com', 'Flame', true, null, NOW() - INTERVAL '120 days'),
  ('c0000000-0000-0000-0000-000000000010', 'Amelia', 'Lee', 'amelia.lee@email.com', 'Flame', true, null, NOW() - INTERVAL '115 days'),

  -- Kindling (15)
  ('d0000000-0000-0000-0000-000000000001', 'Benjamin', 'Walker', 'benjamin.walker@email.com', 'Kindling', true, null, NOW() - INTERVAL '100 days'),
  ('d0000000-0000-0000-0000-000000000002', 'Harper', 'Hall', 'harper.hall@email.com', 'Kindling', true, null, NOW() - INTERVAL '95 days'),
  ('d0000000-0000-0000-0000-000000000003', 'Elijah', 'Allen', 'elijah.allen@email.com', 'Kindling', true, null, NOW() - INTERVAL '90 days'),
  ('d0000000-0000-0000-0000-000000000004', 'Evelyn', 'Young', 'evelyn.young@email.com', 'Kindling', true, null, NOW() - INTERVAL '85 days'),
  ('d0000000-0000-0000-0000-000000000005', 'Alexander', 'King', 'alexander.king@email.com', 'Kindling', true, null, NOW() - INTERVAL '80 days'),
  ('d0000000-0000-0000-0000-000000000006', 'Abigail', 'Wright', 'abigail.wright@email.com', 'Kindling', true, null, NOW() - INTERVAL '75 days'),
  ('d0000000-0000-0000-0000-000000000007', 'Daniel', 'Scott', 'daniel.scott@email.com', 'Kindling', true, null, NOW() - INTERVAL '70 days'),
  ('d0000000-0000-0000-0000-000000000008', 'Emily', 'Green', 'emily.green@email.com', 'Kindling', true, null, NOW() - INTERVAL '65 days'),
  ('d0000000-0000-0000-0000-000000000009', 'Henry', 'Baker', 'henry.baker@email.com', 'Kindling', true, null, NOW() - INTERVAL '60 days'),
  ('d0000000-0000-0000-0000-000000000010', 'Elizabeth', 'Adams', 'elizabeth.adams@email.com', 'Kindling', true, null, NOW() - INTERVAL '55 days'),
  ('d0000000-0000-0000-0000-000000000011', 'Sebastian', 'Nelson', 'sebastian.nelson@email.com', 'Kindling', true, null, NOW() - INTERVAL '50 days'),
  ('d0000000-0000-0000-0000-000000000012', 'Sofia', 'Hill', 'sofia.hill@email.com', 'Kindling', true, null, NOW() - INTERVAL '45 days'),
  ('d0000000-0000-0000-0000-000000000013', 'Jack', 'Ramirez', 'jack.ramirez@email.com', 'Kindling', true, null, NOW() - INTERVAL '40 days'),
  ('d0000000-0000-0000-0000-000000000014', 'Aria', 'Campbell', 'aria.campbell@email.com', 'Kindling', true, null, NOW() - INTERVAL '35 days'),
  ('d0000000-0000-0000-0000-000000000015', 'Owen', 'Mitchell', 'owen.mitchell@email.com', 'Kindling', true, null, NOW() - INTERVAL '30 days'),

  -- Kindler - New users, form not completed (20)
  ('e0000000-0000-0000-0000-000000000001', 'Aiden', 'Roberts', 'aiden.roberts@email.com', 'Kindler', false, null, NOW() - INTERVAL '25 days'),
  ('e0000000-0000-0000-0000-000000000002', 'Scarlett', 'Carter', 'scarlett.carter@email.com', 'Kindler', false, null, NOW() - INTERVAL '24 days'),
  ('e0000000-0000-0000-0000-000000000003', 'Matthew', 'Phillips', 'matthew.phillips@email.com', 'Kindler', false, null, NOW() - INTERVAL '23 days'),
  ('e0000000-0000-0000-0000-000000000004', 'Luna', 'Evans', 'luna.evans@email.com', 'Kindler', false, null, NOW() - INTERVAL '22 days'),
  ('e0000000-0000-0000-0000-000000000005', 'Jackson', 'Turner', 'jackson.turner@email.com', 'Kindler', false, null, NOW() - INTERVAL '21 days'),
  ('e0000000-0000-0000-0000-000000000006', 'Chloe', 'Torres', 'chloe.torres@email.com', 'Kindler', false, null, NOW() - INTERVAL '20 days'),
  ('e0000000-0000-0000-0000-000000000007', 'Samuel', 'Parker', 'samuel.parker@email.com', 'Kindler', false, null, NOW() - INTERVAL '19 days'),
  ('e0000000-0000-0000-0000-000000000008', 'Penelope', 'Collins', 'penelope.collins@email.com', 'Kindler', false, null, NOW() - INTERVAL '18 days'),
  ('e0000000-0000-0000-0000-000000000009', 'David', 'Edwards', 'david.edwards@email.com', 'Kindler', false, null, NOW() - INTERVAL '17 days'),
  ('e0000000-0000-0000-0000-000000000010', 'Layla', 'Stewart', 'layla.stewart@email.com', 'Kindler', false, null, NOW() - INTERVAL '16 days'),
  ('e0000000-0000-0000-0000-000000000011', 'Joseph', 'Sanchez', 'joseph.sanchez@email.com', 'Kindler', true, null, NOW() - INTERVAL '15 days'),
  ('e0000000-0000-0000-0000-000000000012', 'Riley', 'Morris', 'riley.morris@email.com', 'Kindler', true, null, NOW() - INTERVAL '14 days'),
  ('e0000000-0000-0000-0000-000000000013', 'Carter', 'Rogers', 'carter.rogers@email.com', 'Kindler', true, null, NOW() - INTERVAL '13 days'),
  ('e0000000-0000-0000-0000-000000000014', 'Zoey', 'Reed', 'zoey.reed@email.com', 'Kindler', true, null, NOW() - INTERVAL '12 days'),
  ('e0000000-0000-0000-0000-000000000015', 'Wyatt', 'Cook', 'wyatt.cook@email.com', 'Kindler', true, null, NOW() - INTERVAL '11 days'),
  ('e0000000-0000-0000-0000-000000000016', 'Nora', 'Morgan', 'nora.morgan@email.com', 'Kindler', true, null, NOW() - INTERVAL '10 days'),
  ('e0000000-0000-0000-0000-000000000017', 'Gabriel', 'Bell', 'gabriel.bell@email.com', 'Kindler', true, null, NOW() - INTERVAL '9 days'),
  ('e0000000-0000-0000-0000-000000000018', 'Lily', 'Murphy', 'lily.murphy@email.com', 'Kindler', true, null, NOW() - INTERVAL '8 days'),
  ('e0000000-0000-0000-0000-000000000019', 'Julian', 'Bailey', 'julian.bailey@email.com', 'Kindler', true, null, NOW() - INTERVAL '7 days'),
  ('e0000000-0000-0000-0000-000000000020', 'Eleanor', 'Rivera', 'eleanor.rivera@email.com', 'Kindler', true, null, NOW() - INTERVAL '6 days')

ON CONFLICT (id) DO NOTHING;

-- Total: 53 users
-- 3 admins, 5 Fire-keepers, 10 Flame, 15 Kindling, 20 Kindler
