'use client';

/** ProjectsExplorer — animated filter chips + a re-flowing grid of tilt cards. */
import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import { projects, projectTypes } from '@/lib/projects';

export default function ProjectsExplorer() {
  const [type, setType] = useState('All');
  const list = projects.filter((p) => type === 'All' || p.type === type);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects by type">
        {projectTypes.map((t) => (
          <button key={t} className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>
      <LayoutGroup>
        <motion.div layout className="grid-3" style={{ alignItems: 'stretch' }}>
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={p} index={projects.indexOf(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </>
  );
}
