import laneigeImg from '@/assets/laneigeImg.jpg';
import medicubeImg from '@/assets/medicubeImg.jpg';
import cosrxImg from '@/assets/cosrxImg.jpg';
import jeansImg from '@/assets/jeansImg.jpg';
import hanesImg from '@/assets/hanesImg.jpg';
import stanleyImg from '@/assets/stanleyImg.jpg';
import sojosImg from '@/assets/sojosImg.jpg';
import adidasImg from '@/assets/adidasImg.jpg';
import airpodsImg from '@/assets/airpodsImg.jpg';
import firestickImg from '@/assets/firestickImg.jpg';
import sonywh from '@/assets/sonywh.jpg';
import beatspill from '@/assets/beatspill.jpg';
import appletag from '@/assets/appletag.jpg';
import AnkerCharger from '@/assets/AnkerCharger.jpg';
import LogitechMouse from '@/assets/LogitechMouse.jpg';
import JBLspeaker from '@/assets/JBLspeaker.jpg';
import HydroFlask from '@/assets/HydroFlask.jpg';
import Kindle from '@/assets/Kindle.jpg';
import ringbell from '@/assets/ringbell.jpg';
import blinkmini from '@/assets/blinkmini.jpg';
import FilmCamera from '@/assets/FilmCamera.jpg';
export type Product = {id:number;title:string;description:string;source:string;category:string;rating:number;image:string;link:string;badge?:string};
export const products:Product[] = [...[
  {
    id: 1,
    title: 'LANEIGE Lip Glowy Balm',
    description: 'Lightweight, moisture-coating lip balm for hydrated and tinted lips throughout the day.',
    source: 'Amazon',
    category: 'Beauty & Skincare',
    rating: 4.7,
    image: laneigeImg,
    link: 'https://amzn.to/3N7smtE'
  },
  {
    id: 2,
    title: 'Medicube Deep Vita C Toner Pads',
    description: 'Vitamin-rich pads for uneven skin tone and texture. Deeply hydrating and resurfacing.',
    source: 'Amazon',
    category: 'Beauty & Skincare',
    badge: 'New',
    rating: 4.8,
    image: medicubeImg,
    link: 'https://amzn.to/4aPUGtS'
  },
  {
    id: 3,
    title: 'COSRX Glass Skin Starter Set',
    description: 'Exclusive kit featuring Snail Mucin 96% Essence and Retinol 0.1% Cream for radiant skin.',
    source: 'Amazon',
    category: 'Beauty & Skincare',
    badge: 'Trending',
    rating: 4.8,
    image: cosrxImg,
    link: 'https://amzn.to/4bkqUNX' 
  },
  {
    id: 4,
    title: 'Levi\'s Women\'s Cinch Baggy Jeans',
    description: 'Relaxed fit jeans with a cinched waist for a trendy, comfortable look.',
    source: 'Amazon',
    category: 'Fashion',
    badge: 'Best Seller',
    rating: 4.3,
    image: jeansImg,
    link: 'https://amzn.to/4rhXG7d'
  },
  {
    id: 5,
    title: 'Hanes Men\'s EcoSmart Hoodie Midweight Fleece',
    description: 'Comfortable and eco-friendly hoodie made with up to 5% recycled polyester.',
    source: 'Amazon',
    category: 'Fashion',
    badge: 'Trending',
    rating: 4.5,
    image: hanesImg,
    link: 'https://amzn.to/4b7AdiX'
  },
  {
      id: 6,
      title: 'STANLEY Quencher H2.0 Tumbler',
      description: 'STANLEY Quencher H2.0 Tumbler with Handle and Straw 30 oz | Flowstate 3-Position Lid ',
      source: 'Amazon',
      category: 'Kitchen',
      badge: 'Trending',
      rating: 4.7,
      image: stanleyImg,
      link: 'https://amzn.to/4sv7J9S', 
  },
  {
      id: 7,
      title: 'SOJOS Retro Aviator Sunglasses for Women Men',
      description: 'Classic 70s style oversized aviator sunglasses featuring a durable metal frame and UV400 protected lenses. Perfect for driving, travel, and daily fashion wear with a comfortable lightweight design',
      source: 'Amazon',
      category: 'Fashion',
      badge: 'Best Seller',
      rating: 4.6,
      image: sojosImg,
      link: 'https://amzn.to/40iG8wI',
  
  },    
  {
      id: 8,
      title: 'Adidas Women\'s VL Court 3.0 Sneaker',
      description: 'A classic skate-inspired sneaker featuring a premium suede upper and iconic 3-stripe design. Built with a vulcanized rubber outsole for flexibility and a cushioned sockliner for all-day comfort.',
      source: 'Amazon',
      category: 'Fashion',
      badge: 'New',
      rating: 4.5,
      image: adidasImg,
      link: 'https://amzn.to/3MTx9PA', 
  },
], ...[
    {
      id: 1,
      title: 'Apple AirPods Pro 2 (USB-C)',
      description: 'Pro-level Active Noise Cancellation with H2 Chip, Personalized Spatial Audio, and 30 hours of battery life.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.6,
      image: airpodsImg, 
      link: 'https://amzn.to/4leJPNI'
    },
    {
      id: 2,
      title: 'Amazon Fire Stick HD',
      description: 'Stream your favorite content on Netflix, Prime Video, Disney+ in Full HD with the Amazon Fire Stick HD. Enjoy access to thousands of apps, Alexa voice control, and a user-friendly interface.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.7,
      image: firestickImg,
      link: 'https://amzn.to/4uhz01l'
    },
    {
      id: 3,
      title: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
      description: 'Industry-leading noise cancellation, 30-hour battery life, and premium sound quality.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.6,
      image: sonywh,
      link: 'https://amzn.to/4b7r4Iw'
    },
    {
      id: 4,
      title: 'Beats Pill - Wireless Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with powerful sound and a sleek design.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.7,
      image: beatspill,
      link: 'https://amzn.to/4cIIhsY'         
    },
    {
      id: 5,
      title: 'Apple AirTag (2nd Generation)',
      description: 'Keep track of your belongings with Apple AirTag. Precision tracking, water resistance, and seamless integration with the Find My network.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.6,
      image: appletag,
      link: 'https://amzn.to/3RGfyg0' 
    },
    {
      id: 6,
      title: 'Anker Portable Charger',
      description: 'High-capacity portable charger with fast charging technology for on-the-go power.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.6,
      image: AnkerCharger,
      link: 'https://amzn.to/4x6bK7W'
    },
    {
      id: 7,
      title: 'Logitech Pebble Wireless Mouse',
      description: 'Sleek and silent wireless mouse with dual connectivity and long battery life.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.6,
      image: LogitechMouse,
      link: 'https://amzn.to/4vnL1Sz'
    },
    {
      id: 8,
      title: 'JBL Go 4 Portable Bluetooth Speaker',
      description: 'Compact and waterproof Bluetooth speaker with vibrant sound and a built-in microphone.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.7,
      image: JBLspeaker,
      link: 'https://amzn.to/3PYqNj9'
    },
    {
      id: 9,
      title: 'Hydro Flask / Owala Water Bottle',
      description: 'Durable and insulated water bottle to keep your drinks cold or hot for hours.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.8,
      image: HydroFlask,
      link: 'https://amzn.to/3PZt7jN'
    },
    {
      id: 10,
      title: 'Kindle Paperwhite',
      description: 'Waterproof e-reader with a high-resolution display and adjustable warm light for a comfortable reading experience.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.7,
      image: Kindle,
      link: 'https://amzn.to/4oeEZRV'
    },
    {
      id: 11,
      title: 'Ring Video Doorbell',
      description: 'Keep your home safe with the Ring Video Doorbell. See, hear, and speak to visitors from your phone.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.5,
      image: ringbell,
      link: 'https://amzn.to/4vpsh51'
    },
    {
      id: 12,
      title: 'Blink Mini Indoor Security Camera',
      description: 'Compact wireless indoor camera with two-way audio and motion detection.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.6,
      image: blinkmini,
      link: 'https://amzn.to/4cIIhsY'
    },
    {
      id: 13,
      title: 'Fujifilm Instax Mini 12 Camera',
      description: 'Instant camera that produces credit-card-sized prints with a retro design.',
      source: 'Amazon', category: 'Electronics',
      rating: 4.6,
      image: FilmCamera,
      link: 'https://amzn.to/4b7r4Iw'
    }
]].map((product,index)=>({...product,id:index+1}));
