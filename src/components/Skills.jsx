import { memo } from 'react';
import { getToolIconUrl } from '../utils/getToolIcon';

const STATIC_GROUPS = [
  {
    id: 'ai-ml',
    title: 'AI, Deep Learning & Computer Vision',
    tools: [
      { name: 'PyTorch' },
      { name: 'TensorFlow' },
      { name: 'Keras' },
      { name: 'OpenCV' },
      { name: 'YOLO' },
      { name: 'ONNX' },
      { name: 'MediaPipe' },
      { name: 'Scikit-learn' },
      { name: 'Pandas' },
    ]
  },
  {
    id: 'genai',
    title: 'Generative AI & Agentic Workflows',
    tools: [
      { name: 'LangChain' },
      { name: 'LangGraph' },
      { name: 'LlamaIndex' },
      { name: 'ChromaDB' },
      { name: 'Hugging Face' },
    ]
  },
  {
    id: 'backend-systems',
    title: 'Backend & Systems Engineering',
    tools: [
      { name: 'Python' },
      { name: 'FastAPI' },
      { name: 'C++' },
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'Docker' },
      { name: 'Linux' },
      { name: 'Git' },
      { name: 'uv' },
    ]
  },
  {
    id: 'frontend-web',
    title: 'Web & Frontend Development',
    tools: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'JavaScript / TypeScript' },
      { name: 'Tailwind CSS' },
    ]
  }
];

const Skills = memo(() => {
  const groups = STATIC_GROUPS;

  return (
    <section id="skills" className="py-24 sm:py-32 relative bg-transparent border-t border-border/60">
      <div className="page-container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border text-xs font-medium text-foreground tracking-wide mb-4 bg-surface">
            <span className="text-[7px] text-foreground" aria-hidden="true">●</span>
            <span>Skills</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.12]">
            Technologies &amp; tools
          </h2>

          <p className="text-muted text-sm sm:text-base font-normal leading-relaxed mt-4 max-w-xl mx-auto">
            Tools and frameworks I use for deep learning, computer vision, LLM applications, and backend services.
          </p>
        </div>

        {/* Static Grouped Chips with Category Headings */}
        <div className="space-y-12 sm:space-y-14">
          {groups.map((group) => (
            <div key={group.id} className="text-start">
              {/* Category Heading in Sentence Case */}
              <h3 className="text-sm font-medium text-muted mb-4">
                {group.title}
              </h3>

              {/* Group Chips */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {group.tools.map((tool) => {
                  const iconUrl = tool.icon || getToolIconUrl(tool.name);
                  return (
                    <div
                      key={tool.name}
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border bg-surface hover:border-foreground/40 transition-colors select-none"
                    >
                      {iconUrl && (
                        <img
                          src={iconUrl}
                          alt=""
                          className="w-4 h-4 object-contain shrink-0 grayscale"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span className="text-xs sm:text-sm font-medium text-foreground tracking-tight">
                        {tool.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
});

Skills.displayName = 'Skills';

export default Skills;
