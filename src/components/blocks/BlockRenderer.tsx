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

export default function BlockRenderer({ block }: { block: Block }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = block.props as any;

  switch (block.type) {
    case 'hero':            return <HeroBlock props={p} />;
    case 'text':            return <TextBlock props={p} />;
    case 'image':           return <ImageBlock props={p} />;
    case 'cards':           return <CardGridBlock props={p} />;
    case 'button':          return <ButtonBlock props={p} />;
    case 'divider':         return <DividerBlock props={p} />;
    case 'custom':          return <CustomBlock props={p} />;
    case 'navbar':          return <NavbarBlock props={p} />;
    case 'product-grid':     return <ProductGridBlock props={p} />;
    case 'pincode-checker':  return <PincodeCheckerBlock props={p} />;
    default: return <div style={{ padding: 20, color: '#999' }}>Unknown block: {block.type}</div>;
  }
}
