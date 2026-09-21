import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

async function main() {
  console.log('🌱 Seeding Example Pages for anewway.in and rishabhjoshi.me...');
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db('pageforge');
  const pagesCol = db.collection('pages');
  const workspacesCol = db.collection('workspaces');

  // 1. Get or create primary workspace
  let workspace = await workspacesCol.findOne({ domain: 'localhost' });
  if (!workspace) {
    const res = await workspacesCol.insertOne({
      name: 'Default Workspace',
      domain: 'localhost',
      createdAt: new Date(),
    });
    workspace = { _id: res.insertedId, domain: 'localhost' };
  }
  const workspaceId = workspace._id.toString();

  // 2. Page 1: anewway.in Example Page
  const anewwayPage = {
    workspaceId,
    title: 'A New Way - Official Site (anewway.in)',
    slug: '/anewway',
    status: 'published',
    seoTitle: 'A New Way - Modern Digital Solutions',
    seoDescription: 'Empowering businesses with modern digital tools & automated CMS solutions.',
    updatedAt: new Date(),
    createdAt: new Date(),
    blocks: [
      {
        id: 'anw-banner',
        type: 'banner',
        order: 1,
        props: {
          text: '🚀 WELCOME TO A NEW WAY: Transform your digital workflow with PAGEFORGE CMS!',
          linkLabel: 'Learn More',
          linkUrl: '#',
          bgColor: '#7c3aed',
          textColor: '#ffffff',
          dismissible: true,
          icon: '✨',
        },
      },
      {
        id: 'anw-badge',
        type: 'badge',
        order: 2,
        props: {
          text: 'OFFICIAL SHOWCASE • ANEWWAY.IN',
          variant: 'soft',
          icon: '🌐',
          bgColor: '#7c3aed',
          textColor: '#7c3aed',
          align: 'center',
          size: 'md',
        },
      },
      {
        id: 'anw-heading',
        type: 'heading',
        order: 3,
        props: {
          text: 'Building the Future of Digital Web Experiences',
          tag: 'h1',
          fontSize: '40px',
          fontWeight: 'extrabold',
          textColor: '#0f172a',
          align: 'center',
          subtitle: 'Designed visually in PageForge CMS & served directly at https://anewway.in/',
        },
      },
      {
        id: 'anw-flex',
        type: 'flex',
        order: 4,
        props: {
          direction: 'row',
          wrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '20px',
          padding: '32px 20px',
          bgColor: '#f8fafc',
          borderColor: '#e2e8f0',
          borderRadius: '16px',
          items: [
            { id: '1', title: '⚡ Fast Performance', content: 'Edge-rendered server-side pages with instant load speeds.', icon: '🚀', badge: 'HIGH SPEED', linkUrl: '#' },
            { id: '2', title: '🔒 Enterprise Security', content: 'Isolated multi-tenant architecture with SSL & custom domains.', icon: '🛡️', badge: 'SECURE', linkUrl: '#' },
            { id: '3', title: '🎨 Visual Page Builder', content: 'Drag & drop atomic components, sections, and flex containers.', icon: '⚛️', badge: 'NO-CODE', linkUrl: '#' },
          ],
        },
      },
      {
        id: 'anw-alert',
        type: 'alert',
        order: 5,
        props: {
          variant: 'success',
          title: 'Custom Domain Connected',
          message: 'This page is configured to resolve live at https://anewway.in/ using PageForge CNAME DNS proxying.',
          icon: '✅',
          dismissible: false,
        },
      },
      {
        id: 'anw-form',
        type: 'form',
        order: 6,
        props: {
          title: 'Contact A New Way Team',
          subheading: 'Fill out the form below to get in touch with our team.',
          buttonLabel: 'Submit Inquiry',
          successMessage: '🎉 Thank you! We received your inquiry and will reach back shortly.',
          accentColor: '#7c3aed',
          bgColor: '#ffffff',
          borderColor: '#e2e8f0',
          fields: [
            { id: '1', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', required: true },
            { id: '2', label: 'Business Email', type: 'email', placeholder: 'jane@anewway.in', required: true },
            { id: '3', label: 'Project Budget', type: 'select', placeholder: '', required: true, options: '$1k - $5k, $5k - $15k, $15k+' },
            { id: '4', label: 'Project Message', type: 'textarea', placeholder: 'Describe your project requirements...', required: true },
          ],
        },
      },
    ],
  };

  // 3. Page 2: rishabhjoshi.me Example Page
  const rishabhPage = {
    workspaceId,
    title: 'Rishabh Joshi - Portfolio (rishabhjoshi.me)',
    slug: '/rishabhjoshi',
    status: 'published',
    seoTitle: 'Rishabh Joshi | Full Stack & AI Architect',
    seoDescription: 'Personal portfolio of Rishabh Joshi - Full Stack Developer & AI Systems Architect.',
    updatedAt: new Date(),
    createdAt: new Date(),
    blocks: [
      {
        id: 'rj-hero',
        type: 'hero',
        order: 1,
        props: {
          title: 'Hi, I am Rishabh Joshi 👋',
          subtitle: 'Full Stack Engineer & Creator of PAGEFORGE CMS',
          ctaLabel: 'View Portfolio',
          ctaUrl: '#',
          bgColor: '#0f172a',
          textColor: '#ffffff',
          align: 'center',
        },
      },
      {
        id: 'rj-badge',
        type: 'badge',
        order: 2,
        props: {
          text: 'CUSTOM DOMAIN LIVE • RISHABHJOSHI.ME',
          variant: 'soft',
          icon: '💻',
          bgColor: '#3b82f6',
          textColor: '#3b82f6',
          align: 'center',
          size: 'md',
        },
      },
      {
        id: 'rj-stats',
        type: 'stats',
        order: 3,
        props: {
          heading: 'Impact & Technical Highlights',
          subheading: 'Key metrics from recent enterprise projects',
          bgColor: '#f1f5f9',
          textColor: '#0f172a',
          accentColor: '#2563eb',
          columns: 4,
          items: [
            { id: '1', value: '5', suffix: '+', label: 'Years Experience', icon: '💻' },
            { id: '2', value: '50', suffix: '+', label: 'Projects Shipped', icon: '🚀' },
            { id: '3', value: '99.9', suffix: '%', label: 'Uptime Reliability', icon: '⚡' },
            { id: '4', value: '100', suffix: 'k+', label: 'Active Users', icon: '👥' },
          ],
        },
      },
      {
        id: 'rj-alert',
        type: 'alert',
        order: 4,
        props: {
          variant: 'info',
          title: 'Domain Binding Active',
          message: 'This portfolio is hosted at PAGEFORGE.in and bound to https://www.rishabhjoshi.me/',
          icon: '💡',
          dismissible: true,
        },
      },
    ],
  };

  // Upsert pages
  await pagesCol.updateOne({ slug: anewwayPage.slug }, { $set: anewwayPage }, { upsert: true });
  await pagesCol.updateOne({ slug: rishabhPage.slug }, { $set: rishabhPage }, { upsert: true });

  console.log('✅ Seeded 2 example pages successfully!');
  await client.close();
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
