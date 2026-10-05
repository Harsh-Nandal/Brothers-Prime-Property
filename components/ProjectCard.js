'use client';

/** ProjectCard — a TiltCard with the project art / photo, badges and details. */
import Image from 'next/image';
import Link from 'next/link';
import TiltCard from '@/components/TiltCard';
import PlotArt from '@/components/PlotArt';
import { ArrowRight, Pin } from '@/components/Icons';

export default function ProjectCard({ project, index = 0, dark = false }) {
  const { slug, name, type, location, sizeRange, status, hue, images } = project;
  const sold = status === 'Sold Out';
  return (
    <TiltCard>
      <Link href={`/projects/${slug}`} className={`pcard${dark ? ' pcard--dark' : ''}`} aria-label={`${name} — view details`}>
        <div className="pcard__art">
          {images?.length ? (
            <Image src={images[0]} alt={`${name} plots`} fill sizes="(max-width: 760px) 90vw, 33vw" style={{ objectFit: 'cover' }} />
          ) : (
            <PlotArt seed={index + 1} hue={hue} label={`Illustration of ${name}`} />
          )}
          <span className={`pcard__badge${sold ? ' pcard__badge--sold' : ''} depth-2`}>{status}</span>
        </div>
        <div className="pcard__body">
          <div className="pcard__type depth-1">{type}</div>
          <h3 className="depth-1">{name}</h3>
          <div className="pcard__loc">
            <Pin width={16} height={16} /> {location}
          </div>
          <div className="pcard__meta">
            <span>
              <b>{sizeRange}</b>
            </span>
            <span className="pcard__go">
              Details <ArrowRight width={18} height={18} />
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
