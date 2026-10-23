import { profile } from '../../src/data/profile.js';
import { projects } from '../../src/data/projects.js';
import { certifications } from '../../src/data/certifications.js';

export const SKILL_GROUPS = [
  {
    title: 'Deep Learning & Computer Vision',
    tools: ['PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'YOLO', 'ONNX', 'MediaPipe', 'Scikit-learn', 'Pandas']
  },
  {
    title: 'Generative AI & Agentic Workflows',
    tools: ['LangChain', 'LangGraph', 'LlamaIndex', 'ChromaDB', 'Hugging Face']
  },
  {
    title: 'Backend & Systems Engineering',
    tools: ['Python', 'FastAPI', 'C++', 'PostgreSQL', 'MongoDB', 'Docker', 'Linux', 'Git', 'uv']
  },
  {
    title: 'Frontend & Web Technologies',
    tools: ['React', 'Next.js', 'JavaScript / TypeScript', 'Tailwind CSS']
  }
];

/**
 * Builds compact, authoritative knowledge text directly from canonical data sources.
 * Token budget: ~2,900 tokens (high density, well within rate limits).
 */
export function buildKnowledge() {
  const profileSection = `=== AMIR ELREFAI — PROFILE & BACKGROUND ===
Name: ${profile.name} (${profile.nameArabic})
Title: AI Engineer & Systems Analyst
Years of Experience: 2+ years building AI projects across computer vision, LLM agents, and backend systems
Education: B.Sc. in Computer and Information Sciences with "Very Good" honors from Mansoura University (Class of 2026)
Architecture Methodology: Clean Architecture — isolating domain logic from frameworks, APIs, and storage
Contact & Profiles:
- Email: ${profile.links.email}
- GitHub: ${profile.links.github}
- LinkedIn: ${profile.links.linkedin}
- Resume / CV: ${profile.links.resume}
- Contact Form: /#contact`;

  const skillsSection = `=== CORE TECHNICAL SKILLS (GROUPED) ===
${SKILL_GROUPS.map((g, idx) => `${idx + 1}. ${g.title}: ${g.tools.join(', ')}`).join('\n')}`;

  const certsSection = `=== VERIFIED CREDENTIALS & CERTIFICATES ===
${certifications.map((c, idx) => `${idx + 1}. ${c.title} — Issuer: ${c.issuer} (${c.year}) [${c.badge}]`).join('\n')}`;

  const projectsSection = `=== ALL ${projects.length} VERIFIED PROJECTS ===
${projects.map((p, idx) => {
  const stack = (p.caseStudy?.stack || p.tags || []).slice(0, 6).join(', ');
  const sum = (p.summary || p.description || '').replace(/\s+/g, ' ');
  return `[Project ${idx + 1}] [${p.title}](/projects/${p.id})
- Category: ${p.categoryLabel || p.category}
- Summary: ${sum}
- Tech Stack: ${stack}
- Links: Page: /projects/${p.id}${p.liveUrl ? ` | Live: ${p.liveUrl}` : ''}${p.repoUrl ? ` | Repo: ${p.repoUrl}` : ''}`;
}).join('\n\n')}`;

  return `${profileSection}\n\n${skillsSection}\n\n${certsSection}\n\n${projectsSection}`;
}

export default buildKnowledge;
