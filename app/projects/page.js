import { site } from '@/lib/site';
import { projects } from '@/lib/projects';
import ProjectsExplorer from '@/components/ProjectsExplorer';
import EnquiryForm from '@/components/EnquiryForm';
import { Reveal, SplitText, Watermark, FadeIn } from '@/components/motion';
import Link from 'next/link';

export const metadata = {
  title: 'Projects & Available Plots',
  description: `Browse residential, commercial and farm plots from ${site.name}. View sizes, locations, layouts and enquire directly.`,
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="page-hero noise">
        <Watermark variant="dark" position="right" opacity={0.07} />
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span aria-current="page">Projects</span>
          </nav>
          <SplitText as="h1" className="h-xl" text="Available *Plots* & Projects" waitForSite />
          <FadeIn waitForSite delay={0.5}>
            <p className="lead">
              {projects.length} projects across residential, commercial and farm plots. Open any project for its layout, amenities and gallery.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section section--cream noise">
        <Watermark variant="light" position="left" />
        <div className="container">
          <ProjectsExplorer />
        </div>
      </section>

      <section className="section section--dark noise">
        <div className="container grid-2">
          <div>
            <Reveal>
              <span className="eyebrow">Not sure which plot?</span>
            </Reveal>
            <SplitText as="h2" className="h-lg" text="Tell Us Your *Budget* & Location" />
            <Reveal delay={0.1}>
              <p className="lead" style={{ marginTop: 16 }}>
                Share what you need and we will shortlist the best-matching plots and arrange a site visit.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <EnquiryForm source="projects-page" title="Request Plot Details" subtitle="We will call you back with availability and pricing." />
          </Reveal>
        </div>
      </section>
    </>
  );
}
