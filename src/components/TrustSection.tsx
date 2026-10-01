import { motion } from 'framer-motion';
import { Shield, Award, Users, Clock, CheckCircle, Lock } from 'lucide-react';

const TrustSection = () => {
  const trustIndicators = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All payments are encrypted and secure'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Premium products and services'
    },
    {
      icon: Users,
      title: '500+ Clients',
      description: 'Trusted by creators worldwide'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always here to help you'
    },
    {
      icon: CheckCircle,
      title: 'Verified Products',
      description: 'All items are authentic and verified'
    },
    {
      icon: Lock,
      title: 'Privacy Protected',
      description: 'Your data is always secure'
    }
  ];

  return (
    <section className="py-16 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Why Choose <span className="text-primary">Us</span>
          </h2>
          <p className="text-muted-foreground">Trusted by hundreds of satisfied customers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {trustIndicators.map((item, index) => {
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
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <IconComponent className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
