import { ArrowUpRight } from 'lucide-react';

const resources = [
  {
    title: 'Digital Tools',
    description:
      'Image editing, PDF utilities and code execution, organised by task.',
    href: '/tools',
    image: '/cards/digital-tools.png',
  },
  {
    title: 'Books Library',
    description:
      'Find books by title, author or genre in our separate library.',
    href: '/library',
    image: '/cards/books-library.png',
  },
  {
    title: 'Music Library',
    description:
      'Browse tracks, listen to previews and save your favourites.',
    href: '/music-library',
    image: '/cards/music-library.png',
  },
];

export default function ResourceLinks() {
  return (
    <section id="resources" className="section-shell">
      <div className="section-inner">
        <p className="eyebrow">More from Khan Productions</p>

        <h2 className="section-heading">Tools & libraries</h2>

        <p className="section-description">
          Visit a dedicated space for your task.
          Each link opens in a new tab.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {resources.map(resource => (
            <a
              key={resource.href}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
            >
              {/* Same-height image area for all three cards */}
              <div className="flex h-52 shrink-0 items-center justify-center bg-muted/30 p-6 sm:h-60">
                <img
                  src={resource.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold">
                  {resource.title}
                </h3>

                <p className="mb-6 mt-3 text-sm leading-relaxed text-muted-foreground">
                  {resource.description}
                </p>

                <span className="mt-auto flex items-center gap-2 font-semibold text-primary">
                  Explore
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>

                <span className="mt-2 text-xs text-muted-foreground">
                  Opens in a new tab
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}