import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for individual creators',
      price: 'Custom',
      features: [
        'CapCut Pro - Rs. 1000 per month',
        'Canva Pro - Rs. 500 per year warranty',
        'Basic support',
        'Regular updates'
      ],
      popular: false,
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Premium',
      description: 'Advanced tools for professionals',
      price: 'Contact',
      features: [
        'All Basic features',
        'Premium tool access',
        'Priority support',
        'Advanced tutorials',
        'Exclusive resources'
      ],
      popular: true,
      gradient: 'from-red-600 to-pink-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  const handlePurchase = (planName: string) => {
    const email = 'khanproductions7867@gmail.com';
    const subject = `Purchase ${planName} Plan`;
    const body = `Hello KhanProductions, I want to buy the ${planName} Plan.`;
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Prices</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your creative journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants} className="flex-1 min-w-[300px] max-w-[400px]">
              <Card className={`hover-lift elevated gradient-card border-0 overflow-hidden relative ${plan.popular ? 'ring-2 ring-primary glow-red' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      POPULAR
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="text-4xl font-bold text-card-foreground">
                    {plan.price}
                    {plan.price !== 'Contact' && <span className="text-lg text-muted-foreground">/month</span>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-card-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePurchase(plan.name)}
                    className={`w-full ${plan.popular ? 'gradient-red glow-red hover:glow-red' : 'gradient-blue glow-blue hover:glow-blue'} text-white font-semibold py-3`}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;