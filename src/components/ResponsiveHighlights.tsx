import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Zap, Eye, MousePointer } from 'lucide-react';

const ResponsiveHighlights = () => {
  const highlights = [
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Optimized for touch interfaces and mobile browsing'
    },
    {
      icon: Tablet,
      title: 'Tablet Ready',
      description: 'Perfect layout adaptation for medium-sized screens'
    },
    {
      icon: Monitor,
      title: 'Desktop Optimized',
      description: 'Full-featured experience on larger displays'
    },
    {
      icon: Zap,
      title: 'Fast Loading',
      description: 'Optimized assets and lazy loading for speed'
    },
    {
      icon: Eye,
      title: 'Accessibility',
      description: 'WCAG compliant with screen reader support'
    },
    {
      icon: MousePointer,
      title: 'Interactive',
      description: 'Smooth animations and micro-interactions'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-khan-dark via-khan-blue-dark to-khan-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Responsive <span className="text-primary">Design</span>
          </h2>
          <p className="text-white/70">Beautiful experience on every device</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {highlights.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors border border-white/10">
                  <IconComponent className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-white/60 text-xs">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Device Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center items-end gap-4"
        >
          <div className="w-12 h-20 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-white/60" />
          </div>
          <div className="w-20 h-28 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
            <Tablet className="h-8 w-8 text-white/60" />
          </div>
          <div className="w-32 h-24 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
            <Monitor className="h-10 w-10 text-white/60" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResponsiveHighlights;
