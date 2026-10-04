import { useMemo, memo } from 'react';
import { useSkills } from '../hooks/useData';
import NeuralSkillsCore from './NeuralSkillsCore';

const Skills = memo(() => {
  const { skills: rawSkills, isLoading } = useSkills();

  // Deduplicate and process skills directly from MongoDB Atlas
  const allSkills = useMemo(() => {
    if (!rawSkills || rawSkills.length === 0) return [];
    return Array.from(new Map(rawSkills.map((s) => [s.name.toLowerCase(), s])).values());
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
