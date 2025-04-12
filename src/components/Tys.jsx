import { useState } from 'react';

const Tys = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  const domains = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'data', name: 'Data Analysis' },
    { id: 'pm', name: 'Project Management' },
    { id: 'content', name: 'Content Creation' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'psychology', name: 'Psychology' },
    { id: 'writing', name: 'Writing' },
    { id: 'design', name: 'Graphic Design' },
    { id: 'art', name: 'Artist' },
    { id: 'finance', name: 'Finance' },
    { id: 'science', name: 'Science' },
    { id: 'teaching', name: 'Teaching' },
    { id: 'entrepreneur', name: 'Entrepreneurship' },
    { id: 'journalism', name: 'Journalism' },
    { id: 'architecture', name: 'Architecture' },
    { id: 'gamedesign', name: 'Game Design' },
    { id: 'math', name: 'Mathematics' },
    { id: 'anthropology', name: 'Anthropology' },
    { id: 'crafts', name: 'Craftsmanship' },
    { id: 'philosophy', name: 'Philosophy' }
  ];

  const resources = {
    cs: {
      beginner: [
        { type: 'video', title: 'Introduction to Programming', url: '#', description: 'Fundamentals of programming concepts' },
        { type: 'blog', title: 'Getting Started with Python', url: '#', description: 'Easy guide to Python basics' },
        { type: 'pdf', title: 'Computer Science Fundamentals', url: '#', description: 'Core CS concepts explained simply' }
      ],
      intermediate: [
        { type: 'video', title: 'Data Structures & Algorithms', url: '#', description: 'Deep dive into DSA concepts' },
        { type: 'blog', title: 'Web Development Frameworks', url: '#', description: 'Comparing popular web frameworks' },
        { type: 'pdf', title: 'Object-Oriented Programming', url: '#', description: 'Comprehensive guide to OOP principles' }
      ],
      advanced: [
        { type: 'video', title: 'System Design & Architecture', url: '#', description: 'Building scalable systems' },
        { type: 'blog', title: 'Advanced Database Concepts', url: '#', description: 'Beyond basic database management' },
        { type: 'pdf', title: 'Machine Learning Algorithms', url: '#', description: 'Mathematical foundations of ML' }
      ]
    },
    data: {
      beginner: [
        { type: 'video', title: 'Introduction to Data Analysis', url: '#', description: 'Basic concepts and tools' },
        { type: 'blog', title: 'Getting Started with Excel', url: '#', description: 'Excel fundamentals for data analysis' },
        { type: 'pdf', title: 'Statistics Primer', url: '#', description: 'Essential statistical concepts' }
      ],
      intermediate: [
        { type: 'video', title: 'Python for Data Analysis', url: '#', description: 'Using pandas and numpy' },
        { type: 'blog', title: 'Data Visualization Techniques', url: '#', description: 'Creating effective visualizations' },
        { type: 'pdf', title: 'SQL for Data Analysts', url: '#', description: 'Database queries for analysis' }
      ],
      advanced: [
        { type: 'video', title: 'Advanced Predictive Modeling', url: '#', description: 'Complex data modeling techniques' },
        { type: 'blog', title: 'Big Data Technologies', url: '#', description: 'Working with large-scale data' },
        { type: 'pdf', title: 'Time Series Analysis', url: '#', description: 'Methods for temporal data analysis' }
      ]
    },
    // Sample data for one more domain
    writing: {
      beginner: [
        { type: 'video', title: 'Fundamentals of Good Writing', url: '#', description: 'Basic principles for clear communication' },
        { type: 'blog', title: 'Grammar and Style Guide', url: '#', description: 'Essential rules for clean writing' },
        { type: 'pdf', title: 'Writing Process Overview', url: '#', description: 'From ideation to final draft' }
      ],
      intermediate: [
        { type: 'video', title: 'Storytelling Techniques', url: '#', description: 'Creating compelling narratives' },
        { type: 'blog', title: 'Content Structure Strategies', url: '#', description: 'Organizing your thoughts effectively' },
        { type: 'pdf', title: 'Editing and Proofreading', url: '#', description: 'Polishing your written work' }
      ],
      advanced: [
        { type: 'video', title: 'Advanced Rhetoric', url: '#', description: 'Persuasive writing techniques' },
        { type: 'blog', title: 'Writing for Different Audiences', url: '#', description: 'Adapting style and tone' },
        { type: 'pdf', title: 'Publishing and Promotion', url: '#', description: 'Getting your writing seen' }
      ]
    }
    // Additional domains would be defined similarly
  };

  // For demo purposes - in a real app, all domains would have content
  const getResources = (domain, level) => {
    if (resources[domain] && resources[domain][level]) {
      return resources[domain][level];
    }
    // Default content if specific domain/level isn't defined yet
    return [
      { type: 'video', title: 'Introduction to the Field', url: '#', description: 'Basic concepts overview' },
      { type: 'blog', title: 'Getting Started Guide', url: '#', description: 'Essential first steps' },
      { type: 'pdf', title: 'Core Principles', url: '#', description: 'Fundamental concepts explained' }
    ];
  };

  // Resource type icons
  const getIcon = (type) => {
    switch(type) {
      case 'video': return '📹';
      case 'blog': return '📝';
      case 'pdf': return '📄';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1324] to-[#1A2540]">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          <span className="text-[#AD46FF]">Train</span> Yourself
        </h1>
        <p className="text-gray-300">Comprehensive learning resources from beginner to advanced</p>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Domain Selection */}
        {!selectedDomain ? (
          <div>
            <h2 className="text-2xl font-bold text-[#AD46FF] mb-6">Select a Domain to Begin</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {domains.map(domain => (
                <button
                  key={domain.id}
                  className="bg-[#1E293B] p-4 rounded-lg text-white hover:bg-[#AD46FF] transition-colors border border-[#AD46FF]/30 hover:border-[#AD46FF]"
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  {domain.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button 
                className="text-[#AD46FF] hover:underline flex items-center"
                onClick={() => setSelectedDomain(null)}
              >
                ← Back to All Domains
              </button>
              <h2 className="text-2xl font-bold text-white">
                {domains.find(d => d.id === selectedDomain)?.name}
              </h2>
              <div></div> {/* Empty div for flex spacing */}
            </div>

            {/* Level tabs */}
            <div className="flex border-b border-[#AD46FF]/30 mb-6">
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <button
                  key={level}
                  className={`px-4 py-2 font-medium ${
                    selectedLevel === level 
                      ? 'text-[#AD46FF] border-b-2 border-[#AD46FF]' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>

            {/* Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResources(selectedDomain, selectedLevel).map((resource, index) => (
                <div 
                  key={index} 
                  className="bg-[#1E293B] rounded-lg overflow-hidden border border-[#AD46FF]/20 hover:border-[#AD46FF]/50 transition-all"
                >
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{getIcon(resource.type)}</span>
                      <span className="text-sm uppercase text-gray-400">{resource.type}</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">{resource.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{resource.description}</p>
                    <a 
                      href={resource.url} 
                      className="inline-block bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white px-4 py-2 rounded transition-colors"
                    >
                      Access Resource
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning path */}
            <div className="mt-10 bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30">
              <h3 className="text-xl font-bold text-[#AD46FF] mb-4">Learning Path</h3>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-medium text-white mb-2">Beginner</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Understand core concepts</li>
                    <li>• Learn fundamental terminology</li>
                    <li>• Practice basic techniques</li>
                  </ul>
                </div>
                <div className="mb-4 md:mb-0">
                  <h4 className="font-medium text-white mb-2">Intermediate</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Build on core knowledge</li>
                    <li>• Develop practical skills</li>
                    <li>• Complete guided projects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Advanced</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Master complex techniques</li>
                    <li>• Develop specialized knowledge</li>
                    <li>• Create original contributions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>NextStep © {new Date().getFullYear()} | Expand your knowledge and skills</p>
      </footer>
    </div>
  );
};

export default Tys;