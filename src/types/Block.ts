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
  | 'pincode-checker';

// ─── Per-block prop shapes ────────────────────────────────────────────────────

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
  | PincodeCheckerProps;

// ─── Block instance ───────────────────────────────────────────────────────────

export interface Block {
  id: string;
  type: BlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  order: number;
}

// ─── Default props factory ────────────────────────────────────────────────────

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
};
