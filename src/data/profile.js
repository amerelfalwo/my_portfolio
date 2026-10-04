/**
 * @file profile.js
 * @description Single source of truth for Amir Elrefai's personal and professional profile.
 */

export const profile = {
  name: 'Amir Elrefai',
  nameArabic: 'أمير الرفاعي',
  alternateName: 'Amir Elfalw',
  title: 'AI Engineer & Systems Analyst',
  tagline: 'Architecting high-performance Deep Learning, Computer Vision, and Autonomous Agent systems with production-grade Clean Architecture.',
  status: {
    available: true,
    message: 'Available for impactful AI & Systems roles',
    locations: 'Remote / Hybrid / Onsite',
  },
  bio: {
    short: 'AI Engineer and Systems Analyst specializing in Deep Learning, Computer Vision, and Generative AI. Combining domain-driven architecture with scalable neural systems.',
    extended: [
      'As an AI Engineer & Systems Analyst, my focus is bridging the gap between cutting-edge neural architectures and robust, maintainable production software. Rather than treating models as isolated scripts, I design complete systems with clean architectural boundaries, automated evaluation, and resilient deployment pipelines.',
      'My technical expertise centers on deep learning for computer vision (medical imaging segmentation, anomaly detection), Generative AI (hierarchical vectorless RAG, autonomous agents with tool-calling), and high-performance backend systems (.NET 8, FastAPI, PostgreSQL).',
      'I hold a B.Sc. in Computer and Information Sciences with "Very Good" honors from Mansoura University (2026) and actively engineer next-generation Generative Engine Optimization (GEO) pipelines at FlyRank AI.'
    ],
  },
  keyMetrics: [
    {
      value: '9+',
      label: 'Production Systems',
      description: 'End-to-end architectures across Medical AI, RAG, and .NET 8 ERP'
    },
    {
      value: '2+',
      label: 'Years Specialization',
      description: 'Focused production engineering in PyTorch, Computer Vision & MLOps'
    },
    {
      value: 'Honors',
      label: 'Academic Standing',
      description: 'Mansoura University IT Major, "Very Good" Honors (2026)'
    }
  ],
  links: {
    github: 'https://github.com/amerelfalwo',
    linkedin: 'https://www.linkedin.com/in/amir-elrefai-b3a3212b8/?isSelfProfile=true',
    facebook: 'https://www.facebook.com/amir.elref3i',
    instagram: 'https://www.instagram.com/amir.elref3i/',
    email: 'amir.elrefai.dev@gmail.com', // Verified placeholder / fallback
    resume: 'https://drive.google.com/file/d/1EwA9JlGdJhmg2H5YR6u9ld8l8jKCfrnd/view?usp=sharing',
  },
  pillars: [
    {
      id: 'vision-ml',
      title: 'Medical AI & Computer Vision',
      description: 'Granular semantic segmentation, weakly supervised learning (WSSS), and multi-modal clinical diagnostic systems using PyTorch and OpenCV.',
      icon: 'Eye',
      tag: 'DEEP LEARNING'
    },
    {
      id: 'genai-agents',
      title: 'Generative AI & Agentic Workflows',
      description: 'Hierarchical tree-search RAG, production pgvector retrieval, and autonomous multi-agent systems with deterministic tool calling.',
      icon: 'Sparkles',
      tag: 'AUTONOMOUS AGENTS'
    },
    {
      id: 'clean-arch',
      title: 'Enterprise Clean Architecture',
      description: 'Decoupled domain-driven design (DDD), transactional integrity, multi-tenant database isolation, and sub-25ms APIs in .NET 8 and FastAPI.',
      icon: 'Layers',
      tag: 'SYSTEMS DESIGN'
    },
    {
      id: 'mlops-cloud',
      title: 'MLOps, Linux & Cloud Infrastructure',
      description: 'Native Linux environment, containerized Docker microservices, automated CI/CD evaluation harnesses, and multi-cloud AI deployment (AWS/Azure/GCP).',
      icon: 'Terminal',
      tag: 'INFRASTRUCTURE'
    }
  ]
};
