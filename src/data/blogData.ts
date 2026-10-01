export interface BlogPost {
  id: number;
  title: string;
  caption: string;
  image: string;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'A vision of the future',
    caption: 'Where Khan Productions is heading.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    content: 'Khan Productions is constantly evolving, embracing new technologies and innovative solutions to stay ahead of the curve.'
  },
  {
    id: 2,
    title: 'Powering innovation',
    caption: 'With code and creativity.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    content: 'We combine cutting-edge technology with creative excellence to deliver solutions that make a real difference.'
  },
  {
    id: 3,
    title: 'Game Development',
    caption: 'Our next frontier in entertainment.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    content: 'Expanding into game development, we aim to create immersive experiences that captivate and inspire players worldwide.'
  },
  {
    id: 4,
    title: 'Creative Tools',
    caption: 'Designing tomorrow with advanced solutions.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    content: 'Our suite of creative tools empowers designers, editors, and creators to bring their visions to life with unprecedented ease.'
  },
  {
    id: 5,
    title: 'Global Empowerment',
    caption: 'Khan Productions — empowering people across the globe.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    content: 'From local communities to global markets, we strive to make premium tools and resources accessible to everyone.'
  },
  {
    id: 6,
    title: 'AI Innovation',
    caption: 'Blending human creativity with artificial intelligence.',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80',
    content: 'The future of creativity lies in the seamless integration of human ingenuity and artificial intelligence capabilities.'
  }
];