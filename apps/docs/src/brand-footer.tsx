import { LinkGroup } from '../../../packages/ui/src/index';
import './brand-footer.css';

// Copy and route fragments follow the local CRYSOUND website prototype.
const groups = [
  { label: 'About Us', items: [
    { label: 'About Us', href: '#why-crysound' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Terms of Service', href: '#top' },
    { label: 'Shipping Policy', href: '#top' },
    { label: 'Refund & Return Policy', href: '#top' },
  ] },
  { label: 'Resources', items: [
    { label: 'Download', href: '#downloads/all' },
    { label: 'Blogs', href: '#blogs/all' },
    { label: 'Events', href: '#events/all' },
  ] },
  { label: 'Support', items: [
    { label: 'Technical Support', href: '#technical-support' },
    { label: 'Warranty', href: '#warranty' },
  ] },
  { label: 'Contact Us', items: [
    { label: 'info@crysound.com', href: 'mailto:info@crysound.com' },
    { label: 'Become a Distributor', href: '#become-a-distributor' },
    { label: 'Affiliate Program', href: '#contact' },
  ] },
];

export function BrandFooter({ siteUrl }: { siteUrl: string }) {
  return <footer className="scene-brand-footer">
    <div className="scene-brand-footer-inner">
      <div className="scene-brand-footer-intro">
        <h3>Measure Sound Better</h3>
        <p>At CRYSOUND, we blend precision with passion. With over 25 years of experience in delivering high-quality acoustic measurement products, we are dedicated to providing advanced solutions that empower users to be the champions of audio test and detection solutions.</p>
      </div>
      {groups.map(group => <LinkGroup key={group.label} className="scene-brand-footer-column" label={group.label} items={group.items.map(item => ({
        label: item.label,
        href: item.href.startsWith('mailto:') ? item.href : siteUrl + item.href,
        target: item.href.startsWith('mailto:') ? undefined : '_blank',
      }))} />)}
      <div className="scene-brand-footer-bottom">
        <small>© 2024 Crysound.</small>
        <nav className="scene-brand-footer-socials" aria-label="Social media">
          <a href={siteUrl + '#contact'} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><span className="scene-brand-footer-facebook" aria-hidden="true"><span>f</span></span></a>
          <a href={siteUrl + '#contact'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><span className="scene-brand-footer-linkedin" aria-hidden="true"><span>in</span></span></a>
          <a href={siteUrl + '#contact'} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="5" fill="currentColor"/><path d="m10 8 6 4-6 4Z" fill="var(--scene-footer-social-fill)"/></svg></a>
        </nav>
      </div>
    </div>
  </footer>;
}
