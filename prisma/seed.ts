import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');
  
  // Delete all existing data to start 100% fresh
  await prisma.answer.deleteMany({});
  await prisma.discussion.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('Seeding professional-grade colleges with high-resolution images...');

  const colleges = [
    {
      name: "Indian Institute of Technology Bombay",
      location: "Mumbai, Maharashtra",
      fees: 250000,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
      overview: "Established in 1958, IIT Bombay is a globally recognized pioneer in engineering education and research, consistently ranked as the top institution in India.",
      courses: ["B.Tech Computer Science", "B.Tech Electrical Engineering", "M.Tech Microelectronics", "Dual Degree Aerospace"],
      placements: "100% placement rate with a top package of ₹3.7 Crore per annum and average package of ₹23.5 Lakhs per annum in 2025.",
      reviews: [
        "Unmatched competitive coding culture and world-class labs.",
        "The startup ecosystem here is highly supportive and resourceful.",
        "Campus life at Powai lake is absolutely incredible."
      ]
    },
    {
      name: "BITS Pilani",
      location: "Pilani, Rajasthan",
      fees: 520000,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&q=80&w=800",
      overview: "BITS Pilani is India's premier private university, distinguished by its unique 'zero attendance' policy, robust student-run ecosystem, and industry-synced Practice School program.",
      courses: ["B.E. Computer Science", "B.E. Electronics & Instrumentation", "M.Sc. Physics", "MBA Business Analytics"],
      placements: "Average package of ₹19 Lakhs per annum. Top recruiters include Google, Microsoft, Uber, and Apple.",
      reviews: [
        "No attendance policy gives true academic freedom to explore hobbies.",
        "BITSian alumni network is extremely powerful and globally connected.",
        "Practice School program gives direct industrial exposure before graduation."
      ]
    },
    {
      name: "National Institute of Technology Trichy",
      location: "Trichy, Tamil Nadu",
      fees: 160000,
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
      overview: "NIT Trichy is celebrated as the top National Institute of Technology in India, boasting a sprawling campus and exceptional national academic reputation.",
      courses: ["B.Tech Computer Science", "B.Tech Chemical Engineering", "M.Tech Structural Engineering", "MCA"],
      placements: "Highest package of ₹52 Lakhs per annum with key recruitment from Texas Instruments, Nvidia, and Qualcomm.",
      reviews: [
        "A highly academically focused culture with top national talent.",
        "Hostel facilities are decent and the labs are fully equipped.",
        "Festivals like Festember are absolutely spectacular."
      ]
    },
    {
      name: "Delhi Technological University",
      location: "New Delhi, Delhi",
      fees: 190000,
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
      overview: "DTU (formerly Delhi College of Engineering) is one of India's oldest and most prestigious engineering institutions, recognized for its massive campus and industry ties in the capital.",
      courses: ["B.Tech Software Engineering", "B.Tech Mechanical Engineering", "M.Tech Data Science", "B.Des Fashion Design"],
      placements: "Average package of ₹16.4 Lakhs per annum with strong local tech hub placements.",
      reviews: [
        "Located in the capital with amazing industrial access.",
        "Alumni are leading top tech organizations globally.",
        "DTU's supermileage and automotive student clubs are legendary."
      ]
    },
    {
      name: "Vellore Institute of Technology",
      location: "Vellore, Tamil Nadu",
      fees: 310000,
      rating: 4.4,
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
      overview: "VIT Vellore is a modern, state-of-the-art campus renowned for its modular FFCS system (Fully Flexible Credit System) and immense global academic collaborations.",
      courses: ["B.Tech Computer Science (AI & ML)", "B.Tech Biotechnology", "M.Tech VLSI Design", "Integrated M.Tech Software Eng."],
      placements: "Over 900+ companies visited the campus last year, recording the highest national mass placements.",
      reviews: [
        "Great modern infrastructure, sports fields, and high-tech classrooms.",
        "The flexible credit system lets you choose your own professors and class timings.",
        "Massive international exposure and study abroad programs."
      ]
    },
    {
      name: "Indian Institute of Technology Madras",
      location: "Chennai, Tamil Nadu",
      fees: 230000,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
      overview: "Consistently ranked #1 by NIRF, IIT Madras is home to India's most advanced Research Park and a world-leading ecosystem in deep-tech innovation.",
      courses: ["B.Tech Computer Science", "B.Tech Aerospace Engineering", "M.S. Data Analytics", "Integrated BS-MS Physics"],
      placements: "Average package of ₹22.8 Lakhs per annum. Unmatched placement stats in deep tech and quantitative finance.",
      reviews: [
        "IITM Research Park is a hub of world-changing startups.",
        "Green, forest-like campus with wild deer roaming around.",
        "The faculty members are leading experts in international research committees."
      ]
    },
    {
      name: "Thapar Institute of Engineering",
      location: "Patiala, Punjab",
      fees: 410000,
      rating: 4.3,
      imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?auto=format&fit=crop&q=80&w=800",
      overview: "Thapar University is a premier destination for higher education in northern India, featuring a state-of-the-art campus, foreign tie-ups (Trinity College Dublin), and robust placements.",
      courses: ["B.E. Computer Engineering", "B.E. Electronics & Communication", "M.E. Software Engineering", "MBA"],
      placements: "Highly successful corporate relations with an average package of ₹11.5 Lakhs per annum and 95% placement rate.",
      reviews: [
        "Top-notch academic partnerships with Trinity College Dublin.",
        "The library building is one of the most beautiful architectural works in northern India.",
        "Amazing sports complexes and lively campus events."
      ]
    }
  ];

  for (const c of colleges) {
    await prisma.college.create({ data: c });
    console.log(`Successfully created college: ${c.name}`);
  }

  console.log('Seeding complete! High-fidelity professional dataset is ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
