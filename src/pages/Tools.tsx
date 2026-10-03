import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Services from '@/components/Services';
import { publicAsset } from '@/lib/public-asset';

export default function Tools() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen pt-20">
        <section className="resource-hero relative isolate overflow-hidden">
          {/* Tools page background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <img
              src={publicAsset('tool-backgrounds/tools-dashboard.png')}
              alt=""
              loading="eager"
              className="h-full w-full object-cover object-right"
            />

            {/* Existing light/dark overlay */}
            <div className="hero-shade absolute inset-0" />
          </div>

          <div className="section-inner py-12 sm:py-20">
            <Link to="/" className="secondary-action">
              ← Back to Store
            </Link>

            <p className="eyebrow mt-8">
              Khan Productions Tools
            </p>

            <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Practical tools.
              <br />
              One organised space.
            </h1>

            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              Edit images, organise PDFs and run code.
              Choose a tool below to get started.
            </p>

            <a href="#services" className="action mt-7">
              Explore tools ↓
            </a>
          </div>
        </section>

        {/* Existing grouped tool cards */}
        <Services />
      </main>

      <Footer />
    </>
  );
}