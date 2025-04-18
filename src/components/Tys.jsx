import { useState, useEffect } from 'react';

const Tys = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [completedResources, setCompletedResources] = useState({});
  const [userProgress, setUserProgress] = useState(0);

  // Load saved progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('learningProgress');
    const savedCompletedResources = localStorage.getItem('completedResources');

    if (savedProgress) setUserProgress(parseInt(savedProgress, 10));
    if (savedCompletedResources) setCompletedResources(JSON.parse(savedCompletedResources));
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningProgress', userProgress.toString());
    localStorage.setItem('completedResources', JSON.stringify(completedResources));
  }, [userProgress, completedResources]);

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

  // Expanded resources with real URLs and structured for unlocking
  const resources = {
    cs: {
      beginner: [
        {
          id: 'cs_beg_1',
          type: 'video',
          title: 'Introduction to Programming',
          url: 'https://www.youtube.com/watch?v=zOjov-2OZ0E',
          description: 'Fundamentals of programming concepts',
          unlockRequirement: null,
          estimatedTime: '45 min'
        },
        {
          id: 'cs_beg_2',
          type: 'blog',
          title: 'Getting Started with Python',
          url: 'https://medium.com/swlh/python-for-beginners-the-ultimate-guide-37ac3fa4f35c',
          description: 'Easy guide to Python basics',
          unlockRequirement: 'cs_beg_1',
          estimatedTime: '30 min'
        },
        {
          id: 'cs_beg_3',
          type: 'pdf',
          title: 'Computer Science Fundamentals',
          url: 'https://greenteapress.com/thinkpython/thinkpython.pdf',
          description: 'Core CS concepts explained simply',
          unlockRequirement: 'cs_beg_2',
          estimatedTime: '2 hours'
        }
      ],
      intermediate: [
        {
          id: 'cs_int_1',
          type: 'video',
          title: 'Data Structures & Algorithms',
          url: 'https://www.youtube.com/watch?v=B31LgI4Y4DQ',
          description: 'Deep dive into DSA concepts',
          unlockRequirement: 'cs_beg_3',
          estimatedTime: '1 hour'
        },
        {
          id: 'cs_int_2',
          type: 'blog',
          title: 'Web Development Frameworks',
          url: 'https://medium.com/javarevisited/10-best-frontend-frameworks-for-web-development-in-2021-5ee67e7f48e5',
          description: 'Comparing popular web frameworks',
          unlockRequirement: 'cs_int_1',
          estimatedTime: '45 min'
        },
        {
          id: 'cs_int_3',
          type: 'pdf',
          title: 'Object-Oriented Programming',
          url: 'https://web.mit.edu/6.031/www/sp21/ocw/refs/pdf/oopvoodoo.pdf',
          description: 'Comprehensive guide to OOP principles',
          unlockRequirement: 'cs_int_2',
          estimatedTime: '3 hours'
        }
      ],
      advanced: [
        {
          id: 'cs_adv_1',
          type: 'video',
          title: 'System Design & Architecture',
          url: 'https://www.youtube.com/watch?v=ZgdS0EUmn70',
          description: 'Building scalable systems',
          unlockRequirement: 'cs_int_3',
          estimatedTime: '1.5 hours'
        },
        {
          id: 'cs_adv_2',
          type: 'blog',
          title: 'Advanced Database Concepts',
          url: 'https://medium.com/swlh/advanced-sql-techniques-you-need-to-know-for-data-science-91bec94f57f5',
          description: 'Beyond basic database management',
          unlockRequirement: 'cs_adv_1',
          estimatedTime: '1 hour'
        },
        {
          id: 'cs_adv_3',
          type: 'pdf',
          title: 'Machine Learning Algorithms',
          url: 'https://web.stanford.edu/~hastie/Papers/ESLII.pdf',
          description: 'Mathematical foundations of ML',
          unlockRequirement: 'cs_adv_2',
          estimatedTime: '4 hours'
        }
      ]
    },
    data: {
      beginner: [
        {
          id: 'data_beg_1',
          type: 'video',
          title: 'Introduction to Data Analysis',
          url: 'https://www.youtube.com/watch?v=UA-XIxK6c2k',
          description: 'Basic concepts and tools',
          unlockRequirement: null,
          estimatedTime: '35 min'
        },
        {
          id: 'data_beg_2',
          type: 'blog',
          title: 'Getting Started with Excel',
          url: 'https://medium.com/analytics-vidhya/excel-for-data-analysis-42f3277ff3a4',
          description: 'Excel fundamentals for data analysis',
          unlockRequirement: 'data_beg_1',
          estimatedTime: '40 min'
        },
        {
          id: 'data_beg_3',
          type: 'pdf',
          title: 'Statistics Primer',
          url: 'https://web.mit.edu/~csvoss/Public/usabo/stats_handout.pdf',
          description: 'Essential statistical concepts',
          unlockRequirement: 'data_beg_2',
          estimatedTime: '1.5 hours'
        }
      ],
      intermediate: [
        {
          id: 'data_int_1',
          type: 'video',
          title: 'Python for Data Analysis',
          url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
          description: 'Using pandas and numpy',
          unlockRequirement: 'data_beg_3',
          estimatedTime: '1.5 hours'
        },
        {
          id: 'data_int_2',
          type: 'blog',
          title: 'Data Visualization Techniques',
          url: 'https://towardsdatascience.com/data-visualization-for-machine-learning-and-data-science-a45178970be7',
          description: 'Creating effective visualizations',
          unlockRequirement: 'data_int_1',
          estimatedTime: '50 min'
        },
        {
          id: 'data_int_3',
          type: 'pdf',
          title: 'SQL for Data Analysts',
          url: 'https://www.w3schools.com/sql/sql_quickref.asp',
          description: 'Database queries for analysis',
          unlockRequirement: 'data_int_2',
          estimatedTime: '2 hours'
        }
      ],
      advanced: [
        {
          id: 'data_adv_1',
          type: 'video',
          title: 'Advanced Predictive Modeling',
          url: 'https://www.youtube.com/watch?v=68ABAU_V8qI',
          description: 'Complex data modeling techniques',
          unlockRequirement: 'data_int_3',
          estimatedTime: '2 hours'
        },
        {
          id: 'data_adv_2',
          type: 'blog',
          title: 'Big Data Technologies',
          url: 'https://towardsdatascience.com/big-data-analysis-spark-and-hadoop-a11ba591c057',
          description: 'Working with large-scale data',
          unlockRequirement: 'data_adv_1',
          estimatedTime: '1 hour'
        },
        {
          id: 'data_adv_3',
          type: 'pdf',
          title: 'Time Series Analysis',
          url: 'https://otexts.com/fpp2/index.html',
          description: 'Methods for temporal data analysis',
          unlockRequirement: 'data_adv_2',
          estimatedTime: '3 hours'
        }
      ]
    },
    writing: {
      beginner: [
        {
          id: 'writing_beg_1',
          type: 'video',
          title: 'Fundamentals of Good Writing',
          url: 'https://www.youtube.com/watch?v=aFAiI1uLEno',
          description: 'Basic principles for clear communication',
          unlockRequirement: null,
          estimatedTime: '25 min'
        },
        {
          id: 'writing_beg_2',
          type: 'blog',
          title: 'Grammar and Style Guide',
          url: 'https://medium.com/an-idea/a-simple-guide-to-powerful-writing-f6a49a1e3a1f',
          description: 'Essential rules for clean writing',
          unlockRequirement: 'writing_beg_1',
          estimatedTime: '30 min'
        },
        {
          id: 'writing_beg_3',
          type: 'pdf',
          title: 'Writing Process Overview',
          url: 'https://owl.purdue.edu/owl/general_writing/the_writing_process/index.html',
          description: 'From ideation to final draft',
          unlockRequirement: 'writing_beg_2',
          estimatedTime: '1 hour'
        }
      ],
      intermediate: [
        {
          id: 'writing_int_1',
          type: 'video',
          title: 'Storytelling Techniques',
          url: 'https://www.youtube.com/watch?v=oP0Fc0CikoI',
          description: 'Creating compelling narratives',
          unlockRequirement: 'writing_beg_3',
          estimatedTime: '45 min'
        },
        {
          id: 'writing_int_2',
          type: 'blog',
          title: 'Content Structure Strategies',
          url: 'https://medium.com/swlh/how-to-organize-your-thoughts-on-paper-8a795a9c4277',
          description: 'Organizing your thoughts effectively',
          unlockRequirement: 'writing_int_1',
          estimatedTime: '35 min'
        },
        {
          id: 'writing_int_3',
          type: 'pdf',
          title: 'Editing and Proofreading',
          url: 'https://writing.wisc.edu/handbook/process/revising/',
          description: 'Polishing your written work',
          unlockRequirement: 'writing_int_2',
          estimatedTime: '1.5 hours'
        }
      ],
      advanced: [
        {
          id: 'writing_adv_1',
          type: 'video',
          title: 'Advanced Rhetoric',
          url: 'https://www.youtube.com/watch?v=gXoNvFk_LsE',
          description: 'Persuasive writing techniques',
          unlockRequirement: 'writing_int_3',
          estimatedTime: '1 hour'
        },
        {
          id: 'writing_adv_2',
          type: 'blog',
          title: 'Writing for Different Audiences',
          url: 'https://medium.com/writers-guild/how-to-adapt-your-writing-to-different-audiences-f2d44d20b671',
          description: 'Adapting style and tone',
          unlockRequirement: 'writing_adv_1',
          estimatedTime: '40 min'
        },
        {
          id: 'writing_adv_3',
          type: 'pdf',
          title: 'Publishing and Promotion',
          url: 'https://self-publishingschool.com/how-to-publish-a-book/',
          description: 'Getting your writing seen',
          unlockRequirement: 'writing_adv_2',
          estimatedTime: '2 hours'
        }
      ]
    },
    pm: {
      beginner: [
        {
          id: 'pm_beg_1',
          type: 'video',
          title: 'Project Management Fundamentals',
          url: 'https://www.youtube.com/watch?v=ff5cBkPg-bQ',
          description: 'Introduction to project management principles',
          unlockRequirement: null,
          estimatedTime: '40 min'
        },
        {
          id: 'pm_beg_2',
          type: 'blog',
          title: 'Understanding Project Scope',
          url: 'https://medium.com/swlh/mastering-project-scope-a-guide-for-project-managers-1b4a3a1102a1',
          description: 'How to properly define project boundaries',
          unlockRequirement: 'pm_beg_1',
          estimatedTime: '25 min'
        },
        {
          id: 'pm_beg_3',
          type: 'pdf',
          title: 'Project Management Terminology',
          url: 'https://www.pmi.org/pmbok-guide-standards/lexicon',
          description: 'Essential PM terms and concepts',
          unlockRequirement: 'pm_beg_2',
          estimatedTime: '1 hour'
        }
      ],
      intermediate: [
        {
          id: 'pm_int_1',
          type: 'video',
          title: 'Agile Project Management',
          url: 'https://www.youtube.com/watch?v=Z9QbYZh1YXY',
          description: 'Implementing agile methodologies',
          unlockRequirement: 'pm_beg_3',
          estimatedTime: '55 min'
        },
        {
          id: 'pm_int_2',
          type: 'blog',
          title: 'Risk Management Strategies',
          url: 'https://medium.com/pminsider/risk-management-in-project-management-5e1e1bf15bfb',
          description: 'Identifying and mitigating project risks',
          unlockRequirement: 'pm_int_1',
          estimatedTime: '35 min'
        },
        {
          id: 'pm_int_3',
          type: 'pdf',
          title: 'Project Budgeting Guide',
          url: 'https://www.projectmanager.com/blog/project-budget-guide',
          description: 'Creating and managing project budgets',
          unlockRequirement: 'pm_int_2',
          estimatedTime: '1.5 hours'
        }
      ],
      advanced: [
        {
          id: 'pm_adv_1',
          type: 'video',
          title: 'Advanced Project Leadership',
          url: 'https://www.youtube.com/watch?v=wgLeSe8pN3I',
          description: 'Leading complex projects and teams',
          unlockRequirement: 'pm_int_3',
          estimatedTime: '1.5 hours'
        },
        {
          id: 'pm_adv_2',
          type: 'blog',
          title: 'Program and Portfolio Management',
          url: 'https://medium.com/swlh/program-management-vs-portfolio-management-vs-project-management-c67eed174e8d',
          description: 'Managing multiple projects strategically',
          unlockRequirement: 'pm_adv_1',
          estimatedTime: '45 min'
        },
        {
          id: 'pm_adv_3',
          type: 'pdf',
          title: 'PMP Certification Preparation',
          url: 'https://www.pmi.org/certifications/project-management-pmp',
          description: 'Preparing for professional certification',
          unlockRequirement: 'pm_adv_2',
          estimatedTime: '4 hours'
        }
      ]
    }
    // Additional domains would be defined similarly
  };

  // Generate default content for domains not explicitly defined
  const generateDefaultContent = (domainId) => {
    return {
      beginner: [
        {
          id: `${domainId}_beg_1`,
          type: 'video',
          title: 'Introduction to the Field',
          url: 'https://www.youtube.com/results?search_query=introduction+to+' + domains.find(d => d.id === domainId)?.name.toLowerCase(),
          description: 'Basic concepts overview',
          unlockRequirement: null,
          estimatedTime: '40 min'
        },
        {
          id: `${domainId}_beg_2`,
          type: 'blog',
          title: 'Getting Started Guide',
          url: 'https://medium.com/search?q=' + domains.find(d => d.id === domainId)?.name.toLowerCase() + '%20beginners',
          description: 'Essential first steps',
          unlockRequirement: `${domainId}_beg_1`,
          estimatedTime: '30 min'
        },
        {
          id: `${domainId}_beg_3`,
          type: 'pdf',
          title: 'Core Principles',
          url: 'https://www.google.com/search?q=' + domains.find(d => d.id === domainId)?.name.toLowerCase() + '+fundamentals+pdf',
          description: 'Fundamental concepts explained',
          unlockRequirement: `${domainId}_beg_2`,
          estimatedTime: '1.5 hours'
        }
      ],
      intermediate: [
        {
          id: `${domainId}_int_1`,
          type: 'video',
          title: 'Intermediate Concepts',
          url: 'https://www.youtube.com/results?search_query=intermediate+' + domains.find(d => d.id === domainId)?.name.toLowerCase(),
          description: 'Building on basic knowledge',
          unlockRequirement: `${domainId}_beg_3`,
          estimatedTime: '1 hour'
        },
        {
          id: `${domainId}_int_2`,
          type: 'blog',
          title: 'Advanced Techniques',
          url: 'https://medium.com/search?q=' + domains.find(d => d.id === domainId)?.name.toLowerCase() + '%20intermediate',
          description: 'Developing practical skills',
          unlockRequirement: `${domainId}_int_1`,
          estimatedTime: '45 min'
        },
        {
          id: `${domainId}_int_3`,
          type: 'pdf',
          title: 'Case Studies',
          url: 'https://www.google.com/search?q=' + domains.find(d => d.id === domainId)?.name.toLowerCase() + '+case+studies+pdf',
          description: 'Real-world applications',
          unlockRequirement: `${domainId}_int_2`,
          estimatedTime: '2 hours'
        }
      ],
      advanced: [
        {
          id: `${domainId}_adv_1`,
          type: 'video',
          title: 'Expert-Level Topics',
          url: 'https://www.youtube.com/results?search_query=advanced+' + domains.find(d => d.id === domainId)?.name.toLowerCase(),
          description: 'Specialized knowledge',
          unlockRequirement: `${domainId}_int_3`,
          estimatedTime: '1.5 hours'
        },
        {
          id: `${domainId}_adv_2`,
          type: 'blog',
          title: 'Professional Insights',
          url: 'https://medium.com/search?q=' + domains.find(d => d.id === domainId)?.name.toLowerCase() + '%20advanced',
          description: 'Industry expert perspectives',
          unlockRequirement: `${domainId}_adv_1`,
          estimatedTime: '1 hour'
        },
        {
          id: `${domainId}_adv_3`,
          type: 'pdf',
          title: 'Research Papers',
          url: 'https://scholar.google.com/scholar?q=' + domains.find(d => d.id === domainId)?.name.toLowerCase(),
          description: 'Academic research and findings',
          unlockRequirement: `${domainId}_adv_2`,
          estimatedTime: '3 hours'
        }
      ]
    };
  };

  // Get resources with unlocking logic
  const getResources = (domain, level) => {
    if (resources[domain] && resources[domain][level]) {
      return resources[domain][level];
    }

    // Generate default content if specific domain isn't defined yet
    return generateDefaultContent(domain)[level];
  };

  // Check if a resource is unlocked
  const isResourceUnlocked = (resource) => {
    // First resource is always unlocked
    if (!resource.unlockRequirement) return true;

    // Check if the required previous resource is completed
    return completedResources[resource.unlockRequirement] === true;
  };

  // Mark a resource as completed
  const markAsCompleted = (resourceId) => {
    setCompletedResources(prev => {
      const updated = { ...prev, [resourceId]: true };

      // Calculate progress percentage for current domain and level
      const currentResources = getResources(selectedDomain, selectedLevel);
      const completedCount = currentResources.filter(r => updated[r.id]).length;
      const newProgress = Math.floor((completedCount / currentResources.length) * 100);

      setUserProgress(newProgress);

      return updated;
    });
  };

  // Resource type icons
  const getIcon = (type) => {
    switch (type) {
      case 'video': return '📹';
      case 'blog': return '📝';
      case 'pdf': return '📄';
      default: return '📚';
    }
  };

  // Calculate estimated total time for a level
  const getTotalEstimatedTime = (domain, level) => {
    const levelResources = getResources(domain, level);
    return levelResources.reduce((total, resource) => {
      const time = resource.estimatedTime || '0 min';
      const hours = time.includes('hour') ? parseFloat(time) * 60 : 0;
      const minutes = time.includes('min') ? parseFloat(time) : 0;
      return total + hours + minutes;
    }, 0);
  };

  // Format minutes to hours and minutes
  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
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

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Your Progress</span>
                <span className="text-[#AD46FF]">{userProgress}%</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-4 overflow-hidden">
                <div
                  className="bg-[#AD46FF] h-4 rounded-full transition-all duration-500"
                  style={{ width: `${userProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Level tabs */}
            <div className="flex border-b border-[#AD46FF]/30 mb-6">
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <button
                  key={level}
                  className={`px-4 py-2 font-medium ${selectedLevel === level
                      ? 'text-[#AD46FF] border-b-2 border-[#AD46FF]'
                      : 'text-gray-400 hover:text-gray-200'
                    }`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTime(getTotalEstimatedTime(selectedDomain, level))}
                  </span>
                </button>
              ))}
            </div>

            {/* Timeline with resources */}
            <div className="mb-10">
              {getResources(selectedDomain, selectedLevel).map((resource, index) => {
                const isUnlocked = isResourceUnlocked(resource);
                const isCompleted = completedResources[resource.id] === true;

                return (
                  <div key={resource.id} className="relative pb-10">
                    {/* Timeline line */}
                    {index < getResources(selectedDomain, selectedLevel).length - 1 && (
                      <div className={`absolute top-10 left-4 h-full w-0.5 ${isCompleted ? 'bg-[#AD46FF]' : 'bg-gray-700'}`}></div>
                    )}

                    {/* Resource card */}
                    <div className={`flex mb-4 ${!isUnlocked ? 'opacity-60' : ''}`}>
                      {/* Timeline dot */}
                      <div className="mt-2 mr-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                            ? 'bg-[#AD46FF] text-white'
                            : isUnlocked
                              ? 'bg-[#1E293B] border-2 border-[#AD46FF] text-[#AD46FF]'
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                          {isCompleted ? '✓' : index + 1}
                        </div>
                      </div>

                      {/* Resource content */}
                      <div className="flex-1 bg-[#1E293B] rounded-lg overflow-hidden border border-[#AD46FF]/20 hover:border-[#AD46FF]/50 transition-all">
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">{getIcon(resource.type)}</span>
                            <span className="text-sm uppercase text-gray-400">{resource.type}</span>
                            <span className="ml-auto text-sm text-gray-400">{resource.estimatedTime}</span>
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">{resource.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{resource.description}</p>

                          <div className="flex items-center justify-between">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-block ${isUnlocked
                                  ? 'bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white'
                                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                } px-4 py-2 rounded transition-colors`}
                              onClick={(e) => {
                                if (!isUnlocked) {
                                  e.preventDefault();
                                  alert('Complete previous resources to unlock this one!');
                                }
                              }}
                            >
                              {isUnlocked ? 'Access Resource' : 'Locked'}
                            </a>

                            {isUnlocked && !isCompleted && (
                              <button
                                onClick={() => markAsCompleted(resource.id)}
                                className="ml-3 bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                              >
                                Mark as Completed
                              </button>
                            )}

                            {isCompleted && (
                              <span className="text-green-500 font-medium">Completed</span>
                            )}
                          </div>

                          {!isUnlocked && (
                            <div className="mt-3 text-sm text-yellow-400">
                              Complete previous {resource.type} to unlock
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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

            {/* Resource Recommendations */}
            <div className="mt-8 bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30">
              <h3 className="text-xl font-bold text-[#AD46FF] mb-4">Additional Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-[#0D1324] rounded-lg">
                  <h4 className="font-medium text-white mb-2">Top YouTube Channels</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• {domains.find(d => d.id === selectedDomain)?.name} Academy</li>
                    <li>• Learn {domains.find(d => d.id === selectedDomain)?.name}</li>
                    <li>• {domains.find(d => d.id === selectedDomain)?.name} Mastery</li>
                  </ul>
                </div>
                <div className="p-3 bg-[#0D1324] rounded-lg">
                  <h4 className="font-medium text-white mb-2">Best Blogs & Publications</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Medium's {domains.find(d => d.id === selectedDomain)?.name} Collection</li>
                    <li>• {domains.find(d => d.id === selectedDomain)?.name} Today</li>
                    <li>• The {domains.find(d => d.id === selectedDomain)?.name} Journal</li>
                  </ul>
                </div>
                <div className="p-3 bg-[#0D1324] rounded-lg">
                  <h4 className="font-medium text-white mb-2">Free E-Books & PDFs</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• {domains.find(d => d.id === selectedDomain)?.name} Fundamentals</li>
                    <li>• Practical {domains.find(d => d.id === selectedDomain)?.name}</li>
                    <li>• {domains.find(d => d.id === selectedDomain)?.name} Handbook</li>
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

