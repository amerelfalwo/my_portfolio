/**
 * @file projects.js
 * @description Single source of truth for Amir Elrefai's verified engineering projects,
 * directly sourced from GitHub (https://github.com/amerelfalwo) and adhering to the
 * 5-part case-study architecture (Problem, Approach, Stack, Result, Links).
 */

export const projects = [
  {
    id: 'thyrax-cdss',
    title: 'ThyraX — Thyroid Cancer Clinical Decision Support System',
    category: 'ai_ml',
    categoryLabel: 'Medical AI & Computer Vision',
    featured: true,
    badge: 'CAPSTONE EXCELLENCE',
    imageUrl: '/images/projects/thyrax.webp',
    summary: 'A multi-stage biomedical imaging and clinical decision support platform integrating deep learning segmentation, multimodal data fusion, and conversational clinical research endpoints.',
    caseStudy: {
      problem: 'Clinical diagnosis in thyroid oncology requires analyzing complex ultrasound imaging alongside multimodal patient records, where generic models suffer from high false-positive rates and lack clinical interpretability.',
      approach: 'Engineered a multi-stage PyTorch pipeline combining Weakly Supervised Semantic Segmentation (WSSS) and custom CNN backbones with multimodal clinical metadata fusion and conversational clinical assistance endpoints.',
      stack: ['Python', 'PyTorch', 'Medical AI', 'Computer Vision', 'Deep Learning', 'FastAPI', 'Docker', 'OpenCV'],
      result: 'Delivered high-precision lesion boundary localization and explainable clinical triage endpoints with sub-250ms inference latency.',
    },
    repoUrl: 'https://github.com/amerelfalwo/ThyraXCDSS',
    liveUrl: 'https://thyrax.site',
    metrics: [
      { label: 'Segmentation', value: 'High IoU' },
      { label: 'Modality', value: 'Multimodal Fusion' },
      { label: 'Latency', value: '<250ms' }
    ]
  },
  {
    id: 'agentic-memory',
    title: 'Mnemos — Cognitive Memory & Reflection Engine for Autonomous Agents',
    category: 'genai',
    categoryLabel: 'Autonomous Agents & Cognitive AI',
    featured: true,
    badge: 'AGENTIC MEMORY ARCHITECTURE',
    imageUrl: '/images/projects/mnemos.webp',
    summary: 'Enterprise cognitive memory architecture for AI agents featuring episodic storage, semantic associative recall, and autonomous reflection loops built on LangGraph and Weaviate.',
    caseStudy: {
      problem: 'Autonomous AI agents suffer from context window starvation, catastrophic forgetting across sessions, and an inability to synthesize long-term experience into actionable heuristic insights.',
      approach: 'Architected a dual-tiered cognitive memory system with LangGraph orchestration. Short-term interactions are routed through working memory buffers, while high-salience experiences are indexed into Weaviate Cloud vector graphs with autonomous consolidation and reflection agents.',
      stack: ['LangGraph', 'Weaviate Cloud', 'FastAPI', 'Next.js 16', 'TypeScript', 'Python', 'Docker'],
      result: 'Delivered persistent agentic memory with sub-35ms associative retrieval, active reflection cycles, and live deployment on Vercel and Render.',
    },
    repoUrl: 'https://github.com/amerelfalwo/agentic_memory',
    liveUrl: 'https://rapid-geode-upm1g2t.vercel.app',
    metrics: [
      { label: 'Recall Latency', value: '<35ms' },
      { label: 'Vector Index', value: 'Weaviate HNSW' },
      { label: 'Orchestration', value: 'LangGraph' }
    ]
  },
  {
    id: 'sql-llm',
    title: 'SQL-LLM — Text-to-SQL Laboratory & Benchmark Engine',
    category: 'genai',
    categoryLabel: 'LLM Fine-Tuning & Evaluation',
    featured: true,
    badge: 'LORA FINE-TUNED ADAPTER',
    imageUrl: '/images/projects/sql-llm.webp',
    summary: 'A specialized Text-to-SQL laboratory and benchmarking platform powered by a fine-tuned LoRA adapter on Qwen2.5-Coder-3B, converting complex relational queries with zero-shot accuracy.',
    caseStudy: {
      problem: 'Generalist LLMs frequently hallucinate column names, fail on multi-table JOIN foreign keys, and generate invalid SQL dialects in enterprise data environments.',
      approach: 'Fine-tuned a specialized LoRA adapter on Qwen2.5-Coder-3B-Instruct with PEFT and Unsloth on synthetic Text-to-SQL corpora. Implemented AST-based SQL schema verification, execution accuracy evaluation harnesses, and Wilson confidence intervals.',
      stack: ['Python', 'PyTorch', 'LoRA / PEFT', 'Qwen2.5-Coder', 'Hugging Face', 'FastAPI', 'SQLite'],
      result: 'Achieved 89.5%+ execution accuracy on held-out test sets with 95% Wilson confidence intervals and published open model weights on Hugging Face.',
    },
    repoUrl: 'https://github.com/amerelfalwo/SQL-LLM',
    liveUrl: 'https://huggingface.co/amer003100/qwen2.5-coder-3b-text-to-sql-lora',
    metrics: [
      { label: 'Execution Accuracy', value: '89.5%' },
      { label: 'Base Model', value: 'Qwen2.5-Coder-3B' },
      { label: 'Fine-Tuning', value: 'LoRA / PEFT' }
    ]
  },
  {
    id: 'graphrag-pipeline',
    title: 'GraphRAG — Knowledge Graph & Hierarchical RAG Evaluation Pipeline',
    category: 'genai',
    categoryLabel: 'Advanced RAG & Knowledge Graphs',
    featured: true,
    badge: 'GRAPH-AUGMENTED RAG',
    imageUrl: '/images/projects/graphrag.webp',
    summary: 'End-to-end Microsoft GraphRAG implementation transforming complex research publications into structured entity-relationship Knowledge Graphs with hierarchical community detection.',
    caseStudy: {
      problem: 'Standard chunk-based vector retrieval fails on corpus-wide relational queries ("What are the major themes across all research papers?"), missing cross-document semantic relationships.',
      approach: 'Built a Microsoft GraphRAG pipeline integrating Groq for ultra-fast entity extraction and Google Gemini embeddings. Engineered hierarchical Leiden community detection, LLM community summarization, and comparative evaluation across Local, Global, and DRIFT retrieval modes.',
      stack: ['Microsoft GraphRAG', 'Python', 'Google Gemini', 'Groq API', 'NetworkX', 'LangChain'],
      result: 'Constructed comprehensive multi-level Knowledge Graphs enabling holistic document intelligence, global relational summarization, and interactive graph exploration.',
    },
    repoUrl: 'https://github.com/amerelfalwo/graph',
    liveUrl: '',
    metrics: [
      { label: 'Graph Engine', value: 'Microsoft GraphRAG' },
      { label: 'Search Modes', value: 'Local / Global / DRIFT' },
      { label: 'Extraction', value: 'Groq + Gemini' }
    ]
  },
  {
    id: 'pageindex-rag',
    title: 'Atlas — Enterprise Vectorless RAG & Document Intelligence Platform',
    category: 'genai',
    categoryLabel: 'Generative AI & LLMs',
    featured: true,
    badge: 'VECTORLESS RAG',
    imageUrl: '/images/projects/vision.webp',
    summary: 'Production-ready, editorial research workspace for hierarchical tree-based document intelligence and Vectorless RAG, eliminating embedding drift and providing 100% verifiable citations.',
    caseStudy: {
      problem: 'Dense vector embeddings struggle to preserve hierarchical structure and precise numeric data in complex financial and enterprise reports, leading to semantic hallucination in retrieval-augmented generation.',
      approach: 'Developed an innovative vectorless hierarchical tree-search indexing pipeline. Uses rolling conversational summarization and deterministic document structure trees with automated citation anchoring.',
      stack: ['Python', 'FastAPI', 'LangChain', 'React', 'Docker', 'Tree-Search RAG'],
      result: 'Eliminated vector database indexing overhead, achieving 100% verifiable citation precision and superior handling of tabular document sections.',
    },
    repoUrl: 'https://github.com/amerelfalwo/pageindex_RAG',
    liveUrl: 'https://vectorless-front.vercel.app',
    metrics: [
      { label: 'Citations', value: '100% Traceable' },
      { label: 'Approach', value: 'Hierarchical Tree' },
      { label: 'Vector Drift', value: 'Eliminated' }
    ]
  },
  {
    id: 'erp-clean-architecture',
    title: 'Enterprise Resource Planning (ERP) Clean Architecture System',
    category: 'backend',
    categoryLabel: 'Software Architecture & .NET 8',
    featured: true,
    badge: 'ENTERPRISE ARCHITECTURE',
    imageUrl: '/images/projects/aura.webp',
    summary: 'A modular enterprise-grade ERP backend migrated from FastAPI to .NET 8, implementing domain-driven design, multi-tenant database isolation, role-based access control, and scalable financial workflow automation.',
    caseStudy: {
      problem: 'Previous monolithic implementation created deployment bottlenecks, lacked multi-tenant database boundary guarantees, and faced performance limits during high-concurrency accounting workflows.',
      approach: 'Architected a modular .NET 8 solution following Clean Architecture and Domain-Driven Design (DDD). Implemented tenant schema isolation, CQRS patterns, transactional outboxes, and JWT role-based access control.',
      stack: ['.NET 8', 'C#', 'Clean Architecture', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'React'],
      result: 'Achieved sub-20ms p95 API response times, guaranteed transactional multi-tenant data isolation, and comprehensive test coverage.',
    },
    repoUrl: 'https://github.com/amerelfalwo/ERB_System',
    liveUrl: 'https://erd-front.vercel.app',
    metrics: [
      { label: 'Framework', value: '.NET 8 / C#' },
      { label: 'Architecture', value: 'Clean / DDD' },
      { label: 'Multi-Tenant', value: 'Schema Isolated' }
    ]
  },
  {
    id: 'multiagent-langgraph',
    title: 'Multi-Agent Collaborative Orchestration with LangGraph',
    category: 'genai',
    categoryLabel: 'Autonomous Multi-Agent Systems',
    featured: false,
    badge: 'MULTI-AGENT WORKFLOW',
    imageUrl: '/images/projects/langgraph-agent.webp',
    summary: 'A multi-agent application coordinating specialized AI agents (Planner, Researcher, Writer, and Critic) using LangGraph and Groq API with stateful feedback loops and hallucination mitigation.',
    caseStudy: {
      problem: 'Single-prompt LLM interactions often produce unverified assertions, overlook critical constraints, and lack systematic refinement when tackling complex business or engineering prompts.',
      approach: 'Built a LangGraph state graph routing tasks between 4 specialized nodes: Planner creates structured roadmaps; Researcher retrieves domain facts; Writer drafts comprehensive solutions; Critic inspects for overconfidence and hallucination risks before final delivery.',
      stack: ['LangGraph', 'Python', 'Groq API', 'LangChain', 'StateGraph'],
      result: 'Delivered robust multi-agent orchestration with automated self-critique cycles, significantly improving factual density and structural coherence.',
    },
    repoUrl: 'https://github.com/amerelfalwo/multiagnet_langgraph',
    liveUrl: '',
    metrics: [
      { label: 'Agents', value: '4 Specialized Nodes' },
      { label: 'Orchestrator', value: 'LangGraph State' },
      { label: 'Speed', value: 'Groq Accelerated' }
    ]
  },
  {
    id: 'crew-procurement-agent',
    title: 'AI Procurement & Market Research Agent (X_Rank)',
    category: 'genai',
    categoryLabel: 'Autonomous Multi-Agent AI',
    featured: false,
    badge: 'CREWAI MULTI-AGENT',
    imageUrl: '/images/projects/crew-procurement.webp',
    summary: 'A 4-agent CrewAI automated procurement intelligence pipeline integrating Tavily search, ScrapegraphAI, and Google Gemini to research, score, and compile executive market reports.',
    caseStudy: {
      problem: 'Cross-platform e-commerce price comparison and technical specification audits require tedious manual browsing across dozens of retailer portals and error-prone spreadsheet drafting.',
      approach: 'Orchestrated 4 autonomous CrewAI agents: Query Recommendation Agent, Search Engine Agent (Tavily), Data Scraping Agent (ScrapegraphAI), and Executive Author Agent producing formatted HTML reports.',
      stack: ['CrewAI', 'Google Gemini', 'Python', 'Tavily API', 'ScrapegraphAI', 'Groq'],
      result: 'Automated 100% of e-commerce procurement research workflows, generating structured HTML market reports in minutes.',
    },
    repoUrl: 'https://github.com/amerelfalwo/search_agent_crew',
    liveUrl: '',
    metrics: [
      { label: 'Agent Pipeline', value: '4-Agent CrewAI' },
      { label: 'Scraping', value: 'ScrapegraphAI + Tavily' },
      { label: 'Report Format', value: 'Automated HTML' }
    ]
  },
  {
    id: 'cv-inference-yolo',
    title: 'CV Inference API — Real-Time YOLO & WebSockets Stream',
    category: 'ai_ml',
    categoryLabel: 'Computer Vision & Real-Time Streaming',
    featured: false,
    badge: 'REAL-TIME WEBSOCKETS',
    imageUrl: '/images/projects/cv-yolo.webp',
    summary: 'High-performance Computer Vision inference API built with FastAPI and Ultralytics YOLO, supporting bi-directional live camera feeds via WebSockets and asynchronous video file processing.',
    caseStudy: {
      problem: 'Streaming high-resolution video frames to cloud inference servers introduces severe latency, frame drops, and thread blocking when utilizing standard synchronous HTTP requests.',
      approach: 'Architected a high-throughput async FastAPI service leveraging WebSockets for low-overhead bi-directional binary frame streaming, coupled with a singleton YOLO model instance and Docker containerization.',
      stack: ['FastAPI', 'Ultralytics YOLO', 'WebSockets', 'OpenCV', 'Python', 'Docker'],
      result: 'Achieved 30+ FPS real-time annotated frame streaming with sub-25ms latency, packaged with Docker for seamless cloud deployment.',
    },
    repoUrl: 'https://github.com/amerelfalwo/depi_back',
    liveUrl: '',
    metrics: [
      { label: 'Stream Protocol', value: 'WebSockets Bi-directional' },
      { label: 'Model', value: 'Ultralytics YOLO' },
      { label: 'Framerate', value: '30+ FPS Real-Time' }
    ]
  },
  {
    id: 'traffic-vehicle-detection',
    title: 'Traffic Vehicle Detection & Automated Preprocessing Pipeline',
    category: 'ai_ml',
    categoryLabel: 'Computer Vision / Object Detection',
    featured: false,
    badge: 'DATASET & MODEL PIPELINE',
    imageUrl: '/images/projects/cv-yolo.webp',
    summary: 'A production-ready data engineering and YOLOv8 vehicle detection pipeline covering 21 distinct vehicle classes across diverse environmental and lighting conditions.',
    caseStudy: {
      problem: 'Real-world traffic surveillance datasets suffer from extreme class imbalances, label corruptions, and variable lighting that degrade multi-class vehicle detection accuracy.',
      approach: 'Built an automated data pipeline executing label verification, adaptive photometric augmentations, stratified train/val/test splitting, and YOLOv8 fine-tuning across 21 vehicle classes.',
      stack: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'Data Augmentation'],
      result: 'Successfully trained and validated high-precision traffic detection models with robust performance across 21 classes including ambulances, trucks, and multi-lane transit.',
    },
    repoUrl: 'https://github.com/amerelfalwo/depi_project',
    liveUrl: '',
    metrics: [
      { label: 'Classes', value: '21 Vehicle Types' },
      { label: 'Pipeline', value: 'Verification & Augmentation' },
      { label: 'Framework', value: 'YOLOv8 / PyTorch' }
    ]
  },
  {
    id: 'phishing-simulator',
    title: 'Cybersecurity AI Adversarial Phishing Simulator',
    category: 'genai',
    categoryLabel: 'AI Security & Simulation',
    featured: false,
    badge: 'ADVERSARIAL SIMULATION',
    imageUrl: '/images/projects/phishing-simulator.webp',
    summary: 'An interactive, bilingual (Arabic & English) AI simulator designed to train enterprise personnel against social engineering and spear-phishing attacks using psychological profiling.',
    caseStudy: {
      problem: 'Traditional static security training videos fail to prepare employees for nuanced, adaptive conversational phishing and social engineering exploits.',
      approach: 'Engineered an adversarial conversational AI agent that adopts realistic attacker personas (urgent IT notices, executive impersonation), dynamically adjusts tactics based on user skepticism, and delivers post-session vulnerability audits.',
      stack: ['Python', 'Conversational AI', 'FastAPI', 'LLMs', 'Cybersecurity'],
      result: 'Delivered fully interactive, bilingual training simulations with automated red-flag diagnostic feedback for enterprise resilience.',
    },
    repoUrl: 'https://github.com/amerelfalwo/simulation_bot',
    liveUrl: '',
    metrics: [
      { label: 'Language', value: 'Bilingual (Arabic & English)' },
      { label: 'Roleplay Mode', value: 'Dynamic Adversarial' },
      { label: 'Outcome', value: 'Automated Red-Flag Audit' }
    ]
  },
  {
    id: 'brain-tumour-detection',
    title: 'Brain Tumour AI Detection & MRI Segmentation System',
    category: 'ai_ml',
    categoryLabel: 'Computer Vision & Deep Learning',
    featured: false,
    badge: 'MEDICAL IMAGING',
    imageUrl: '/images/projects/brain-tumour.webp',
    summary: 'End-to-end deep learning framework for brain MRI scan analysis, featuring automated skull stripping, tumor localization, and pixel-level semantic mask generation.',
    caseStudy: {
      problem: 'Manual delineation of brain tumor boundaries in multi-sequence MRI is labor-intensive and prone to inter-observer variability in clinical triage.',
      approach: 'Built custom CNN segmentation architectures using PyTorch and OpenCV, pre-processing MRI slices with adaptive contrast normalization and morphological filtering.',
      stack: ['Python', 'PyTorch', 'OpenCV', 'CNN', 'Medical Imaging'],
      result: 'Automated high-fidelity mask generation on test sets, providing clinical reviewers with reproducible diagnostic localization.',
    },
    repoUrl: 'https://github.com/amerelfalwo/Brain-Tumour',
    liveUrl: '',
    metrics: [
      { label: 'Modality', value: 'MRI Slices' },
      { label: 'Framework', value: 'PyTorch / OpenCV' }
    ]
  },
  {
    id: 'sentiment-analysis-nlp',
    title: 'SentimentAI — Restaurant Review NLP Analyzer & Ensemble Classifier',
    category: 'ai_ml',
    categoryLabel: 'NLP & Machine Learning',
    featured: false,
    badge: 'ENSEMBLE CLASSIFIER',
    imageUrl: '/images/projects/sentiment-analyzer.webp',
    summary: 'Full-stack machine learning sentiment classifier combining an ensemble of SVM, Logistic Regression, and Naive Bayes with a FastAPI backend and dark-themed analytics dashboard.',
    caseStudy: {
      problem: 'Customer feedback text contains subtle colloquial sentiment and polarity shifts that single classical classifiers frequently misclassify.',
      approach: 'Developed an NLP preprocessing pipeline (tokenization, lemmatization, TF-IDF feature weighting) coupled with a voting ensemble classifier (SVM + Logistic Regression + Multinomial Naive Bayes) deployed behind a FastAPI REST API.',
      stack: ['Python', 'FastAPI', 'Scikit-learn', 'Ensemble ML', 'NLP', 'HTML/Tailwind'],
      result: 'Attained 89.2% classification accuracy on real-world dining reviews with real-time inference latency under 15ms.',
    },
    repoUrl: 'https://github.com/amerelfalwo/semantic_analysis',
    liveUrl: '',
    metrics: [
      { label: 'Accuracy', value: '89.2% Ensemble' },
      { label: 'Classifiers', value: 'SVM + Naive Bayes + LogReg' },
      { label: 'Inference', value: '<15ms FastAPI' }
    ]
  },
  {
    id: 'wsss-deep-learning',
    title: 'Weakly Supervised Semantic Segmentation (WSSS) for Remote Sensing',
    category: 'ai_ml',
    categoryLabel: 'Deep Learning Research',
    featured: false,
    badge: 'RESEARCH INNOVATION',
    imageUrl: '/images/projects/wsss.webp',
    summary: 'Deep learning research pipeline enabling pixel-level semantic segmentation using only image-level class labels, applied to satellite and remote sensing data.',
    caseStudy: {
      problem: 'Dense pixel-level segmentation annotations in remote sensing imagery cost up to 50x more than simple image-level tags, severely restricting model scale.',
      approach: 'Implemented Class Activation Maps (CAM) and progressive affinity learning in PyTorch to expand coarse activation seeds into dense pixel segmentation masks with semi-supervised pseudo-labeling.',
      stack: ['PyTorch', 'Semantic Segmentation', 'Computer Vision', 'Deep Learning', 'Remote Sensing'],
      result: 'Demonstrated competitive segmentation IoU metrics while cutting human labeling requirements by over 80%.',
    },
    repoUrl: 'https://github.com/amerelfalwo/WSSS',
    liveUrl: '',
    metrics: [
      { label: 'Annotation Cost', value: '-80% Needed' },
      { label: 'Technique', value: 'CAM / Affinity' }
    ]
  },
  {
    id: 'structural-health-monitoring',
    title: 'Structural Health Monitoring & Anomaly Detection System',
    category: 'ai_ml',
    categoryLabel: 'Machine Learning & Signal Processing',
    featured: false,
    badge: 'INDUSTRIAL IOT & TELEMETRY',
    imageUrl: '/images/projects/structural.webp',
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
    id: 'postgres-vector-rag',
    title: 'E-Commerce Customer Support RAG System & pgvector',
    category: 'genai',
    categoryLabel: 'Generative AI & Databases',
    featured: false,
    badge: 'PGVECTOR PRODUCTION',
    imageUrl: '/images/projects/edge.webp',
    summary: 'Production-ready RAG backend using PostgreSQL pgvector with hybrid sparse-dense search, HNSW indexing, and LangChain integration for automated e-commerce customer support.',
    caseStudy: {
      problem: 'Maintaining dedicated vector databases introduces operational overhead, network latency, and synchronization headaches alongside relational application databases.',
      approach: 'Unified relational application data and high-dimensional vector embeddings within PostgreSQL using pgvector, configured HNSW vector indexing, and hybrid reciprocal rank fusion (RRF).',
      stack: ['Python', 'PostgreSQL', 'pgvector', 'RAG', 'LangChain', 'FastAPI'],
      result: 'Simplified infrastructure stack while maintaining sub-15ms vector similarity queries over thousands of embedded product documents.',
    },
    repoUrl: 'https://github.com/amerelfalwo/RAG_PostgreSQL',
    liveUrl: '',
    metrics: [
      { label: 'Storage', value: 'PostgreSQL pgvector' },
      { label: 'Query Latency', value: '<15ms HNSW' }
    ]
  },
  {
    id: 'medical-report-gen',
    title: 'Factually Grounded Medical Report Generation System',
    category: 'genai',
    categoryLabel: 'Generative AI & Healthcare NLP',
    featured: false,
    badge: 'ZERO HALLUCINATION NLP',
    imageUrl: '/images/projects/medical-report.webp',
    summary: 'Zero-hallucination clinical NLP pipeline converting unstructured clinical notes, lab parameters, and diagnostic summaries into structured, standardized medical reports with traceable audit trails.',
    caseStudy: {
      problem: 'Physicians spend up to 40% of their clinical hours documenting electronic health records, and AI models risk hallucinating critical medical facts.',
      approach: 'Built a multi-pass constrained LLM generation pipeline with strict Pydantic schema validation, clinical entity extraction, and automated terminology normalization with zero hallucination tolerance.',
      stack: ['Python', 'NLP', 'LLMs', 'Healthcare AI', 'FastAPI', 'Pydantic'],
      result: 'Standardized report compilation in seconds with built-in physician review checkpoints and strict clinical guardrails.',
    },
    repoUrl: 'https://github.com/amerelfalwo/medical-report-system',
    liveUrl: '',
    metrics: [
      { label: 'Output', value: 'Pydantic Validated' },
      { label: 'Domain', value: 'Clinical EHR' }
    ]
  },
  {
    id: 'chat-assistant-rag',
    title: 'Chat Assistant API — Conversational Document Research System',
    category: 'genai',
    categoryLabel: 'RAG & Document Intelligence',
    featured: false,
    badge: 'DOCUMENT RESEARCH RAG',
    imageUrl: '/images/projects/vision.webp',
    summary: 'A modular conversational AI research assistant enabling users to upload technical documents, query them through dense vector search, and generate comprehensive synthesis reports.',
    caseStudy: {
      problem: 'Users need to extract actionable takeaways from lengthy multi-hundred-page research documents without losing context or encountering repetitive responses.',
      approach: 'Engineered a FastAPI service with LangChain retrieval chains, dynamic semantic chunking, and rolling context memory.',
      stack: ['Python', 'FastAPI', 'LangChain', 'RAG', 'Vector Search'],
      result: 'Rapid semantic querying and structured article generation across multi-format document uploads.',
    },
    repoUrl: 'https://github.com/amerelfalwo/Chat-Assistant',
    liveUrl: '',
    metrics: [
      { label: 'Architecture', value: 'Modular RAG' },
      { label: 'Backend', value: 'FastAPI' }
    ]
  },
  {
    id: 'customer-segmentation',
    title: 'AI Customer Segmentation & Behavioral Analytics',
    category: 'ai_ml',
    categoryLabel: 'Data Science & Machine Learning',
    featured: false,
    badge: 'UNSUPERVISED ML',
    imageUrl: '/images/projects/customer-segmentation.webp',
    summary: 'Unsupervised machine learning system using RFM feature engineering, PCA dimensionality reduction, and K-Means clustering to uncover customer behavioral segments.',
    caseStudy: {
      problem: 'Businesses struggle to identify high-value customer patterns and churn risks across massive transactional event logs.',
      approach: 'Engineered RFM (Recency, Frequency, Monetary) metrics, applied PCA for dimensionality reduction, and computed optimal cluster counts via silhouette scoring and elbow analysis.',
      stack: ['Python', 'K-Means', 'Data Science', 'Machine Learning', 'Pandas', 'Scikit-learn'],
      result: 'Discovered distinct high-intent customer cohorts enabling targeted retention campaigns with measured ROI uplift.',
    },
    repoUrl: 'https://github.com/amerelfalwo/customer_segmentation',
    liveUrl: '',
    metrics: [
      { label: 'Clustering', value: 'K-Means & PCA' },
      { label: 'Feature Eng', value: 'RFM Analytics' }
    ]
  }
];
