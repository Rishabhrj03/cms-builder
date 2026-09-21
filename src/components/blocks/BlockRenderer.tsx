import { Block } from '@/types/Block';
import HeroBlock from './HeroBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import CardGridBlock from './CardGridBlock';
import ButtonBlock from './ButtonBlock';
import DividerBlock from './DividerBlock';
import CustomBlock from './CustomBlock';
import NavbarBlock from './NavbarBlock';
import ProductGridBlock from './ProductGridBlock';
import PincodeCheckerBlock from './PincodeCheckerBlock';
// New blocks
import TestimonialsBlock from './TestimonialsBlock';
import FaqBlock from './FaqBlock';
import CountdownBlock from './CountdownBlock';
import NewsletterBlock from './NewsletterBlock';
import VideoBlock from './VideoBlock';
import PricingBlock from './PricingBlock';
import GalleryBlock from './GalleryBlock';
import BannerBlock from './BannerBlock';
import StatsBlock from './StatsBlock';
import StepsBlock from './StepsBlock';
import SocialLinksBlock from './SocialLinksBlock';
import RichHtmlBlock from './RichHtmlBlock';
// Atomic HTML elements
import HeadingBlock from './HeadingBlock';
import FlexBlock from './FlexBlock';
import FormBlock from './FormBlock';
import AlertBlock from './AlertBlock';
import BadgeBlock from './BadgeBlock';

export default function BlockRenderer({ block }: { block: Block }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = block.props as any;

  // Section Layout Props
  const containerWidth = p.containerWidth ?? 'default';
  const customWidth = p.customWidth;
  const sectionPadding = p.sectionPadding ?? 'none';
  const sectionBgColor = p.sectionBgColor;

  const widthMap: Record<string, string> = {
    narrow: '768px',
    medium: '1000px',
    default: '1200px',
    boxed: '1200px',
    wide: '1440px',
    full: '100%',
  };

  const paddingMap: Record<string, string> = {
    none: '0px',
    sm: '24px 16px',
    md: '48px 20px',
    lg: '80px 24px',
    xl: '120px 32px',
  };

  const isFullWidthBlock = block.type === 'hero' || block.type === 'navbar' || block.type === 'banner' || block.type === 'newsletter';

  let targetWidth = '1200px';
  if (customWidth && typeof customWidth === 'string' && customWidth.trim()) {
    const trimmed = customWidth.trim();
    targetWidth = /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
  } else if (containerWidth !== 'default') {
    targetWidth = widthMap[containerWidth] ?? '1200px';
  } else if (isFullWidthBlock) {
    targetWidth = '100%';
  }

  const targetPadding = sectionPadding !== 'none' ? (paddingMap[sectionPadding] ?? '0px') : '0px';

  const renderContent = () => {
    switch (block.type) {
      // Original blocks
      case 'hero':             return <HeroBlock props={p} />;
      case 'text':             return <TextBlock props={p} />;
      case 'image':            return <ImageBlock props={p} />;
      case 'cards':            return <CardGridBlock props={p} />;
      case 'button':           return <ButtonBlock props={p} />;
      case 'divider':          return <DividerBlock props={p} />;
      case 'custom':           return <CustomBlock props={p} />;
      case 'navbar':           return <NavbarBlock props={p} />;
      case 'product-grid':     return <ProductGridBlock props={p} />;
      case 'pincode-checker':  return <PincodeCheckerBlock props={p} />;
      // New blocks
      case 'testimonials':     return <TestimonialsBlock props={p} />;
      case 'faq':              return <FaqBlock props={p} />;
      case 'countdown':        return <CountdownBlock props={p} />;
      case 'newsletter':       return <NewsletterBlock props={p} />;
      case 'video':            return <VideoBlock props={p} />;
      case 'pricing':          return <PricingBlock props={p} />;
      case 'gallery':          return <GalleryBlock props={p} />;
      case 'banner':           return <BannerBlock props={p} />;
      case 'stats':            return <StatsBlock props={p} />;
      case 'steps':            return <StepsBlock props={p} />;
      case 'social-links':     return <SocialLinksBlock props={p} />;
      case 'rich-html':        return <RichHtmlBlock props={p} />;
      // Atomic HTML elements
      case 'heading':          return <HeadingBlock props={p} />;
      case 'flex':             return <FlexBlock props={p} />;
      case 'form':             return <FormBlock props={p} />;
      case 'alert':            return <AlertBlock props={p} />;
      case 'badge':            return <BadgeBlock props={p} />;
      default:
        return <div style={{ padding: 20, color: '#999', textAlign: 'center' }}>Unknown block: {block.type}</div>;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: sectionBgColor || undefined,
        padding: targetPadding,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: targetWidth,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
