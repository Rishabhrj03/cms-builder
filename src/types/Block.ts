export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'cards'
  | 'button'
  | 'divider'
  | 'custom'
  | 'navbar'
  | 'product-grid'
  | 'pincode-checker'
  // ── New WordPress-style blocks ──────────────────
  | 'testimonials'
  | 'faq'
  | 'countdown'
  | 'newsletter'
  | 'video'
  | 'pricing'
  | 'gallery'
  | 'banner'
  | 'stats'
  | 'steps'
  | 'social-links'
  | 'rich-html'
  // ── Atomic HTML Elements & Layout ───────────────
  | 'heading'
  | 'flex'
  | 'form'
  | 'alert'
  | 'badge';

// ─── Existing prop shapes ──────────────────────────────────────────────────────

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  bgColor: string;
  textColor: string;
  align: 'left' | 'center' | 'right';
}

export interface TextProps {
  content: string;
  align: 'left' | 'center' | 'right';
  fontSize: 'sm' | 'md' | 'lg';
}

export interface ImageProps {
  src: string;
  alt: string;
  caption: string;
  width: 'full' | 'half' | 'quarter';
}

export interface CardItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface CardsProps {
  heading: string;
  columns: 2 | 3 | 4;
  items: CardItem[];
}

export interface ButtonProps {
  label: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline';
  align: 'left' | 'center' | 'right';
  size: 'sm' | 'md' | 'lg';
}

export interface DividerProps {
  style: 'solid' | 'dashed' | 'dotted';
  label: string;
  color: string;
}

export interface CustomProps {
  html: string;
  css: string;
  js: string;
  height: number;
}

export interface NavbarProps {
  brandName: string;
  logoIcon: string;
  promoText: string;
  promoCode: string;
}

export interface ProductItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviewCount: string;
  eggless: boolean;
  discount: string;
}

export interface ProductGridProps {
  heading: string;
  subheading: string;
  products: ProductItem[];
}

export interface PincodeCheckerProps {
  title: string;
  placeholder: string;
}

// ─── New block prop shapes ─────────────────────────────────────────────────────

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface TestimonialsProps {
  heading: string;
  subheading: string;
  layout: 'grid' | 'list';
  columns: 2 | 3;
  items: TestimonialItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqProps {
  heading: string;
  subheading: string;
  items: FaqItem[];
  accentColor: string;
}

export interface CountdownProps {
  heading: string;
  subheading: string;
  targetDate: string; // ISO date string
  bgColor: string;
  textColor: string;
  accentColor: string;
}

export interface NewsletterProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  placeholder: string;
  bgColor: string;
  textColor: string;
}

export interface VideoProps {
  url: string;
  caption: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  autoplay: boolean;
  muted: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaUrl: string;
  popular: boolean;
  accentColor: string;
}

export interface PricingProps {
  heading: string;
  subheading: string;
  plans: PricingPlan[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface GalleryProps {
  heading: string;
  columns: 2 | 3 | 4;
  gap: 'tight' | 'normal' | 'loose';
  images: GalleryImage[];
}

export interface BannerProps {
  text: string;
  linkLabel: string;
  linkUrl: string;
  bgColor: string;
  textColor: string;
  dismissible: boolean;
  icon: string;
}

export interface StatItem {
  id: string;
  value: string;
  suffix: string;
  label: string;
  icon: string;
}

export interface StatsProps {
  heading: string;
  subheading: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  columns: 2 | 3 | 4;
  items: StatItem[];
}

export interface StepItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StepsProps {
  heading: string;
  subheading: string;
  layout: 'vertical' | 'horizontal';
  accentColor: string;
  items: StepItem[];
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'whatsapp' | 'linkedin' | 'tiktok' | 'pinterest';
  url: string;
  label: string;
}

export interface SocialLinksProps {
  heading: string;
  style: 'icon-only' | 'icon-label';
  align: 'left' | 'center' | 'right';
  iconSize: 'sm' | 'md' | 'lg';
  links: SocialLink[];
}

export interface RichHtmlProps {
  html: string;
  padding: 'none' | 'sm' | 'md' | 'lg';
}

// ─── Atomic HTML Elements Props ────────────────────────────────────────────────

export interface HeadingProps {
  text: string;
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontSize: string;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  textColor: string;
  align: 'left' | 'center' | 'right';
  subtitle: string;
}

export interface FlexItem {
  id: string;
  title: string;
  content: string;
  icon: string;
  badge: string;
  linkUrl: string;
}

export interface FlexProps {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap: 'wrap' | 'nowrap';
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap: string;
  padding: string;
  bgColor: string;
  borderColor: string;
  borderRadius: string;
  items: FlexItem[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
  placeholder: string;
  required: boolean;
  options?: string;
}

export interface FormProps {
  title: string;
  subheading: string;
  buttonLabel: string;
  successMessage: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  fields: FormField[];
}

export interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  icon: string;
  dismissible: boolean;
}

export interface BadgeProps {
  text: string;
  variant: 'filled' | 'outline' | 'soft';
  icon: string;
  bgColor: string;
  textColor: string;
  align: 'left' | 'center' | 'right';
  size: 'sm' | 'md' | 'lg';
}

// ─── Union ─────────────────────────────────────────────────────────────────────

export type BlockProps =
  | HeroProps
  | TextProps
  | ImageProps
  | CardsProps
  | ButtonProps
  | DividerProps
  | CustomProps
  | NavbarProps
  | ProductGridProps
  | PincodeCheckerProps
  | TestimonialsProps
  | FaqProps
  | CountdownProps
  | NewsletterProps
  | VideoProps
  | PricingProps
  | GalleryProps
  | BannerProps
  | StatsProps
  | StepsProps
  | SocialLinksProps
  | RichHtmlProps
  | HeadingProps
  | FlexProps
  | FormProps
  | AlertProps
  | BadgeProps;

// ─── Block instance ────────────────────────────────────────────────────────────

export interface Block {
  id: string;
  type: BlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  order: number;
}

// ─── Default props factory ─────────────────────────────────────────────────────

export const defaultProps: Record<BlockType, Record<string, unknown>> = {
  hero: {
    title: 'Welcome to Your Page',
    subtitle: 'Add a compelling subtitle here.',
    ctaLabel: 'Get Started',
    ctaUrl: '#',
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
    align: 'center',
  } satisfies HeroProps,
  text: {
    content: 'Start writing your content here...',
    align: 'left',
    fontSize: 'md',
  } satisfies TextProps,
  image: {
    src: '',
    alt: 'Image description',
    caption: '',
    width: 'full',
  } satisfies ImageProps,
  cards: {
    heading: 'Our Features',
    columns: 3,
    items: [
      { id: '1', icon: '⚡', title: 'Fast', description: 'Lightning fast performance.' },
      { id: '2', icon: '🔒', title: 'Secure', description: 'Enterprise-grade security.' },
      { id: '3', icon: '🎨', title: 'Beautiful', description: 'Stunning out-of-the-box design.' },
    ],
  } satisfies CardsProps,
  button: {
    label: 'Click Me',
    url: '#',
    variant: 'primary',
    align: 'center',
    size: 'md',
  } satisfies ButtonProps,
  divider: {
    style: 'solid',
    label: '',
    color: '#333355',
  } satisfies DividerProps,
  custom: {
    html: '<h2 style="font-family:sans-serif;text-align:center;padding:40px">Hello World</h2>',
    css: 'body { margin: 0; }',
    js: '',
    height: 200,
  } satisfies CustomProps,
  navbar: {
    brandName: 'bakingo',
    logoIcon: '🎂',
    promoText: 'SPECIAL OFFER: Get FLAT 15% OFF on First Order',
    promoCode: 'WELCOME15',
  } satisfies NavbarProps,
  'product-grid': {
    heading: 'Bestselling Cakes',
    subheading: 'Most Loved Delights',
    products: [],
  } satisfies ProductGridProps,
  'pincode-checker': {
    title: 'Check Delivery Availability',
    placeholder: 'Enter 6-digit Pincode (e.g. 110001)',
  } satisfies PincodeCheckerProps,

  // ── New blocks ────────────────────────────────────────────────────────────────
  testimonials: {
    heading: 'What Our Customers Say',
    subheading: 'Real reviews from happy customers',
    layout: 'grid',
    columns: 3,
    items: [
      { id: '1', name: 'Priya S.', role: 'Verified Customer', avatar: '👩', quote: 'Absolutely delicious! The cake was moist and the delivery was right on time. Will definitely order again.', rating: 5 },
      { id: '2', name: 'Rahul M.', role: 'Verified Customer', avatar: '👨', quote: 'Best birthday cake ever! The design was exactly as shown and tasted even better than expected.', rating: 5 },
      { id: '3', name: 'Anjali K.', role: 'Verified Customer', avatar: '👩‍💼', quote: 'Ordered for my parents\' anniversary. The personalised message on the cake made it extra special!', rating: 5 },
    ],
  } satisfies TestimonialsProps,

  faq: {
    heading: 'Frequently Asked Questions',
    subheading: 'Everything you need to know',
    accentColor: '#7c3aed',
    items: [
      { id: '1', question: 'How far in advance should I order?', answer: 'We recommend ordering at least 24 hours in advance to ensure freshness and proper decoration time. Same-day delivery is available for select cakes.' },
      { id: '2', question: 'Do you offer eggless options?', answer: 'Yes! We have a wide range of eggless cakes that taste just as delicious. Look for the "Eggless" tag on product pages.' },
      { id: '3', question: 'Can I customize the cake message?', answer: 'Absolutely! You can add a personalized message of up to 50 characters during checkout at no extra cost.' },
    ],
  } satisfies FaqProps,

  countdown: {
    heading: '🎉 Flash Sale Ends In',
    subheading: 'Grab 30% OFF on all premium cakes before time runs out!',
    targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#7c3aed',
  } satisfies CountdownProps,

  newsletter: {
    heading: 'Get Sweet Deals in Your Inbox',
    subheading: 'Subscribe for exclusive offers, new flavours, and birthday reminders.',
    buttonLabel: 'Subscribe Now',
    placeholder: 'Enter your email address',
    bgColor: '#7c3aed',
    textColor: '#ffffff',
  } satisfies NewsletterProps,

  video: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    caption: '',
    aspectRatio: '16:9',
    autoplay: false,
    muted: false,
  } satisfies VideoProps,

  pricing: {
    heading: 'Choose Your Plan',
    subheading: 'Start free, scale as you grow',
    plans: [
      {
        id: '1', name: 'Starter', price: '₹0', period: '/month', description: 'Perfect for getting started',
        features: ['1 Page', '5 Blocks', 'Basic templates', 'Community support'],
        ctaLabel: 'Get Started Free', ctaUrl: '#', popular: false, accentColor: '#6b7280',
      },
      {
        id: '2', name: 'Pro', price: '₹999', period: '/month', description: 'For growing businesses',
        features: ['Unlimited Pages', 'All Blocks', 'Premium templates', 'Priority support', 'Custom domain', 'Analytics'],
        ctaLabel: 'Start Pro Trial', ctaUrl: '#', popular: true, accentColor: '#7c3aed',
      },
      {
        id: '3', name: 'Enterprise', price: '₹4999', period: '/month', description: 'For large teams',
        features: ['Everything in Pro', 'Team members', 'White-label', 'Dedicated support', 'SLA guarantee', 'API access'],
        ctaLabel: 'Contact Sales', ctaUrl: '#', popular: false, accentColor: '#0f766e',
      },
    ],
  } satisfies PricingProps,

  gallery: {
    heading: 'Our Gallery',
    columns: 3,
    gap: 'normal',
    images: [
      { id: '1', src: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400', alt: 'Cake 1' },
      { id: '2', src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400', alt: 'Cake 2' },
      { id: '3', src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', alt: 'Cake 3' },
      { id: '4', src: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400', alt: 'Cake 4' },
      { id: '5', src: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400', alt: 'Cake 5' },
      { id: '6', src: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400', alt: 'Cake 6' },
    ],
  } satisfies GalleryProps,

  banner: {
    text: '🎉 Use code WELCOME15 for 15% OFF your first order!',
    linkLabel: 'Order Now',
    linkUrl: '#',
    bgColor: '#7c3aed',
    textColor: '#ffffff',
    dismissible: true,
    icon: '🎁',
  } satisfies BannerProps,

  stats: {
    heading: 'Why Customers Love Us',
    subheading: 'Numbers that speak for themselves',
    bgColor: '#f8fafc',
    textColor: '#111827',
    accentColor: '#7c3aed',
    columns: 4,
    items: [
      { id: '1', value: '10', suffix: 'M+', label: 'Happy Customers', icon: '😊' },
      { id: '2', value: '500', suffix: '+', label: 'Cake Varieties', icon: '🎂' },
      { id: '3', value: '100', suffix: '+', label: 'Cities Delivered', icon: '🏙️' },
      { id: '4', value: '4.8', suffix: '★', label: 'Average Rating', icon: '⭐' },
    ],
  } satisfies StatsProps,

  steps: {
    heading: 'How It Works',
    subheading: 'Order your cake in just 3 easy steps',
    layout: 'horizontal',
    accentColor: '#7c3aed',
    items: [
      { id: '1', title: 'Choose Your Cake', description: 'Browse hundreds of designs and pick the perfect one for your occasion.', icon: '🎂' },
      { id: '2', title: 'Customise & Add Message', description: 'Add a personal message, choose flavour, and pick your delivery slot.', icon: '✏️' },
      { id: '3', title: 'We Deliver Fresh', description: 'Our bakers craft and deliver your cake fresh, right to your door.', icon: '🚀' },
    ],
  } satisfies StepsProps,

  'social-links': {
    heading: 'Follow Us',
    style: 'icon-only',
    align: 'center',
    iconSize: 'md',
    links: [
      { id: '1', platform: 'instagram', url: 'https://instagram.com', label: 'Instagram' },
      { id: '2', platform: 'facebook', url: 'https://facebook.com', label: 'Facebook' },
      { id: '3', platform: 'youtube', url: 'https://youtube.com', label: 'YouTube' },
      { id: '4', platform: 'whatsapp', url: 'https://wa.me', label: 'WhatsApp' },
    ],
  } satisfies SocialLinksProps,

  'rich-html': {
    html: '<div style="padding:32px;text-align:center;font-family:sans-serif">\n  <p>Paste any HTML here — maps, embeds, widgets...</p>\n</div>',
    padding: 'md',
  } satisfies RichHtmlProps,

  // ── Atomic HTML Elements ──────────────────────────────────────────────────────
  heading: {
    text: 'Section Heading Title',
    tag: 'h2',
    fontSize: '32px',
    fontWeight: 'bold',
    textColor: '#111827',
    align: 'left',
    subtitle: 'Optional subtitle or lead paragraph for this section',
  } satisfies HeadingProps,

  flex: {
    direction: 'row',
    wrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
    bgColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: '12px',
    items: [
      { id: '1', title: 'Flex Box Item 1', content: 'Description content inside flex container', icon: '🚀', badge: 'NEW', linkUrl: '#' },
      { id: '2', title: 'Flex Box Item 2', content: 'Description content inside flex container', icon: '⚡', badge: 'PRO', linkUrl: '#' },
      { id: '3', title: 'Flex Box Item 3', content: 'Description content inside flex container', icon: '💎', badge: 'HOT', linkUrl: '#' },
    ],
  } satisfies FlexProps,

  form: {
    title: 'Get In Touch',
    subheading: 'Fill out the form below and we will reach back to you shortly.',
    buttonLabel: 'Send Message',
    successMessage: '🎉 Thank you! Your response has been recorded.',
    accentColor: '#7c3aed',
    bgColor: '#ffffff',
    borderColor: '#e2e8f0',
    fields: [
      { id: '1', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
      { id: '2', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
      { id: '3', label: 'Phone Number', type: 'phone', placeholder: '+91 98765 43210', required: false },
      { id: '4', label: 'Message', type: 'textarea', placeholder: 'How can we help you?', required: true },
    ],
  } satisfies FormProps,

  alert: {
    variant: 'info',
    title: 'Special Announcement',
    message: 'We have updated our service policies and added new features to your dashboard.',
    icon: '💡',
    dismissible: true,
  } satisfies AlertProps,

  badge: {
    text: 'FEATURED RELEASE',
    variant: 'soft',
    icon: '✨',
    bgColor: '#7c3aed',
    textColor: '#7c3aed',
    align: 'center',
    size: 'md',
  } satisfies BadgeProps,
};
