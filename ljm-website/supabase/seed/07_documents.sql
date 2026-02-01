-- =============================================
-- SEED DATA: Documents Table
-- =============================================
-- Organizational documents for download

INSERT INTO public.documents (id, title, file_url, created_at)
VALUES
  ('70000000-0000-0000-0000-000000000001', 'Volunteer Handbook 2024', 'documents/volunteer-handbook-2024.pdf', NOW() - INTERVAL '90 days'),
  ('70000000-0000-0000-0000-000000000002', 'Annual Report 2023', 'documents/annual-report-2023.pdf', NOW() - INTERVAL '85 days'),
  ('70000000-0000-0000-0000-000000000003', 'Code of Conduct', 'documents/code-of-conduct.pdf', NOW() - INTERVAL '80 days'),
  ('70000000-0000-0000-0000-000000000004', 'Child Safety Policy', 'documents/child-safety-policy.pdf', NOW() - INTERVAL '75 days'),
  ('70000000-0000-0000-0000-000000000005', 'Privacy Policy', 'documents/privacy-policy.pdf', NOW() - INTERVAL '70 days'),
  ('70000000-0000-0000-0000-000000000006', 'Emergency Procedures Guide', 'documents/emergency-procedures.pdf', NOW() - INTERVAL '65 days'),
  ('70000000-0000-0000-0000-000000000007', 'Volunteer Training Manual', 'documents/training-manual.pdf', NOW() - INTERVAL '60 days'),
  ('70000000-0000-0000-0000-000000000008', 'Strategic Plan 2024-2027', 'documents/strategic-plan-2024-2027.pdf', NOW() - INTERVAL '55 days'),
  ('70000000-0000-0000-0000-000000000009', 'Community Impact Report', 'documents/community-impact-report.pdf', NOW() - INTERVAL '50 days'),
  ('70000000-0000-0000-0000-000000000010', 'Financial Statements 2023', 'documents/financial-statements-2023.pdf', NOW() - INTERVAL '45 days'),
  ('70000000-0000-0000-0000-000000000011', 'Workplace Health and Safety Policy', 'documents/whs-policy.pdf', NOW() - INTERVAL '40 days'),
  ('70000000-0000-0000-0000-000000000012', 'Complaints Handling Procedure', 'documents/complaints-procedure.pdf', NOW() - INTERVAL '35 days')

ON CONFLICT (id) DO NOTHING;

-- Total: 12 documents
