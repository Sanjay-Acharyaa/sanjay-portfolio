import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import bcrypt from 'bcryptjs';

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding portfolio database...');

  // ─── Super Admin ──────────────────────────────────────────────────────────
  const hashed = await bcrypt.hash('admin123', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'sanjay@portfolio.com' },
    update: {},
    create: {
      email: 'sanjay@portfolio.com',
      password: hashed,
      name: 'Sanjay Acharya',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // ─── Categories ───────────────────────────────────────────────────────────
  const categories = [
    { name: 'Structural Engineering', slug: 'structural-engineering', color: '#0083cc', description: 'Building, bridge and structural design' },
    { name: 'Transportation', slug: 'transportation', color: '#ea580c', description: 'Road, highway and transport infrastructure' },
    { name: 'Water Resources', slug: 'water-resources', color: '#0891b2', description: 'Water supply, drainage and irrigation' },
    { name: 'Construction Management', slug: 'construction-management', color: '#7c3aed', description: 'Project planning, estimation and management' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // ─── Tags ─────────────────────────────────────────────────────────────────
  const tags = [
    'AutoCAD', 'STAAD Pro', 'SAP2000', 'Highway Design',
    'Traffic Analysis', 'HEC-RAS', 'EPANET', 'Cost Estimation',
    'Seismic Design', 'Foundation', 'Bridge', 'Drainage',
    'Sustainability', 'LEED', 'Primavera',
  ];

  for (const name of tags) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }
  console.log('✅ Tags seeded');

  // ─── Services ─────────────────────────────────────────────────────────────
  const services = [
    { title: 'Structural Design', slug: 'structural-design', description: 'Comprehensive structural design and analysis for buildings, bridges, and infrastructure using industry-standard software and international codes.', icon: 'Building2', order: 1 },
    { title: 'Construction Estimation', slug: 'construction-estimation', description: 'Accurate quantity take-off, bill of quantities, and cost estimation for civil and structural construction projects.', icon: 'Calculator', order: 2 },
    { title: 'Transportation Engineering', slug: 'transportation-engineering', description: 'Road design, traffic analysis, and transportation infrastructure planning for urban and rural networks.', icon: 'Road', order: 3 },
    { title: 'Water Resources', slug: 'water-resources-service', description: 'Design and analysis of water supply, sewerage, drainage, and irrigation systems.', icon: 'Droplets', order: 4 },
    { title: 'Project Management', slug: 'project-management', description: 'End-to-end construction project management including scheduling, quality control, and stakeholder coordination.', icon: 'ClipboardList', order: 5 },
    { title: 'Feasibility Studies', slug: 'feasibility-studies', description: 'Technical and financial feasibility analysis for civil and infrastructure development projects.', icon: 'FileSearch', order: 6 },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: svc,
    });
  }
  console.log('✅ Services seeded');

  console.log('\n🎉 Seed complete!');
  console.log('Admin login: sanjay@portfolio.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
