import { useMemo, memo } from 'react';
import { useSkills } from '../hooks/useData';
import NeuralSkillsCore from './NeuralSkillsCore';

/* Default Preset Technologies per Category */
const PRESET_SKILLS = {
  computer_vision: [
    { name: 'OpenCV' },
    { name: 'YOLO' },
    { name: 'TensorFlow' },
    { name: 'PyTorch' },
    { name: 'ONNX' },
    { name: 'MediaPipe' },
  ],
  nlp_ai: [
    { name: 'LangChain' },
    { name: 'ChromaDB' },
    { name: 'Hugging Face' },
    { name: 'LlamaIndex' },
    { name: 'Pinecone' },
    { name: 'OpenAI' },
  ],
  development: [
    { name: 'FastAPI' },
    { name: 'Next.js' },
    { name: 'Docker' },
    { name: 'PostgreSQL' },
    { name: 'React' },
    { name: 'Python' },
    { name: 'C++' },
  ],
  deep_learning: [
    { name: 'PyTorch' },
    { name: 'TensorFlow' },
    { name: 'Keras' },
    { name: 'ONNX' },
    { name: 'Python' },
    { name: 'Scikit-Learn' },
  ],
  devops: [
    { name: 'Docker' },
    { name: 'Linux' },
    { name: 'Git' },
    { name: 'UV' },
    { name: 'PostgreSQL' },
    { name: 'MongoDB' },
  ],
  all: [
    { name: 'PyTorch' },
    { name: 'TensorFlow' },
    { name: 'OpenCV' },
    { name: 'YOLO' },
    { name: 'LangChain' },
    { name: 'ChromaDB' },
    { name: 'LlamaIndex' },
    { name: 'FastAPI' },
    { name: 'Next.js' },
    { name: 'Docker' },
    { name: 'Python' },
    { name: 'C++' },
  ]
};

const Skills = memo(() => {
  const { skills: rawSkills } = useSkills();

  const allSkills = useMemo(() => {
    if (!rawSkills || rawSkills.length === 0) return PRESET_SKILLS.all;

    // Deduplicate
    const unique = Array.from(new Map(rawSkills.map((s) => [s.name, s])).values());
    const existingNames = new Set(unique.map((x) => x.name.toLowerCase()));

    // Merge preset skills if not present
    const combined = [...unique];
    PRESET_SKILLS.all.forEach((preset) => {
      if (!existingNames.has(preset.name.toLowerCase())) {
        combined.push(preset);
      }
    });

    return combined;
  }, [rawSkills]);

  return (
    <section id="skills" className="pt-32 md:pt-36 pb-16 md:pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Small Elegant Title */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
            Skills{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">
              &amp; Tools
            </span>
          </h2>
        </div>

        <NeuralSkillsCore 
          skills={allSkills} 
          activeCategory="all" 
          categoryLabel="All Stack"
        />
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';
export default Skills;
