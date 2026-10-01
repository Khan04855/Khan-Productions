import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Books from '@/components/Books';

export default function Library() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen pt-20">
        <section className="resource-hero relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <img
              src="/tool-backgrounds/books-library.png"
              alt=""
              fetchPriority="high"
              className="h-full w-full object-cover object-right"
            />
            <div className="hero-shade absolute inset-0" />
          </div>

          <div className="section-inner py-12 sm:py-16">
            <Link to="/" className="secondary-action">
              ← Back to Store
            </Link>

            <p className="eyebrow mt-8">Read & discover</p>

            <h1 className="max-w-xl text-3xl font-bold sm:text-4xl">
              Khan Productions Library
            </h1>

            <p className="mt-4 max-w-lg text-muted-foreground">
              Explore books by title, author or genre.
              Find your next read in our collection.
            </p>
          </div>
        </section>

        <Books />
      </main>

      <Footer />
    </>
  );
}