/**
 * @file skills.js
 * @description Single source of truth for Amir Elrefai's technical skills,
 * categorized into exactly 5 engineering domains per the approved Phase 2 proposal.
 */

export const skillCategories = [
  {
    id: 'ai_ml',
    title: 'AI, Machine Learning & Computer Vision',
    description: 'Deep neural networks, biomedical imaging segmentation, signal analysis, and real-time computer vision.',
    icon: 'Eye',
    tint: 'mint',
    skills: [
      { name: 'PyTorch', level: 'Production', context: 'Custom CNNs, WSSS research, and loss surface tuning' },
      { name: 'Computer Vision / OpenCV', level: 'Production', context: 'Filtering, morphological ops, MediaPipe gesture tracking' },
      { name: 'TensorFlow / Keras', level: 'Advanced', context: 'Transfer learning, neural feature extraction' },
      { name: 'Scikit-learn', level: 'Production', context: 'Random Forests, PCA, Isolation Forests, K-Means' },
      { name: 'Medical Imaging AI', level: 'Specialist', context: 'MRI segmentation, DICOM processing, ThyraX capstone' },
      { name: 'Signal Processing', level: 'Advanced', context: 'FFT, Wavelet transforms for structural health anomaly detection' },
      { name: 'Pandas & NumPy', level: 'Mastery', context: 'Vectorized feature pipelines and numerical computing' },
    ]
  },
  {
    id: 'genai',
    title: 'Generative AI & Autonomous Agents',
    description: 'Hierarchical tree-search RAG, vector stores, autonomous agent loops, and structured LLM tool orchestration.',
    icon: 'Sparkles',
    tint: 'purple',
    skills: [
      { name: 'LangChain & LangGraph', level: 'Production', context: 'Stateful agent loops, cyclical graphs, custom tool-calling' },
      { name: 'LlamaIndex', level: 'Production', context: 'Multi-document indexing and hierarchical query engines' },
      { name: 'pgvector / PostgreSQL', level: 'Production', context: 'HNSW vector indexes, hybrid sparse-dense reciprocal ranking' },
      { name: 'ChromaDB / Qdrant', level: 'Advanced', context: 'Vector embedding stores, collection partitioning' },
      { name: 'Vectorless RAG (PageIndex)', level: 'Architect', context: 'Hierarchical tree-search indexing without embedding drift' },
      { name: 'Autonomous Tool Agents', level: 'Production', context: 'Deterministic schema-bound execution and evaluation' },
      { name: 'Prompt Engineering & LoRA', level: 'Advanced', context: 'Fine-tuning, few-shot conditioning, structured Pydantic I/O' },
    ]
  },
  {
    id: 'backend',
    title: 'Backend & Systems Architecture',
    description: 'Enterprise clean architecture, domain-driven design (DDD), transactional workflows, and high-throughput async APIs.',
    icon: 'Layers',
    tint: 'teal',
    skills: [
      { name: '.NET 8 / C#', level: 'Production', context: 'Clean Architecture, CQRS, multi-tenant ERP migration' },
      { name: 'FastAPI (Python)', level: 'Production', context: 'High-throughput async endpoints, Pydantic schemas, dependency injection' },
      { name: 'PostgreSQL', level: 'Production', context: 'Schema design, connection pooling, complex relational queries' },
      { name: 'Domain-Driven Design (DDD)', level: 'Advanced', context: 'Bounded contexts, aggregates, entities, repositories' },
      { name: 'RESTful API Contracts', level: 'Production', context: 'Versioned OpenAPI schemas, JWT auth, RBAC security' },
      { name: 'MongoDB', level: 'Advanced', context: 'Document modeling, aggregation pipelines' },
      { name: 'C++', level: 'Core', context: 'Algorithmic problem solving and high-performance computing' },
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend & UI Engineering',
    description: 'Modern component architecture, streaming UX, accessible design systems, and responsive web applications.',
    icon: 'Code',
    tint: 'blue',
    skills: [
      { name: 'React 19', level: 'Production', context: 'Concurrent features, hooks, component lifecycle optimization' },
      { name: 'Next.js (App Router)', level: 'Production', context: 'Server components, streaming AI interfaces, SEO' },
      { name: 'JavaScript / TypeScript', level: 'Production', context: 'Strict typing, modern ESNext asynchronous patterns' },
      { name: 'Tailwind CSS', level: 'Mastery', context: 'Custom design tokens, semantic theming, responsive grids' },
      { name: 'SWR / Data Fetching', level: 'Production', context: 'Client caching, optimistic updates, offline fallbacks' },
      { name: 'Accessibility (WCAG AA)', level: 'Standards', context: 'Semantic HTML5, keyboard focus rings, screen reader labels' },
      { name: 'Framer Motion', level: 'Advanced', context: 'Micro-interactions honoring prefers-reduced-motion' },
    ]
  },
  {
    id: 'devops',
    title: 'DevOps, MLOps & Infrastructure',
    description: 'Reproducible environments, containerization, cloud deployment, and automated testing pipelines.',
    icon: 'Terminal',
    tint: 'amber',
    skills: [
      { name: 'Linux (Ubuntu / Zsh)', level: 'Native Daily', context: 'Terminal workflows, bash automation, daemon orchestration' },
      { name: 'Docker & Compose', level: 'Production', context: 'Multi-stage builds, isolated service networks' },
      { name: 'Git & GitHub Actions', level: 'Production', context: 'Conventional commits, automated CI/CD workflows' },
      { name: 'uv Package Manager', level: 'Production', context: 'Blazing fast deterministic Python environment management' },
      { name: 'Cloud AI (AWS / Azure / GCP)', level: 'Certified', context: 'Cloud AI endpoints, model registry, compute instances' },
      { name: 'LLMOps & Evaluation', level: 'Specialist', context: 'DeepLearning.AI certified, hallucination eval harnesses' },
      { name: 'n8n Workflow Automation', level: 'Certified', context: 'Google Developer Groups certified agentic pipelines' },
    ]
  }
];
