import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoClient';
import { Block } from '@/types/Block';

// ─── Preset Products Data ───────────────────────────────────────────────────
const productsList = [
  {
    id: 'cake-1',
    title: 'Fresh Tropical Fruit & Almond Cake',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: '1.4k',
    eggless: true,
    discount: '25% OFF',
  },
  {
    id: 'cake-2',
    title: 'Belgian Dark Chocolate Truffle Cake',
    price: 649,
    originalPrice: 849,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: '2.1k',
    eggless: true,
    discount: '23% OFF',
  },
  {
    id: 'cake-3',
    title: 'Red Velvet Cream Cheese Heart Cake',
    price: 699,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: '980',
    eggless: true,
    discount: '22% OFF',
  },
  {
    id: 'cake-4',
    title: 'Nutella Ferrero Rocher Gourmet Cake',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewCount: '850',
    eggless: true,
    discount: '24% OFF',
  },
];

// ─── Reusable Block Helper Factories (Zero HTML Boilerplate needed) ─────────
const navbarBlock = (order = 1): Block => ({
  id: 'nav',
  type: 'navbar',
  order,
  props: { brandName: 'bakingo', logoIcon: '🎂', promoText: 'SPECIAL OFFER: Get FLAT 15% OFF on First Order', promoCode: 'WELCOME15' },
});

const heroBlock = (title: string, subtitle: string, order = 2): Block => ({
  id: 'hero',
  type: 'hero',
  order,
  props: { title, subtitle, ctaLabel: 'Explore Bestselling Cakes', ctaUrl: '/site/cakes', bgColor: '#fff0f3', textColor: '#1a1a2e', align: 'center' },
});

const pincodeBlock = (order = 3): Block => ({
  id: 'pin',
  type: 'pincode-checker',
  order,
  props: { title: 'Check Delivery Slot & Pincode Availability', placeholder: 'Enter Pincode (e.g. 110001, 560001)' },
});

const productGridBlock = (heading: string, products = productsList, order = 4): Block => ({
  id: 'prod-grid',
  type: 'product-grid',
  order,
  props: { heading, subheading: 'Most Loved Delights', products },
});

const trustCardsBlock = (order = 5): Block => ({
  id: 'trust',
  type: 'cards',
  order,
  props: {
    heading: "Why Bakingo is India's Most Loved Bakery",
    columns: 4,
    items: [
      { id: 'w1', icon: '⚡', title: '2-Hour Express Delivery', description: 'Same-day & midnight delivery guaranteed across 50+ major cities.' },
      { id: 'w2', icon: '🎂', title: '100% Freshly Baked', description: 'Handcrafted fresh in certified cloud kitchens after order placement.' },
      { id: 'w3', icon: '🌿', title: '100% Pure Veg / Eggless', description: 'Dedicated vegetarian options crafted with finest cocoa & cream.' },
      { id: 'w4', icon: '⭐', title: '5 Million+ Happy Customers', description: 'Rated 4.9/5 stars across Google & Trustpilot with over 5M orders.' },
    ],
  },
});

const footerBlock = (order = 6): Block => ({
  id: 'footer',
  type: 'custom',
  order,
  props: {
    html: `
<footer style="background: #1a1a2e; color: #a0a0b0; padding: 50px 20px 30px; font-family: system-ui, sans-serif; border-top: 4px solid #e21b5a;">
  <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; margin-bottom: 30px;">
    <div><h3 style="color:#fff; margin-bottom:12px;">🎂 bakingo</h3><p style="font-size:14px; line-height:1.6;">India's leading online bakery delivering fresh cakes & happiness right to your doorstep within 2 hours.</p></div>
    <div><h4 style="color:#fff; margin-bottom:12px;">Top Categories</h4><p style="font-size:14px; line-height:2;"><a href="/site/cakes" style="color:#a0a0b0; text-decoration:none;">Chocolate Cakes</a><br/><a href="/site/cakes" style="color:#a0a0b0; text-decoration:none;">Photo Cakes</a><br/><a href="/site/cakes" style="color:#a0a0b0; text-decoration:none;">Fresh Fruit Cakes</a></p></div>
    <div><h4 style="color:#fff; margin-bottom:12px;">Support</h4><p style="font-size:14px; line-height:2;"><a href="/site/track-order" style="color:#e21b5a; font-weight:700; text-decoration:none;">🚚 Track Order</a><br/>Call: +91 8882-553-300</p></div>
  </div>
  <div style="text-align:center; font-size:13px; border-top:1px solid #2d2d44; padding-top:20px;">© 2026 Bakingo Clone built with PageForge CMS Builder.</div>
</footer>`,
    css: '',
    js: '',
    height: 220,
  },
});

// ─── API Route Handler ───────────────────────────────────────────────────────
export async function GET() { return seedBakingoData(); }
export async function POST() { return seedBakingoData(); }

async function seedBakingoData() {
  try {
    const client = await clientPromise;
    const db = client.db('pageforge');

    const workspacesCol = db.collection('workspaces');
    let workspace = await workspacesCol.findOne({ $or: [{ domain: 'localhost' }, { name: 'Bakingo Official' }] });

    if (!workspace) {
      const result = await workspacesCol.insertOne({ name: 'Bakingo Official', domain: 'localhost', createdAt: new Date() });
      workspace = { _id: result.insertedId, name: 'Bakingo Official', domain: 'localhost' };
    }

    const workspaceId = workspace._id.toString();
    const pagesCol = db.collection('pages');

    // Clean, Concise Pages Definitions (reduced from 650 lines to minimal JSON declarations)
    const bakingoPages = [
      {
        workspaceId,
        title: 'Bakingo - Online Cake Delivery',
        slug: '/',
        status: 'published',
        seoTitle: 'Bakingo - Buy & Send Cakes Online | 2-Hour Express Delivery',
        seoDescription: 'Order fresh & 100% eggless cakes online from Bakingo.',
        ogImage: productsList[0].image,
        blocks: [navbarBlock(1), heroBlock('Freshly Baked Happiness Delivered in 2 Hours 🎂', 'Handcrafted with premium ingredients • 100% Eggless Options', 2), pincodeBlock(3), productGridBlock('Bestselling Cakes', productsList, 4), trustCardsBlock(5), footerBlock(6)],
      },
      {
        workspaceId,
        title: 'Cakes Category - Bakingo',
        slug: '/cakes',
        status: 'published',
        seoTitle: 'Order Cakes Online - Wide Range of Fresh Flavours | Bakingo',
        seoDescription: 'Explore 100+ fresh cake options.',
        ogImage: productsList[1].image,
        blocks: [navbarBlock(1), heroBlock('All Cakes & Confectionery 🍰', 'Select from 100+ gourmet flavors handcrafted by master chefs', 2), productGridBlock('Fresh Cakes Catalog', productsList, 3), footerBlock(4)],
      },
      {
        workspaceId,
        title: 'Fresh Fruit & Almond Cake - Bakingo',
        slug: '/fresh-fruit-cake',
        status: 'published',
        seoTitle: 'Fresh Tropical Fruit & Almond Cake - Buy Online | Bakingo',
        seoDescription: 'Buy fresh tropical fruit cake online.',
        ogImage: productsList[0].image,
        blocks: [navbarBlock(1), pincodeBlock(2), productGridBlock('Product Details & Ordering', [productsList[0]], 3), footerBlock(4)],
      },
      {
        workspaceId,
        title: 'Track Order - Bakingo',
        slug: '/track-order',
        status: 'published',
        seoTitle: 'Track Your Cake Order Status | Bakingo',
        seoDescription: 'Live order tracking for Bakingo cake delivery.',
        ogImage: '',
        blocks: [navbarBlock(1), footerBlock(2)],
      },
    ];

    for (const p of bakingoPages) {
      await pagesCol.deleteMany({ workspaceId, slug: p.slug });
      await pagesCol.insertOne({ ...p, createdAt: new Date(), updatedAt: new Date() });
    }

    return NextResponse.json({
      success: true,
      message: 'Bakingo pages seeded with minimal clean block declarations!',
      workspaceId,
      pages: bakingoPages.map((p) => ({ title: p.title, slug: p.slug })),
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
