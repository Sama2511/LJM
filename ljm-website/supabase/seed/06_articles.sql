-- =============================================
-- SEED DATA: Articles Table
-- =============================================
-- News articles and blog posts

INSERT INTO public.articles (id, title, content, image_url, created_at, updated_at)
VALUES
  ('60000000-0000-0000-0000-000000000001',
   'Kindlewood Celebrates 10 Years of Community Service',
   'This year marks a decade of Kindlewood''s commitment to making our community stronger. What started as a small group of passionate volunteers has grown into a movement of over 500 active members. Together, we have planted more than 5,000 trees, served over 50,000 meals to those in need, and organized hundreds of community events.

Our journey began in 2014 when a group of friends noticed the growing disconnect in urban communities. They envisioned a place where people could come together, share skills, and support each other. That vision became Kindlewood.

Looking ahead, we are excited to announce new programs focused on youth mentorship, environmental sustainability, and elderly care. We invite everyone to join us as we continue to kindle the flames of community spirit.

Thank you to all our volunteers, donors, and community partners who have made this journey possible. Here''s to the next decade of making a difference together!',
   'placeholderImage.png',
   NOW() - INTERVAL '30 days',
   NOW() - INTERVAL '30 days'),

  ('60000000-0000-0000-0000-000000000002',
   'New Environmental Initiative: Plant 1000 Trees This Year',
   'Kindlewood is launching an ambitious environmental initiative aimed at planting 1,000 native trees across our region by the end of the year. This project, in partnership with local councils and environmental groups, will focus on restoring biodiversity in urban areas.

The initiative will target three key areas: riverbank restoration, urban parkland enhancement, and school ground greening. Each tree planted will be GPS-tagged, allowing donors and volunteers to track their tree''s growth over time.

"Trees are the lungs of our cities," says our Environmental Coordinator Emma Wilson. "By planting native species, we''re not just adding green spaces – we''re creating habitats for wildlife and improving air quality for everyone."

Volunteer opportunities are available every Saturday morning throughout the planting season. No experience is necessary – just bring your enthusiasm and we''ll provide the training, tools, and morning tea!

Sign up through our events page to join this green revolution.',
   'placeholderImage.png',
   NOW() - INTERVAL '25 days',
   NOW() - INTERVAL '25 days'),

  ('60000000-0000-0000-0000-000000000003',
   'Volunteer Spotlight: Meet Sarah Johnson',
   'This month, we shine the spotlight on Sarah Johnson, a dedicated Fire-keeper who has been with Kindlewood for over five years. Sarah has volunteered at over 200 events and has become a beloved figure in our community kitchen program.

"I started volunteering after I retired," Sarah shares. "I was looking for a way to stay active and connected. What I found at Kindlewood was so much more – a second family."

Sarah specializes in our elderly companion program, visiting nursing homes weekly to spend time with residents. Her warm personality and genuine care have made a profound impact on many lonely seniors.

"The relationships I''ve built are incredibly rewarding. Sometimes, all people need is someone to listen to their stories. Everyone has stories worth hearing."

When not volunteering, Sarah tends to her garden and bakes for community events. Her famous lemon cake has become a fixture at our monthly gatherings.

If you''d like to join Sarah in making a difference, check out our volunteer opportunities today!',
   'placeholderImage.png',
   NOW() - INTERVAL '20 days',
   NOW() - INTERVAL '20 days'),

  ('60000000-0000-0000-0000-000000000004',
   'Community Kitchen Serves 10,000th Meal',
   'A major milestone was reached this week as our Community Kitchen served its 10,000th meal since opening three years ago. The achievement was celebrated with a special event featuring community members, volunteers, and local dignitaries.

The Community Kitchen operates every Tuesday and Thursday evening, providing nutritious meals to anyone in need – no questions asked. What started as serving 30 meals per night has grown to over 100, reflecting both the increasing need and our expanded capacity.

"Food insecurity is a hidden issue in many communities," explains Kitchen Coordinator Michael Chen. "Our goal is to provide not just food, but dignity and connection. Everyone who walks through our doors is treated as a guest."

The milestone meal was served by Mayor Linda Thompson, who praised Kindlewood''s contribution to addressing food insecurity in our region.

We are always looking for volunteers to help with meal preparation, serving, and cleanup. Kitchen experience is welcome but not required – we''ll train you!',
   'placeholderImage.png',
   NOW() - INTERVAL '15 days',
   NOW() - INTERVAL '15 days'),

  ('60000000-0000-0000-0000-000000000005',
   'Youth Mentoring Program Launches in Local Schools',
   'Kindlewood is proud to announce the launch of our new Youth Mentoring Program in partnership with five local high schools. The program will pair trained volunteer mentors with students who would benefit from additional support and guidance.

The program focuses on three key areas: career exploration, life skills development, and academic support. Mentors will meet with their students weekly during lunch breaks, providing a consistent, positive adult presence.

"Young people today face complex challenges," notes Youth Program Director Lisa Patel. "Having a supportive adult outside the family can make an enormous difference in a young person''s trajectory."

Mentor training will begin next month, covering topics such as active listening, boundary setting, and recognizing signs of distress. All mentors must complete our comprehensive background check process.

If you have a passion for helping young people succeed and can commit to weekly meetings during the school term, we encourage you to apply for our mentor training program.',
   'placeholderImage.png',
   NOW() - INTERVAL '12 days',
   NOW() - INTERVAL '12 days'),

  ('60000000-0000-0000-0000-000000000006',
   'Annual Charity Gala Raises Record Funds',
   'The Kindlewood Annual Charity Gala exceeded all expectations this year, raising over $75,000 for our community programs. Held at the historic Town Hall, the evening featured live music, a silent auction, and inspiring stories from community members whose lives have been touched by our work.

The highlight of the evening was an address by James Thompson, a former recipient of our emergency housing support, who spoke movingly about how Kindlewood helped him get back on his feet after losing his job.

"When I had nothing, Kindlewood treated me with dignity," James shared. "They didn''t just give me a meal – they gave me hope. Now I''m here as a volunteer, paying it forward."

The silent auction featured donations from over 50 local businesses, with items ranging from restaurant vouchers to weekend getaways. All proceeds will fund expanded services including a new emergency relief fund.

Thank you to everyone who attended and supported this wonderful event. Save the date for next year – we''re already planning something special!',
   'placeholderImage.png',
   NOW() - INTERVAL '10 days',
   NOW() - INTERVAL '10 days'),

  ('60000000-0000-0000-0000-000000000007',
   'Beach Cleanup Removes 500kg of Waste',
   'Our monthly beach cleanup last weekend was a tremendous success, with over 40 volunteers removing more than 500 kilograms of waste from Bondi Beach and surrounding areas. The effort was part of our ongoing commitment to environmental stewardship.

Among the items collected were 3,000 cigarette butts, 500 plastic bottles, numerous fishing lines, and even an old shopping trolley that had been buried in the sand. All recyclable materials were sorted and properly disposed of.

"Seeing so many people give up their Saturday morning to clean our beaches is truly inspiring," says event organizer Tom Wilson. "But the real message is that we need to prevent this waste from reaching our beaches in the first place."

The cleanup also served as an educational opportunity, with marine biologists explaining the impact of plastic pollution on ocean ecosystems. Many young volunteers were particularly moved by learning about the effects of microplastics on marine life.

Our next beach cleanup is scheduled for the first Saturday of next month. Join us in keeping our coastlines beautiful!',
   'placeholderImage.png',
   NOW() - INTERVAL '7 days',
   NOW() - INTERVAL '7 days'),

  ('60000000-0000-0000-0000-000000000008',
   'New Partnership with Local Council Announced',
   'Kindlewood is excited to announce a new partnership with the Kindlewood Council to expand our community services over the next three years. The partnership includes funding for two new programs and access to additional community spaces.

Under the agreement, Kindlewood will establish a new Digital Literacy Program targeting seniors and a Homework Help Center for primary school students. Both programs address identified gaps in community services.

"This partnership represents the council''s confidence in Kindlewood''s ability to deliver quality community programs," says our CEO Maria Santos. "We''re grateful for their support and excited about what we can achieve together."

The partnership also grants Kindlewood use of the Old Library Building on weekends, significantly increasing our capacity for events and programs. Renovations will begin next month to transform the space into a vibrant community hub.

We will be recruiting volunteers for both new programs in the coming weeks. Stay tuned for more information!',
   'placeholderImage.png',
   NOW() - INTERVAL '5 days',
   NOW() - INTERVAL '5 days'),

  ('60000000-0000-0000-0000-000000000009',
   'Tips for First-Time Volunteers',
   'Thinking about volunteering but not sure where to start? Here are some tips from our experienced volunteer coordinators to help make your first experience a success.

**Choose Something You''re Passionate About**
We offer a variety of programs – from environmental work to elderly care to event support. Pick something that genuinely interests you, and you''ll find the experience much more rewarding.

**Start Small**
Don''t feel pressured to commit to weekly volunteering right away. Try a one-off event first to see if it''s a good fit. Many of our most dedicated volunteers started with a single beach cleanup or community kitchen shift.

**Ask Questions**
Our team leaders and experienced volunteers are always happy to help newcomers. Don''t be afraid to ask questions – there''s no such thing as a silly question when you''re learning.

**Be Reliable**
If you sign up for a shift, please show up or let us know in advance if you can''t make it. Our services depend on having enough volunteers, and others may be counting on you.

**Have Fun!**
Volunteering should be enjoyable. If you''re not having a good experience, talk to our coordinators – we want to find the right fit for everyone.

Ready to get started? Check out our upcoming events and sign up today!',
   'placeholderImage.png',
   NOW() - INTERVAL '3 days',
   NOW() - INTERVAL '3 days'),

  ('60000000-0000-0000-0000-000000000010',
   'Upcoming Events: Mark Your Calendar!',
   'As we head into a busy season, here''s a preview of some exciting events coming up at Kindlewood. We hope to see you there!

**River Cleanup Day - Next Saturday**
Join us for our quarterly river cleanup along the Parramatta River. Equipment provided, just bring water and sun protection.

**Community Health Fair - Two Weeks Away**
Free health screenings, fitness demonstrations, and health information. Volunteers needed for booth support and registration.

**Youth Sports Day - Coming Soon**
A fun day of sports and activities for underprivileged youth. Coaches and helpers welcome!

**Annual Christmas Party - Save the Date**
Our biggest celebration of the year brings together volunteers, community members, and supporters. More details coming soon.

To sign up for any of these events, visit our Events page or contact our volunteer coordinator. New volunteers are always welcome!

Remember, every event is an opportunity to make a difference in someone''s life – including your own.',
   'placeholderImage.png',
   NOW() - INTERVAL '1 day',
   NOW() - INTERVAL '1 day')

ON CONFLICT (id) DO NOTHING;

-- Total: 10 articles
