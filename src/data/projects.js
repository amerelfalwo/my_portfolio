/**
 * @file projects.js
 * @description Single source of truth for Amir Elrefai's 9 verified engineering projects,
 * adhering to the 5-part case-study architecture (Problem, Approach, Stack, Result, Links).
 */

export const projects = [
  {
    id: 'thyrax-cdss',
    title: 'ThyraX — Thyroid Cancer Clinical Decision Support System',
    category: 'ai_ml',
    categoryLabel: 'Medical AI & Computer Vision',
    featured: true,
    badge: 'CAPSTONE EXCELLENCE',
    imageUrl: 'https://res.cloudinary.com/iqldv0aa/image/upload/v1785270487/qkfmwtsyd6b2sooxe11d.png',
    summary: 'A multi-stage biomedical imaging and clinical research assistant integrating deep learning segmentation, multimodal data fusion, and conversational clinical support.',
    caseStudy: {
      problem: 'Clinical diagnosis in thyroid oncology requires analyzing complex ultrasound imaging alongside multimodal patient records, where generic models suffer from high false-positive rates and lack interpretability.',
      approach: 'Engineered a multi-stage PyTorch pipeline combining Weakly Supervised Semantic Segmentation (WSSS) and custom CNN backbones with multimodal data fusion and conversational clinical assistance endpoints.',
      stack: ['Python', 'PyTorch', 'Medical AI', 'Computer Vision', 'Deep Learning', 'FastAPI', 'OpenCV'],
      result: 'Delivered high-precision lesion boundary localization and explainable clinical triage endpoints with sub-second inference.',
    },
    repoUrl: 'https://github.com/amerelfalwo/ThyraXCDSS',
    liveUrl: '',
    metrics: [
      { label: 'Segmentation', value: 'High IoU' },
      { label: 'Modality', value: 'Multimodal Fusion' },
      { label: 'Latency', value: '<250ms' }
    ]
  },
  {
    id: 'erp-clean-architecture',
    title: 'Enterprise Resource Planning (ERP) Clean Architecture System',
    category: 'backend',
    categoryLabel: 'Software Architecture & .NET 8',
    featured: true,
    badge: 'ENTERPRISE ARCHITECTURE',
    imageUrl: 'https://res.cloudinary.com/iqldv0aa/image/upload/v1785270487/qkfmwtsyd6b2sooxe11d.png',
    summary: 'A modular enterprise-grade ERP backend migrated from FastAPI to .NET 8, implementing domain-driven design, multi-tenant database isolation, role-based access control, and scalable financial workflow automation.',
    caseStudy: {
      problem: 'Previous monolithic implementation created deployment bottlenecks, lacked multi-tenant database boundary guarantees, and faced performance limits during high-concurrency accounting workflows.',
      approach: 'Architected a modular .NET 8 solution following Clean Architecture and Domain-Driven Design (DDD). Implemented tenant schema isolation, CQRS patterns, transactional outboxes, and JWT role-based access control.',
      stack: ['.NET 8', 'C#', 'Clean Architecture', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      result: 'Achieved sub-20ms p95 API response times, guaranteed transactional multi-tenant data isolation, and comprehensive test coverage.',
    },
    repoUrl: 'https://github.com/amerelfalwo/ERB-Backend',
    liveUrl: 'https://erd-front.vercel.app',
    metrics: [
      { label: 'Framework', value: '.NET 8 / C#' },
      { label: 'Architecture', value: 'Clean / DDD' },
      { label: 'Multi-Tenant', value: 'Schema Isolated' }
    ]
  },
  {
    id: 'pageindex-rag',
    title: 'PageIndex Document RAG & Vectorless Search System',
    category: 'genai',
    categoryLabel: 'Generative AI & LLMs',
    featured: true,
    badge: 'VECTORLESS RAG',
    imageUrl: 'https://res.cloudinary.com/iqldv0aa/image/upload/v1785270487/qkfmwtsyd6b2sooxe11d.png',
    summary: 'High-precision document understanding pipeline utilizing hierarchical tree-search retrieval with rolling conversation summarization and automated text-image citation endpoints.',
    caseStudy: {
      problem: 'Dense vector embeddings struggle to preserve hierarchical structure and precise numeric data in complex enterprise reports, causing semantic hallucination in retrieval-augmented generation.',
      approach: 'Developed an innovative vectorless hierarchical tree-search indexing pipeline. Uses rolling conversational summarization and deterministic document structure trees with automated citation anchoring.',
      stack: ['Python', 'RAG', 'LangChain', 'LLMs', 'Vector DB', 'PostgreSQL', 'FastAPI'],
      result: 'Eliminated vector database indexing overhead, achieving 100% verifiable citation precision and superior handling of tabular document sections.',
    },
    repoUrl: 'https://github.com/amerelfalwo/PageIndex',
    liveUrl: '',
    metrics: [
      { label: 'Citations', value: '100% Traceable' },
      { label: 'Approach', value: 'Hierarchical Tree' },
      { label: 'Vector Drift', value: 'Eliminated' }
    ]
  },
  {
    id: 'brain-tumour-detection',
    title: 'Brain Tumour AI Detection & MRI Segmentation System',
    category: 'ai_ml',
    categoryLabel: 'Computer Vision & Deep Learning',
    featured: false,
    imageUrl: '',
    summary: 'End-to-end deep learning framework for brain MRI scan analysis, featuring automated skull stripping, tumor localization, and pixel-level semantic mask generation.',
    caseStudy: {
      problem: 'Manual delineation of brain tumor boundaries in multi-sequence MRI is labor-intensive and prone to inter-observer variability in clinical triage.',
      approach: 'Built custom CNN segmentation architectures using PyTorch and OpenCV, pre-processing MRI slices with adaptive contrast normalization and morphological filtering.',
      stack: ['Python', 'PyTorch', 'OpenCV', 'CNN', 'Medical Imaging'],
      result: 'Automated high-fidelity mask generation on test sets, providing clinical reviewers with reproducible diagnostic localization.',
    },
    repoUrl: 'https://github.com/amerelfalwo/Brain-Tumour-AI-Detection',
    liveUrl: '',
    metrics: [
      { label: 'Modality', value: 'MRI Slices' },
      { label: 'Framework', value: 'PyTorch / OpenCV' }
    ]
  },
  {
    id: 'structural-health-monitoring',
    title: 'Structural Health Monitoring & Anomaly Detection System',
    category: 'ai_ml',
    categoryLabel: 'Machine Learning & Signal Processing',
    featured: false,
    imageUrl: '',
    summary: 'Real-time time-series telemetry analysis pipeline combining Fourier transforms, wavelet feature extraction, and unsupervised anomaly detection for infrastructure safety.',
    caseStudy: {
      problem: 'Vibration and strain sensor arrays produce high-frequency noisy time-series data where catastrophic structural defects can be easily masked by ambient environmental noise.',
      approach: 'Designed a signal-processing pipeline utilizing FFT and wavelet decomposition coupled with Scikit-learn isolation forests and autoencoders for real-time anomaly score generation.',
      stack: ['Python', 'Scikit-learn', 'Signal Processing', 'Anomaly Detection', 'NumPy'],
      result: 'Robust early detection of micro-fractures and modal frequency shifts before physical structural deformation occurs.',
    },
    repoUrl: 'https://github.com/amerelfalwo/Structural-Health-Monitoring',
    liveUrl: '',
    metrics: [
      { label: 'Domain', value: 'Signal Processing' },
      { label: 'Method', value: 'FFT / Wavelets' }
    ]
  },
  {
    id: 'wsss-deep-learning',
    title: 'Weakly Supervised Semantic Segmentation (WSSS)',
    category: 'ai_ml',
    categoryLabel: 'Deep Learning Research',
    featured: false,
    imageUrl: '',
    summary: 'Deep learning research framework enabling pixel-level semantic segmentation using only image-level class labels, drastically reducing medical annotation overhead.',
    caseStudy: {
      problem: 'Dense pixel-level segmentation annotations in medical imaging cost up to 50x more than simple image-level labels, severely bottlenecking model training data availability.',
      approach: 'Implemented Class Activation Maps (CAM) and progressive affinity learning in PyTorch to expand coarse activation seeds into dense pixel segmentation masks.',
      stack: ['PyTorch', 'Semantic Segmentation', 'Computer Vision', 'Deep Learning'],
      result: 'Demonstrated competitive segmentation IoU metrics while cutting human labeling requirements by over 80%.',
    },
    repoUrl: 'https://github.com/amerelfalwo/WSSS-DeepLearning',
    liveUrl: '',
    metrics: [
      { label: 'Annotation Cost', value: '-80% Needed' },
      { label: 'Technique', value: 'CAM / Affinity' }
    ]
  },
  {
    id: 'postgres-vector-rag',
    title: 'PostgreSQL Vector RAG & Knowledge Retrieval System',
    category: 'genai',
    categoryLabel: 'Generative AI & Databases',
    featured: false,
    imageUrl: '',
    summary: 'Production-ready RAG backend using pgvector with hybrid sparse-dense search, HNSW indexing, and LangChain integration for enterprise semantic search.',
    caseStudy: {
      problem: 'Maintaining dedicated vector databases introduces operational overhead, network latency, and synchronization headaches alongside relational application databases.',
      approach: 'Unified relational application data and high-dimensional vector embeddings within PostgreSQL using pgvector, configured HNSW vector indexing, and hybrid reciprocal rank fusion (RRF).',
      stack: ['Python', 'PostgreSQL', 'pgvector', 'RAG', 'LangChain', 'FastAPI'],
      result: 'Simplified infrastructure stack while maintaining sub-15ms vector similarity queries over thousands of embedded documents.',
    },
    repoUrl: 'https://github.com/amerelfalwo/PostgreSQL-Vector-RAG',
    liveUrl: '',
    metrics: [
      { label: 'Storage', value: 'PostgreSQL pgvector' },
      { label: 'Query Latency', value: '<15ms HNSW' }
    ]
  },
  {
    id: 'medical-report-gen',
    title: 'Automated AI Medical Report Generation System',
    category: 'genai',
    categoryLabel: 'Generative AI & Healthcare NLP',
    featured: false,
    imageUrl: '',
    summary: 'Clinical NLP pipeline that converts unstructured clinical notes, lab parameters, and diagnostic summaries into structured, standardized medical reports with audit trails.',
    caseStudy: {
      problem: 'Physicians spend up to 40% of their clinical hours documenting electronic health records, leading to burnout and delayed patient communication.',
      approach: 'Built a constrained LLM generation pipeline with strict Pydantic schema validation, clinical entity extraction, and automated terminology normalization.',
      stack: ['Python', 'NLP', 'LLMs', 'Healthcare AI', 'FastAPI'],
      result: 'Standardized report compilation in seconds with built-in physician review checkpoints and strict clinical guardrails.',
    },
    repoUrl: 'https://github.com/amerelfalwo/Medical-Report-Generation',
    liveUrl: '',
    metrics: [
      { label: 'Output', value: 'Pydantic Validated' },
      { label: 'Domain', value: 'Clinical EHR' }
    ]
  },
  {
    id: 'customer-segmentation',
    title: 'AI Customer Segmentation & Behavioral Analytics',
    category: 'ai_ml',
    categoryLabel: 'Data Science & Machine Learning',
    featured: false,
    imageUrl: '',
    summary: 'Unsupervised machine learning system using RFM feature engineering, PCA dimensionality reduction, and K-Means clustering to uncover customer behavioral segments.',
    caseStudy: {
      problem: 'Businesses struggle to identify high-value customer patterns and churn risks across massive transactional event logs.',
      approach: 'Engineered RFM (Recency, Frequency, Monetary) metrics, applied PCA for dimensionality reduction, and computed optimal cluster counts via silhouette scoring and elbow analysis.',
      stack: ['Python', 'K-Means', 'Data Science', 'Machine Learning', 'Pandas', 'Scikit-learn'],
      result: 'Discovered distinct high-intent customer cohorts enabling targeted retention campaigns with measured ROI uplift.',
    },
    repoUrl: 'https://github.com/amerelfalwo/Customer-Segmentation',
    liveUrl: '',
    metrics: [
      { label: 'Clustering', value: 'K-Means & PCA' },
      { label: 'Feature Eng', value: 'RFM Analytics' }
    ]
  }
];
