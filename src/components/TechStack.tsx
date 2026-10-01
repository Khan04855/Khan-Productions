import { motion } from 'framer-motion';
import { Code2, Database, Cloud, Smartphone, Monitor, Cpu } from 'lucide-react';

const TechStack = () => {
  const technologies = [
    {
      category: 'Frontend',
      icon: Monitor,
      items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      color: 'text-blue-500'
    },
    {
      category: 'Backend',
      icon: Database,
      items: ['Node.js', 'Express', 'REST APIs', 'Serverless'],
      color: 'text-green-500'
    },
    {
      category: 'Cloud Services',
      icon: Cloud,
      items: ['AWS', 'Vercel', 'Supabase', 'CDN'],
      color: 'text-purple-500'
    },
    {
      category: 'Mobile',
      icon: Smartphone,
      items: ['React Native', 'PWA', 'Responsive Design'],
      color: 'text-orange-500'
    },
    {
      category: 'Tools',
      icon: Code2,
      items: ['Git', 'VS Code', 'Figma', 'Adobe Suite'],
      color: 'text-cyan-500'
    },
    {
      category: 'AI/ML',
      icon: Cpu,
      items: ['OpenAI', 'TensorFlow', 'Computer Vision'],
      color: 'text-pink-500'
    }
  ];

  return (
    <section id="tech-stack" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Technology</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Technology <span className="text-primary">Stack</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built with modern, scalable, and industry-standard technologies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 elevated gradient-card border-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className={`h-8 w-8 ${tech.color}`} />
                  <h3 className="text-xl font-bold text-card-foreground">{tech.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tech.items.map((item, i) => (
                    <span 
                      key={i} 
                      className="bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tech Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 flex-wrap justify-center bg-card/50 backdrop-blur-sm rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">&lt;2s</div>
              <div className="text-sm text-muted-foreground">Load Time</div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">A+</div>
              <div className="text-sm text-muted-foreground">Security Grade</div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">100%</div>
              <div className="text-sm text-muted-foreground">Responsive</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
