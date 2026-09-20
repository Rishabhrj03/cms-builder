import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

async function main() {
  console.log('🌱 Starting Bakingo site seed process with Hybrid Native & Plugin Blocks...');
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db('pageforge');

  // 1. Workspace
  const workspacesCol = db.collection('workspaces');
  let workspace = await workspacesCol.findOne({ $or: [{ domain: 'localhost' }, { name: 'Bakingo Official' }] });

  if (!workspace) {
    const result = await workspacesCol.insertOne({
      name: 'Bakingo Official',
      domain: 'localhost',
      createdAt: new Date(),
    });
    workspace = { _id: result.insertedId, name: 'Bakingo Official', domain: 'localhost' };
  }

  const workspaceId = workspace._id.toString();

  // 2. Define Bakingo pages
  const pagesCol = db.collection('pages');

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

  const bakingoPages = [
    {
      workspaceId,
      title: 'Bakingo - Online Cake Delivery',
      slug: '/',
      status: 'published',
      seoTitle: 'Bakingo - Buy & Send Cakes Online | 2-Hour Express Delivery',
      seoDescription: 'Order fresh & 100% eggless cakes online from Bakingo. Fast 2-hour same day delivery in Delhi NCR, Mumbai, Bangalore, Hyderabad & 50+ cities.',
      ogImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
      blocks: [
        {
          id: 'bakingo-navbar',
          type: 'navbar',
          order: 1,
          props: {
            brandName: 'bakingo',
            logoIcon: '🎂',
            promoText: 'SPECIAL OFFER: Get FLAT 15% OFF on First Order',
            promoCode: 'WELCOME15',
          },
        },
        {
          id: 'bakingo-hero',
          type: 'hero',
          order: 2,
          props: {
            title: 'Freshly Baked Happiness Delivered in 2 Hours 🎂',
            subtitle: 'Handcrafted with premium ingredients • 100% Eggless Options • Midnight & Express Delivery across India',
            ctaLabel: 'Explore Bestselling Cakes',
            ctaUrl: '/site/cakes',
            bgColor: '#fff0f3',
            textColor: '#1a1a2e',
            align: 'center',
          },
        },
        {
          id: 'bakingo-pincode',
          type: 'pincode-checker',
          order: 3,
          props: {
            title: 'Check Delivery Slot & Pincode Availability',
            placeholder: 'Enter Pincode (e.g. 110001, 560001)',
          },
        },
        {
          id: 'bakingo-categories',
          type: 'custom',
          order: 4,
          props: {
            html: `
<div style="padding: 50px 20px; background: #ffffff; font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 35px;">
    <h2 style="font-size: 28px; font-weight: 800; color: #222; margin-bottom: 8px;">Explore Our Sweet Categories</h2>
    <p style="color: #666; font-size: 15px;">Handcrafted delights for birthdays, anniversaries, and everyday cravings</p>
  </div>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 20px;">
    <a href="/site/cakes" style="text-decoration: none; color: inherit; text-align: center; background: #fff5f7; padding: 24px 16px; border-radius: 16px; border: 1px solid #ffe3e9;">
      <div style="font-size: 42px; margin-bottom: 12px;">🍰</div>
      <div style="font-weight: 700; color: #222; font-size: 16px;">Gourmet Cakes</div>
      <div style="font-size: 12px; color: #888; margin-top: 4px;">50+ Flavours</div>
    </a>

    <a href="/site/cakes" style="text-decoration: none; color: inherit; text-align: center; background: #fff8f0; padding: 24px 16px; border-radius: 16px; border: 1px solid #ffe8d6;">
      <div style="font-size: 42px; margin-bottom: 12px;">🖼️</div>
      <div style="font-weight: 700; color: #222; font-size: 16px;">Photo Cakes</div>
      <div style="font-size: 12px; color: #888; margin-top: 4px;">Custom Memories</div>
    </a>

    <a href="/site/cakes" style="text-decoration: none; color: inherit; text-align: center; background: #f4f9ff; padding: 24px 16px; border-radius: 16px; border: 1px solid #dbeafe;">
      <div style="font-size: 42px; margin-bottom: 12px;">🎨</div>
      <div style="font-weight: 700; color: #222; font-size: 16px;">Designer Cakes</div>
      <div style="font-size: 12px; color: #888; margin-top: 4px;">Theme & Birthday</div>
    </a>

    <a href="/site/cakes" style="text-decoration: none; color: inherit; text-align: center; background: #fdf2ff; padding: 24px 16px; border-radius: 16px; border: 1px solid #fae8ff;">
      <div style="font-size: 42px; margin-bottom: 12px;">🧁</div>
      <div style="font-weight: 700; color: #222; font-size: 16px;">Cupcakes & Jars</div>
      <div style="font-size: 12px; color: #888; margin-top: 4px;">Mini Delights</div>
    </a>

    <a href="/site/cakes" style="text-decoration: none; color: inherit; text-align: center; background: #fff5f5; padding: 24px 16px; border-radius: 16px; border: 1px solid #fed7d7;">
      <div style="font-size: 42px; margin-bottom: 12px;">💖</div>
      <div style="font-weight: 700; color: #222; font-size: 16px;">Anniversary Specials</div>
      <div style="font-size: 12px; color: #888; margin-top: 4px;">Heart Shaped</div>
    </a>

    <a href="/site/cakes" style="text-decoration: none; color: inherit; text-align: center; background: #f0fff4; padding: 24px 16px; border-radius: 16px; border: 1px solid #dcffe4;">
      <div style="font-size: 42px; margin-bottom: 12px;">🌿</div>
      <div style="font-weight: 700; color: #222; font-size: 16px;">100% Eggless</div>
      <div style="font-size: 12px; color: #888; margin-top: 4px;">Pure Veg Bake</div>
    </a>
  </div>
</div>`,
            css: '',
            js: '',
            height: 300,
          },
        },
        {
          id: 'bakingo-products-native',
          type: 'product-grid',
          order: 5,
          props: {
            heading: 'Bestselling Cakes',
            subheading: 'Most Loved Delights',
            products: productsList,
          },
        },
        {
          id: 'bakingo-cards-why',
          type: 'cards',
          order: 6,
          props: {
            heading: "Why Bakingo is India's Most Loved Bakery",
            columns: 4,
            items: [
              {
                id: 'w1',
                icon: '⚡',
                title: '2-Hour Express Delivery',
                description: 'Same-day & midnight delivery guaranteed across 50+ major cities in India.',
              },
              {
                id: 'w2',
                icon: '🎂',
                title: '100% Freshly Baked',
                description: 'Handcrafted fresh in certified cloud kitchens only after order placement.',
              },
              {
                id: 'w3',
                icon: '🌿',
                title: '100% Pure Veg / Eggless',
                description: 'Dedicated vegetarian options crafted with finest cocoa & fresh cream.',
              },
              {
                id: 'w4',
                icon: '⭐',
                title: '5 Million+ Happy Customers',
                description: 'Rated 4.9/5 stars across Google & Trustpilot with over 5M orders fulfilled.',
              },
            ],
          },
        },
        {
          id: 'bakingo-footer',
          type: 'custom',
          order: 7,
          props: {
            html: `
<footer style="background: #1a1a2e; color: #a0a0b0; padding: 60px 20px 30px; font-family: system-ui, sans-serif; border-top: 4px solid #e21b5a;">
  <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; margin-bottom: 40px;">
    <div>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
        <span style="font-size: 24px;">🎂</span>
        <span style="font-size: 24px; font-weight: 800; color: #ffffff;">bakingo</span>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #a0a0b0;">India's leading online bakery delivering fresh cakes, desserts, and happiness right to your doorstep within 2 hours.</p>
    </div>

    <div>
      <h4 style="color: #ffffff; font-size: 16px; margin-bottom: 16px;">Top Categories</h4>
      <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 2;">
        <li><a href="/site/cakes" style="color: #a0a0b0; text-decoration: none;">Chocolate Cakes</a></li>
        <li><a href="/site/cakes" style="color: #a0a0b0; text-decoration: none;">Photo Cakes</a></li>
        <li><a href="/site/cakes" style="color: #a0a0b0; text-decoration: none;">Fresh Fruit Cakes</a></li>
        <li><a href="/site/cakes" style="color: #a0a0b0; text-decoration: none;">Designer Birthday Cakes</a></li>
      </ul>
    </div>

    <div>
      <h4 style="color: #ffffff; font-size: 16px; margin-bottom: 16px;">Delivery Cities</h4>
      <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 2;">
        <li>Delhi NCR (Gurugram, Noida)</li>
        <li>Bengaluru</li>
        <li>Mumbai & Pune</li>
        <li>Hyderabad & Chennai</li>
      </ul>
    </div>

    <div>
      <h4 style="color: #ffffff; font-size: 16px; margin-bottom: 16px;">Customer Service</h4>
      <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 2;">
        <li><a href="/site/track-order" style="color: #e21b5a; font-weight: 700; text-decoration: none;">🚚 Track Order Status</a></li>
        <li>Contact Support: care@bakingo.com</li>
        <li>Call: +91 8882-553-300</li>
      </ul>
    </div>
  </div>

  <div style="max-width: 1200px; margin: 0 auto; padding-top: 20px; border-top: 1px solid #2d2d44; text-align: center; font-size: 13px;">
    © 2026 Bakingo Clone built with PageForge CMS Builder. All rights reserved.
  </div>
</footer>`,
            css: '',
            js: '',
            height: 250,
          },
        },
      ],
    },
    {
      workspaceId,
      title: 'Cakes Category - Bakingo',
      slug: '/cakes',
      status: 'published',
      seoTitle: 'Order Cakes Online - Wide Range of Fresh Flavours | Bakingo',
      seoDescription: 'Explore 100+ fresh cake options including Chocolate, Red Velvet, Fruit, Photo, and Designer Cakes.',
      ogImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
      blocks: [
        {
          id: 'cakes-navbar',
          type: 'navbar',
          order: 1,
          props: {
            brandName: 'bakingo',
            logoIcon: '🎂',
            promoText: 'SPECIAL OFFER: Get FLAT 15% OFF on First Order',
            promoCode: 'WELCOME15',
          },
        },
        {
          id: 'cakes-hero',
          type: 'hero',
          order: 2,
          props: {
            title: 'All Cakes & Confectionery 🍰',
            subtitle: 'Select from 100+ gourmet flavors handcrafted by master chefs',
            ctaLabel: 'Select Your Favorite',
            ctaUrl: '#catalog-grid',
            bgColor: '#e21b5a',
            textColor: '#ffffff',
            align: 'center',
          },
        },
        {
          id: 'cakes-catalog-native',
          type: 'product-grid',
          order: 3,
          props: {
            heading: 'Fresh Cakes Catalog',
            subheading: '100% Eggless Options Available',
            products: productsList,
          },
        },
      ],
    },
    {
      workspaceId,
      title: 'Fresh Fruit & Almond Cake - Bakingo',
      slug: '/fresh-fruit-cake',
      status: 'published',
      seoTitle: 'Fresh Tropical Fruit & Almond Cake - Buy Online | Bakingo',
      seoDescription: 'Buy fresh tropical fruit cake online. Topped with kiwi, strawberries & crunchy roasted almonds.',
      ogImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
      blocks: [
        {
          id: 'p-navbar',
          type: 'navbar',
          order: 1,
          props: {
            brandName: 'bakingo',
            logoIcon: '🎂',
            promoText: 'SPECIAL OFFER: Get FLAT 15% OFF on First Order',
            promoCode: 'WELCOME15',
          },
        },
        {
          id: 'p-pincode',
          type: 'pincode-checker',
          order: 2,
          props: {
            title: 'Check Delivery Slot at Your Pincode',
            placeholder: 'Enter 6-digit Pincode (e.g. 110001)',
          },
        },
        {
          id: 'p-products',
          type: 'product-grid',
          order: 3,
          props: {
            heading: 'Product Details & Add to Cart',
            subheading: 'Freshly Baked On Order',
            products: [productsList[0]],
          },
        },
      ],
    },
    {
      workspaceId,
      title: 'Track Order - Bakingo',
      slug: '/track-order',
      status: 'published',
      seoTitle: 'Track Your Cake Order Status | Bakingo',
      seoDescription: 'Live order tracking for Bakingo cake delivery.',
      ogImage: '',
      blocks: [
        {
          id: 'track-navbar',
          type: 'navbar',
          order: 1,
          props: {
            brandName: 'bakingo',
            logoIcon: '🎂',
            promoText: 'SPECIAL OFFER: Get FLAT 15% OFF on First Order',
            promoCode: 'WELCOME15',
          },
        },
        {
          id: 'track-form',
          type: 'custom',
          order: 2,
          props: {
            html: `
<div style="padding: 80px 20px; max-width: 500px; margin: 0 auto; font-family: system-ui, sans-serif; text-align: center;">
  <div style="font-size: 54px; margin-bottom: 16px;">🚚</div>
  <h1 style="font-size: 28px; font-weight: 800; color: #111; margin-bottom: 8px;">Track Your Order</h1>
  <p style="color: #666; font-size: 14px; margin-bottom: 30px;">Enter your Order ID or registered Mobile Number to track delivery in real time.</p>
  
  <div style="background: white; padding: 30px; border-radius: 16px; border: 1px solid #eee; box-shadow: 0 8px 30px rgba(0,0,0,0.06);">
    <div style="text-align: left; margin-bottom: 20px;">
      <label style="font-weight: 700; font-size: 13px; color: #333; display: block; margin-bottom: 6px;">Order ID / Phone Number:</label>
      <input type="text" placeholder="e.g. BKG-98412 or 9876543210" style="width: 100%; padding: 12px; border-radius: 8px; border: 1.5px solid #ddd; font-size: 15px; box-sizing: border-box;" />
    </div>
    <button onclick="alert('🚚 Order Status: Out for Express Delivery! Driver contact: +91 98110-22334')" style="width: 100%; background: #e21b5a; color: white; border: none; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 16px; cursor: pointer;">Track Order Status</button>
  </div>
</div>`,
            css: '',
            js: '',
            height: 400,
          },
        },
      ],
    },
  ];

  for (const p of bakingoPages) {
    await pagesCol.deleteMany({ workspaceId, slug: p.slug });
    await pagesCol.insertOne({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Seeded hybrid page: ${p.title} (${p.slug})`);
  }

  console.log('🎉 Hybrid Bakingo site seed completed successfully!');
  await client.close();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
