import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

const IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
];

async function main() {
  console.log('🧹 Clearing existing data...');

  await prisma.answer.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creating users...');

  const usersData = [
    {
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      passwordHash: await hashPassword('password123'),
    },
    {
      name: 'Priya Mehta',
      email: 'priya@example.com',
      passwordHash: await hashPassword('password123'),
    },
    {
      name: 'Rohan Gupta',
      email: 'rohan@example.com',
      passwordHash: await hashPassword('password123'),
    },
    {
      name: 'Sneha Iyer',
      email: 'sneha@example.com',
      passwordHash: await hashPassword('password123'),
    },
    {
      name: 'Vikram Patel',
      email: 'vikram@example.com',
      passwordHash: await hashPassword('password123'),
    },
  ];

  const users = await Promise.all(
    usersData.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  );

  console.log(`✅ Created ${users.length} users`);

  console.log('🏫 Creating colleges...');

  const collegesData = [
    {
      name: 'Indian Institute of Technology Bombay',
      location: 'Mumbai, Maharashtra',
      fees: 250000,
      rating: 4.9,
      imageUrl: IMAGES[0],

      overview: `Established in 1958, IIT Bombay is a globally recognized pioneer in engineering education and research, consistently ranked as the top institution in India.`,

      courses: [
        'B.Tech Computer Science & Engineering',
        'B.Tech Electrical Engineering',
        'B.Tech Mechanical Engineering',
        'M.Tech Microelectronics',
      ],

      placements: `100% placement rate in 2025. Highest domestic package: ₹3.7 Crore p.a.`,

      reviews: [
        'Unmatched coding culture and world-class labs.',
        'Amazing startup ecosystem.',
        'Campus life is incredible.',
      ],
    },

    {
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      fees: 520000,
      rating: 4.8,
      imageUrl: IMAGES[1],

      overview: `BITS Pilani is India's premier private university with a unique zero-attendance policy and excellent academic flexibility.`,

      courses: [
        'B.E. Computer Science',
        'B.E. Electronics & Instrumentation',
        'M.Sc Physics',
      ],

      placements: `Average package: ₹19 Lakhs p.a. Top recruiters include Google, Microsoft, Uber, and Apple.`,

      reviews: [
        'Academic freedom is unmatched.',
        'Strong alumni network.',
        'Excellent industrial exposure.',
      ],
    },

    {
      name: 'National Institute of Technology Trichy',
      location: 'Trichy, Tamil Nadu',
      fees: 160000,
      rating: 4.7,
      imageUrl: IMAGES[2],

      overview: `NIT Trichy is one of the top engineering colleges in India with a strong academic reputation.`,

      courses: [
        'B.Tech Computer Science & Engineering',
        'B.Tech ECE',
        'MCA',
      ],

      placements: `Highest package: ₹52 Lakhs p.a. Strong placement record across all branches.`,

      reviews: [
        'Excellent academics.',
        'Well-equipped labs.',
        'Amazing college festivals.',
      ],
    },

    {
      name: 'Delhi Technological University',
      location: 'New Delhi, Delhi',
      fees: 190000,
      rating: 4.6,
      imageUrl: IMAGES[0],

      overview: `DTU is one of India's oldest and most prestigious engineering institutions.`,

      courses: [
        'BTech Software Engineering',
        'BTech Computer Science',
        'MBA Technology Management',
      ],

      placements: `Average package: ₹16.4 Lakhs p.a. Major recruiters include Amazon and Adobe.`,

      reviews: [
        'Amazing industrial exposure.',
        'Strong alumni network.',
        `DTU's automotive and supermileage clubs are legendary.`,
      ],
    },

    {
      name: 'Vellore Institute of Technology',
      location: 'Vellore, Tamil Nadu',
      fees: 310000,
      rating: 4.4,
      imageUrl: IMAGES[1],

      overview: `VIT Vellore is known for its modern infrastructure and FFCS system.`,

      courses: [
        'B.Tech AI & ML',
        'B.Tech Biotechnology',
        'MBA Digital Business',
      ],

      placements: `900+ companies visited campus in 2025.`,

      reviews: [
        'Modern infrastructure.',
        'Flexible timetable system.',
        'Great international exposure.',
      ],
    },

    {
      name: 'Indian Institute of Technology Madras',
      location: 'Chennai, Tamil Nadu',
      fees: 230000,
      rating: 4.9,
      imageUrl: IMAGES[2],

      overview: `IIT Madras is consistently ranked as India's top engineering institute.`,

      courses: [
        'B.Tech CSE',
        'B.Tech Aerospace Engineering',
        'PhD Quantum Computing',
      ],

      placements: `Highest package: ₹3.5 Crore p.a. Strong deep-tech ecosystem.`,

      reviews: [
        'Excellent research culture.',
        'Beautiful green campus.',
        'Top faculty and research labs.',
      ],
    },

    {
      name: 'Thapar Institute of Engineering',
      location: 'Patiala, Punjab',
      fees: 410000,
      rating: 4.3,
      imageUrl: IMAGES[0],

      overview: `Thapar University is a leading private engineering college in North India.`,

      courses: [
        'B.E. Computer Engineering',
        'B.E. Civil Engineering',
        'MBA',
      ],

      placements: `95% placement rate with strong recruiter presence.`,

      reviews: [
        'Great infrastructure.',
        'Strong placement support.',
        'Excellent campus life.',
      ],
    },
  ];

  const colleges = await Promise.all(
    collegesData.map((college) =>
      prisma.college.create({
        data: college,
      })
    )
  );

  console.log(`✅ Created ${colleges.length} colleges`);

  console.log('💬 Creating discussions...');

  const discussionsData = [
    {
      title: 'How is the CSE department at IIT Bombay?',
      body: `I got into CSE at IITB. Would love to hear about academics and research opportunities.`,

      authorId: users[0].id,
      collegeId: colleges[0].id,

      answers: [
        {
          body: `CSE at IITB is intense but extremely rewarding.`,
          authorId: users[1].id,
        },
        {
          body: `Amazing place for AI and systems research.`,
          authorId: users[2].id,
        },
      ],
    },

    {
      title: 'Is the Practice School worth it at BITS Pilani?',
      body: `How useful is the PS program at BITS?`,

      authorId: users[1].id,
      collegeId: colleges[1].id,

      answers: [
        {
          body: `PS-II is one of the best parts of BITS.`,
          authorId: users[0].id,
        },
      ],
    },

    {
      title: 'What is the placement scenario at NIT Trichy for ECE?',
      body: `Confused between NIT Trichy ECE and DTU CS.`,

      authorId: users[2].id,
      collegeId: colleges[2].id,

      answers: [
        {
          body: `NITT ECE is excellent for VLSI and embedded systems.`,
          authorId: users[0].id,
        },
      ],
    },
  ];

  for (const discussion of discussionsData) {
    const { answers, ...discussionData } = discussion;

    const createdDiscussion = await prisma.discussion.create({
      data: discussionData,
    });

    for (const answer of answers) {
      await prisma.answer.create({
        data: {
          ...answer,
          discussionId: createdDiscussion.id,
        },
      });
    }

    console.log(`💬 Created discussion: ${createdDiscussion.title}`);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });