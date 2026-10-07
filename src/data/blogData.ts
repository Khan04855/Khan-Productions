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
    image: '/blog-images/blog-1.jpg',
    content: 'Khan Productions is constantly evolving, embracing new technologies and innovative solutions to stay ahead of the curve.'
  },
  {
    id: 2,
    title: 'Powering innovation',
    caption: 'With code and creativity.',
    image: '/blog-images/blog-2.jpg',
    content: 'We combine cutting-edge technology with creative excellence to deliver solutions that make a real difference.'
  },
  {
    id: 3,
    title: 'Game Development',
    caption: 'Our next frontier in entertainment.',
    image: '/blog-images/blog-3.jpg',
    content: 'Expanding into game development, we aim to create immersive experiences that captivate and inspire players worldwide.'
  },
  {
    id: 4,
    title: 'Creative Tools',
    caption: 'Designing tomorrow with advanced solutions.',
    image: '/blog-images/blog-4.jpg',
    content: 'Our suite of creative tools empowers designers, editors, and creators to bring their visions to life with unprecedented ease.'
  },
  {
    id: 5,
    title: 'Global Empowerment',
    caption: 'Khan Productions — empowering people across the globe.',
    image: '/blog-images/blog-5.jpg',
    content: 'From local communities to global markets, we strive to make premium tools and resources accessible to everyone.'
  },
  {
    id: 6,
    title: 'AI Innovation',
    caption: 'Blending human creativity with artificial intelligence.',
    image: '/blog-images/blog-6.jpg',
    content: 'The future of creativity lies in the seamless integration of human ingenuity and artificial intelligence capabilities.'
  }
];