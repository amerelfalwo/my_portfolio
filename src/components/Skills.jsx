import { useMemo, memo } from 'react';
import { useSkills } from '../hooks/useData';
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
      { name: 'LlamaIndex' },
      { name: 'ChromaDB' },
      { name: 'Hugging Face' },
    ]
  },
  {
    id: 'backend-systems',
    title: 'Backend & Systems Engineering',
    tools: [
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
  const { skills: liveSkills } = useSkills();

  // Merge live skills if any with static groups, ensuring all tools and logos are retained
  const groups = useMemo(() => {
    if (!liveSkills || liveSkills.length === 0) return STATIC_GROUPS;

    // Create a normalized map of tools already present in static groups
    const staticMap = new Map();
    STATIC_GROUPS.forEach(g => {
      g.tools.forEach(t => {
        staticMap.set(t.name.toLowerCase().replace(/[^a-z0-9]/g, ''), true);
      });
    });

    // Check for any extra dynamic skills added in CMS
    const extras = [];
    liveSkills.forEach(s => {
      const key = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!staticMap.has(key)) {
        extras.push({ name: s.name, icon: s.icon });
      }
    });

    if (extras.length > 0) {
      return [
        ...STATIC_GROUPS,
        {
          id: 'additional',
          title: 'Additional Libraries & Tools',
          tools: extras
        }
      ];
    }

    return STATIC_GROUPS;
  }, [liveSkills]);

  return (
    <section id="skills" className="py-24 sm:py-32 relative bg-transparent border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-start">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted tracking-wide mb-3">
            <span className="text-[8px] text-foreground" aria-hidden="true">●</span>
            <span>Skills &amp; Expertise</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.12]">
            Technologies &amp; toolstack
          </h2>

          <p className="text-muted text-base sm:text-lg font-normal leading-relaxed mt-4">
            A comprehensive overview of frameworks, neural libraries, system runtimes, and languages used across production systems.
          </p>
        </div>

        {/* Static Grouped Chips with Category Headings */}
        <div className="space-y-12 sm:space-y-14">
          {groups.map((group) => (
            <div key={group.id} className="text-start">
              {/* Category Heading */}
              <h3 className="text-sm uppercase tracking-wider text-muted font-medium mb-4">
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
                          className="w-4 h-4 object-contain"
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
