/**
 * Utility helper to automatically get official SVG/PNG icon URLs for developer tools,
 * AI frameworks, ML libraries, and programming languages using Simple Icons, Devicon, and official CDNs.
 */

const LOCAL_ICONS = {
  'pytorch': '/icons/pytorch.svg',
  'tensorflow': '/icons/tensorflow.svg',
  'opencv': '/icons/opencv.svg',
  'yolo': '/icons/yolo.svg',
  'yolov11': '/icons/yolo.svg',
  'onnx': '/icons/onnx.svg',
  'mediapipe': '/icons/mediapipe.svg',
  'chromadb': '/icons/chromadb.svg',
  'chroma': '/icons/chromadb.svg',
  'llamaindex': '/icons/llamaindex.png',
  'llama-index': '/icons/llamaindex.png',
  'langchain': '/icons/langchain.svg',
  'huggingface': '/icons/huggingface.svg',
  'hugging face': '/icons/huggingface.svg',
  'fastapi': '/icons/fastapi.svg',
  'next.js': '/icons/nextjs.svg',
  'nextjs': '/icons/nextjs.svg',
  'docker': '/icons/docker.svg',
  'postgresql': '/icons/postgresql.svg',
  'postgres': '/icons/postgresql.svg',
  'react': '/icons/react.svg',
  'python': '/icons/python.svg',
  'c++': '/icons/cplusplus.svg',
  'cplusplus': '/icons/cplusplus.svg',
  'keras': '/icons/keras.svg',
  'scikit-learn': '/icons/scikitlearn.svg',
  'scikitlearn': '/icons/scikitlearn.svg',
  'sklearn': '/icons/scikitlearn.svg',
  'linux': '/icons/linux.svg',
  'git': '/icons/git.svg',
  'uv': '/icons/uv.svg',
  'mongodb': '/icons/mongodb.svg',
  'pandas': '/icons/pandas.svg',
  'numpy': '/icons/numpy.svg',
  'flask': '/icons/flask.svg',
};

const EXACT_ICON_URLS = {
  ...LOCAL_ICONS,
};

// Normalized alias mappings for simpleicons slug fallback
const SLUG_ALIASES = {
  'c#': 'csharp',
  'csharp': 'csharp',
  'django': 'django',
  'vue': 'vuedotjs',
  'angular': 'angular',
  'node': 'nodedotjs',
  'nodejs': 'nodedotjs',
  'typescript': 'typescript',
  'javascript': 'javascript',
  'html': 'html5',
  'css': 'css3',
  'tailwind': 'tailwindcss',
  'pinecone': 'pinecone',
  'qdrant': 'qdrant',
  'sqlite': 'sqlite',
  'redis': 'redis',
  'github': 'github',
  'ubuntu': 'ubuntu',
  'nvidia': 'nvidia',
  'cuda': 'nvidia',
  'aws': 'amazonwebservices',
  'gcp': 'googlecloud',
  'azure': 'microsoftazure',
  'vercel': 'vercel',
};

/**
 * Returns the official SVG/PNG icon URL for a given tool/framework name.
 * 
 * @param {string} toolName - Name of the technology (e.g., "ChromaDB", "LlamaIndex", "PyTorch")
 * @returns {string} - Image URL
 */
export function getToolIconUrl(toolName) {
  if (!toolName || typeof toolName !== 'string') return '';

  const lower = toolName.trim().toLowerCase();
  const clean = lower.replace(/\s+/g, '');

  if (EXACT_ICON_URLS[clean]) return EXACT_ICON_URLS[clean];
  if (EXACT_ICON_URLS[lower]) return EXACT_ICON_URLS[lower];

  const slug = SLUG_ALIASES[clean] || SLUG_ALIASES[lower] || clean;
  return `https://cdn.simpleicons.org/${slug}`;
}

export default getToolIconUrl;
