import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { publicAsset } from '@/lib/public-asset';

const groups = [
  {
    name: 'Image Tools',
    image: '/categories/image-tools.png',
    tools: [
      {
        name: 'Background Remover',
        description: 'Turn image backgrounds transparent.',
        url: '/background-remover',
      },
      {
        name: 'Image Converter & Compressor',
        description: 'Convert formats and compress images to a target KB or MB size.',
        url: '/image-tools',
      },
    ],
  },
  {
    name: 'Document Tools',
    image: '/categories/document-tools.png',
    tools: [
      {
        name: 'PDF Toolkit',
        description: 'Merge, extract, reorder, rotate and optimise PDFs.',
        url: '/pdf-toolkit',
      },
    ],
  },
  {
    name: 'Developer Tools',
    image: '/categories/developer-tools.png',
    tools: [
      {
        name: 'Code Compiler',
        description: 'Run code in five supported languages.',
        url: '/compiler',
      },
    ],
  },
  {
    name: 'Audio Resources',
    image: '/categories/audio-resources.png',
    tools: [
      {
        name: 'Music Library',
        description: 'Browse tracks, preview audio and save favourites.',
        url: '/music-library',
      },
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="section-shell">
      <div className="section-inner">
        <p className="eyebrow">Create & work</p>

        <h2 className="section-heading">Find the right tool</h2>

        <p className="section-description">
          Choose by task. Each tool keeps its inputs,
          settings and results together.
        </p>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {groups.map(group => (
            <section
              key={group.name}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              {/* Category visual and heading */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center">
                  <img
                    src={publicAsset(group.image)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                </div>

                <h3 className="min-w-0 text-lg font-semibold sm:text-xl">
                  {group.name}
                </h3>
              </div>

              {/* Tools belonging to this category */}
              <div className="space-y-3">
                {group.tools.map(tool => (
                  <Link
                    key={tool.url}
                    to={tool.url}
                    className="group flex items-start justify-between gap-3 rounded-xl bg-muted/60 p-4 transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold">
                        {tool.name}
                      </h4>

                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary"
                    />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}