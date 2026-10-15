import { renderInline } from '../lib/markdown';
import type { Page } from '../lib/page';
import { CtaButtons } from './CtaButtons';

export function Hero({ page }: { page: Pick<Page, 'h1'> & Partial<Pick<Page, 'eyebrow' | 'lede' | 'cta'>> }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
        <h1>{page.h1}</h1>
        {page.lede && <p className="lede" dangerouslySetInnerHTML={{ __html: renderInline(page.lede) }} />}
        {page.cta && <CtaButtons />}
      </div>
    </section>
  );
}
