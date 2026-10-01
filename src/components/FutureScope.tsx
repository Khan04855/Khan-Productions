import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Film, Palette, Brain, Rocket, Globe } from 'lucide-react';

const FutureScope = () => {
  const futureProjects = [
    {
      icon: Gamepad2,
      title: 'Game Development',
      description: 'Creating immersive gaming experiences with cutting-edge technology and creative storytelling.',
      status: 'Coming 2025',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Film,
      title: 'Advanced Video Production',
      description: 'Professional video editing and production services with AI-powered tools.',
      status: 'In Development',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      icon: Palette,
      title: 'Creative Design Studio',
      description: 'Full-service design agency offering branding, UI/UX, and marketing materials.',
      status: 'Q2 2025',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Solutions',
      description: 'Intelligent automation tools for content creation, analysis, and business optimization.',
      status: 'Beta Testing',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Global Marketplace',
      description: 'Expanding our affiliate marketplace to serve customers worldwide with localized support.',
      status: 'Expanding',
      gradient: 'from-amber-500 to-yellow-500'
    },
    {
      icon: Rocket,
      title: 'Startup Incubator',
      description: 'Supporting aspiring entrepreneurs with tools, mentorship, and resources.',
      status: 'Planning Phase',
      gradient: 'from-indigo-500 to-violet-500'
    }
  ];

  return (
    <section id="future" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">What's Next</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Future <span className="text-primary">Scope</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Khan Productions is constantly evolving. Here's a glimpse into the exciting projects 
            and expansions we're working on to better serve our global community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {futureProjects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover-lift elevated gradient-card border-0 h-full group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-card-foreground">
                        {project.title}
                      </CardTitle>
                      <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full font-medium">
                        {project.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FutureScope;
