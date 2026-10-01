import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, FileCheck, Users, Scale } from 'lucide-react';

const SecurityEthics = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All sensitive data is encrypted using industry-standard AES-256 encryption protocols.'
    },
    {
      icon: Shield,
      title: 'Secure Payment Gateway',
      description: 'Payments are processed through trusted and PCI-DSS compliant payment providers.'
    },
    {
      icon: Eye,
      title: 'Privacy First',
      description: 'We never sell or share your personal information with third parties.'
    }
  ];

  const ethicalPrinciples = [
    {
      icon: FileCheck,
      title: 'Transparency',
      description: 'Clear pricing, honest reviews, and no hidden fees or terms.'
    },
    {
      icon: Users,
      title: 'Accessibility',
      description: 'Making premium tools and resources accessible to everyone, regardless of location.'
    },
    {
      icon: Scale,
      title: 'Fair Business Practices',
      description: 'Ethical partnerships, authentic products, and customer-first policies.'
    }
  ];

  return (
    <section id="security" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Commitment</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Security & <span className="text-primary">Ethics</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We prioritize your security and uphold the highest ethical standards in everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-secondary" />
              Security Measures
            </h3>
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="elevated gradient-card border-0">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-secondary" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-card-foreground">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Ethics Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              Ethical Principles
            </h3>
            <div className="space-y-4">
              {ethicalPrinciples.map((principle, index) => {
                const IconComponent = principle.icon;
                return (
                  <Card key={index} className="elevated gradient-card border-0">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-card-foreground">
                          {principle.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{principle.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Compliance Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">Compliant with international standards</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['GDPR Compliant', 'SSL Secured', 'Privacy Policy', 'Terms of Service'].map((badge, index) => (
              <span key={index} className="bg-muted px-4 py-2 rounded-full text-sm font-medium text-muted-foreground">
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecurityEthics;
