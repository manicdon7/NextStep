import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleOnHover } from '../components/Animations';
import {
  User,
  Mail,
  Github,
  Award,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Briefcase,
  BookOpen,
  Linkedin,
  Globe,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../constants';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [quote, setQuote] = useState('Stay curious, keep learning!');
  const [careerSuggestion, setCareerSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('progress');
  const navigate = useNavigate();

  // Fetch profile and progress data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const userId = localStorage.getItem('userId');

      if (!token || !email || !userId) {
        toast.error('Please log in to view your profile');
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        // Fetch profile data
        const profileResponse = await fetch(`${API_URL}/api/profile/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        if (profileData.success && profileData.data) {
          setData(profileData.data);
        } else {
          throw new Error('Unexpected profile response format');
        }

        // Fetch progress data
        const progressResponse = await fetch(`${API_URL}/api/progress/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!progressResponse.ok) {
          throw new Error(`Failed to fetch progress: ${progressResponse.status}`);
        }

        const progressData = await progressResponse.json();
        setProgress(progressData.data || progressData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // AI API integration for quotes and career suggestions
  const getAIResponse = async (prompt) => {
    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return data.trim();
    } catch (error) {
      console.error('AI API Error:', error);
      return null;
    }
  };

  // Fetch AI-generated quote and career suggestion
  useEffect(() => {
    if (!data) return;

    let isFetching = false;

    const fetchAIContent = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const skillsList = data.skills?.length ? data.skills.join(', ') : 'various technologies';
        const certsList = data.certifications?.length ? data.certifications.join(', ') : 'multiple fields';
        const educationList = data.education?.length ? data.education.join(', ') : 'diverse studies';
        const experienceList = data.experience?.length ? data.experience.join(', ') : 'varied experiences';

        // Fetch motivational quote
        const quotePrompt = `Generate a one-line motivational quote (max 80 characters) for ${data.name || 'User'}, skilled in ${skillsList}, certified in ${certsList}, educated in ${educationList}, experienced in ${experienceList}, described as "${data.bio || 'a curious learner'}"`;
        const newQuote = await getAIResponse(quotePrompt);
        if (newQuote) setQuote(newQuote);

        // Fetch career suggestion
        const careerPrompt = `Suggest a career path or tip (max 100 characters) for ${data.name || 'User'}, skilled in ${skillsList}, certified in ${certsList}, educated in ${educationList}, experienced in ${experienceList}`;
        const newSuggestion = await getAIResponse(careerPrompt);
        if (newSuggestion) setCareerSuggestion(newSuggestion);
      } catch (err) {
        console.error('Error fetching AI content:', err);
        toast.error('Failed to load AI content', { toastId: 'ai-error' });
      } finally {
        isFetching = false;
      }
    };

    fetchAIContent();
    const interval = setInterval(fetchAIContent, 60000); // Every 1 minute

    return () => clearInterval(interval);
  }, [data]);

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    }
    setIsEditing(!isEditing);
    toast.info(isEditing ? 'Changes saved' : 'Editing profile');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      toast.error('Please log in to save your profile');
      navigate('/login');
      return;
    }

    if (!data || typeof data !== 'object') {
      setError('Invalid profile data');
      toast.error('Invalid profile data');
      return;
    }

    const validatedData = {
      name: typeof data.name === 'string' ? data.name.trim() : undefined,
      bio: typeof data.bio === 'string' ? data.bio.trim() : undefined,
      skills: Array.isArray(data.skills) ? data.skills.map(skill => skill.trim()).filter(skill => skill) : undefined,
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.map(socialLink => socialLink.trim()).filter(socialLink => socialLink) : undefined,
      github: typeof data.socialLinks?.github === 'string' ? data.socialLinks.github.trim() : undefined,
      linkedin: typeof data.socialLinks?.linkedin === 'string' ? data.socialLinks.linkedin.trim() : undefined,
      portfolio: typeof data.socialLinks?.portfolio === 'string' ? data.socialLinks.portfolio.trim() : undefined,
      certifications: Array.isArray(data.certifications) ? data.certifications.map(cert => cert.trim()).filter(cert => cert) : undefined,
      education: Array.isArray(data.education) ? data.education.map(edu => edu.trim()).filter(edu => edu) : undefined,
      experience: Array.isArray(data.experience) ? data.experience.map(exp => exp.trim()).filter(exp => exp) : undefined,
      learningStreaks: typeof data.learningStreaks === 'string' ? data.learningStreaks : undefined,
    };

    const payload = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(payload).length === 0) {
      setError('No valid data to save');
      toast.warn('No valid data to save');
      return;
    }

    // Validate URLs
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/;
    for (const key of ['github', 'linkedin', 'portfolio']) {
      if (payload[key] && !urlPattern.test(payload[key])) {
        setError(`Invalid ${key} URL`);
        toast.error(`Invalid ${key} URL`);
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/profile/${email}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          setError(responseData.message || 'Unauthorized access');
          toast.error(responseData.message || 'Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        throw new Error(`Failed to update profile: ${responseData.message || 'Unknown error'}`);
      }

      if (responseData.success && responseData.data) {
        setData(responseData.data);
        toast.success('Profile updated successfully');
        setError('');
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to save profile');
    }
  };

  const handleInputChange = (e, field, subfield = null) => {
    const { name, value } = e.target;
    if (subfield) {
      setData(prev => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: value },
      }));
    } else {
      setData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addItem = (type, value, setValue) => {
    if (value.trim()) {
      setData(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), value.trim()],
      }));
      setValue('');
      toast.success(`Added ${type.slice(0, -1)}: ${value.trim()}`);
    }
  };

  const removeItem = (type, index) => {
    const item = data[type][index];
    setData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
    toast.success(`Removed ${type.slice(0, -1)}: ${item}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center text-white/70">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-400"></div>
            <span className="mt-4">Loading profile...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 bg-white/10 p-6 rounded-xl shadow-lg max-w-md text-center">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white/70 bg-white/10 p-6 rounded-xl shadow-lg max-w-md text-center">
            No profile data available.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            {/* Profile Header */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-lg shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center ring-4 ring-purple-500/30">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={data.name || ''}
                          onChange={handleInputChange}
                          className="text-3xl font-bold bg-white/10 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                          placeholder="Enter your name"
                        />
                      ) : (
                        <h1 className="text-3xl font-bold text-white">{data.name || 'Anonymous User'}</h1>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-white/80">
                        <Mail size={16} className="text-purple-400" />
                        <p>{data.email || 'N/A'}</p>
                      </div>
                      {data.learningStreaks && (
                        <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-white/70 text-sm">
                          <Calendar className="text-purple-400" size={16} />
                          <span>Last Active: {new Date(data.learningStreaks).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <ScaleOnHover>
                      <button
                        onClick={handleEditToggle}
                        className={`p-3 rounded-lg transition-colors ${
                          isEditing
                            ? 'bg-green-600/30 text-green-300 hover:bg-green-600/40'
                            : 'bg-purple-600/30 text-purple-300 hover:bg-purple-600/40'
                        }`}
                        aria-label={isEditing ? 'Save profile' : 'Edit profile'}
                      >
                        {isEditing ? <Save size={24} /> : <Edit3 size={24} />}
                      </button>
                    </ScaleOnHover>
                  </div>
                </div>
              </div>
              {/* AI Quote */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-800/20 to-indigo-800/20 rounded-xl flex items-center gap-3">
                <Sparkles className="text-purple-400" size={20} />
                <p className="text-white/90 italic text-sm font-medium">{quote}</p>
              </div>
            </div>

            {/* Career Suggestion Bubble */}
            {careerSuggestion && (
              <FadeIn>
                <div className="fixed bottom-8 right-8 max-w-xs bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-4 rounded-xl shadow-lg z-50 animate-pulse">
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-yellow-300" size={20} />
                    <div>
                      <p className="font-semibold">Career Tip</p>
                      <p className="text-sm">{careerSuggestion}</p>
                    </div>
                    <button
                      onClick={() => setCareerSuggestion('')}
                      className="text-white/70 hover:text-white"
                      aria-label="Dismiss suggestion"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Bio */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={data.bio || ''}
                  onChange={handleInputChange}
                  className="bg-white/10 text-white/80 p-3 rounded-lg w-full h-32 resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  placeholder="Tell us about yourself"
                />
              ) : (
                <p className="text-white/80 leading-relaxed">{data.bio || 'No bio provided.'}</p>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="text-purple-400" size={24} />
                Social Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: 'github', Icon: Github, placeholder: 'GitHub URL' },
                  { key: 'linkedin', Icon: Linkedin, placeholder: 'LinkedIn URL' },
                  { key: 'portfolio', Icon: Globe, placeholder: 'Portfolio URL' },
                ].map(({ key, Icon, placeholder }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className="text-purple-400" size={20} />
                    {isEditing ? (
                      <input
                        type="text"
                        name={key}
                        value={data.socialLinks?.[key] || ''}
                        onChange={(e) => handleInputChange(e, 'socialLinks', key)}
                        placeholder={placeholder}
                        className="bg-white/10 text-white/80 p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      />
                    ) : (
                      <a
                        href={data.socialLinks?.[key] || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-white/80 hover:text-purple-400 transition ${!data.socialLinks?.[key] && 'opacity-50 pointer-events-none'}`}
                      >
                        {data.socialLinks?.[key] || `No ${key} provided`}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Skills */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(data.skills || []).map((skill, index) => (
                    <FadeInStaggerItem key={index}>
                      <span className="px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 text-sm flex items-center shadow-sm">
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeItem('skills', index)}
                            className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                            aria-label={`Remove ${skill}`}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    </FadeInStaggerItem>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="bg-white/10 text-white/80 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      onKeyPress={(e) => e.key === 'Enter' && addItem('skills', newSkill, setNewSkill)}
                    />
                    <button
                      onClick={() => addItem('skills', newSkill, setNewSkill)}
                      className="bg-purple-600/30 text-purple-300 p-3 rounded-lg hover:bg-purple-600/40 transition-colors"
                      aria-label="Add skill"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="text-purple-400" size={24} />
                  Certifications
                </h2>
                <FadeInStagger>
                  {(data.certifications || []).map((cert, index) => (
                    <FadeInStaggerItem key={index}>
                      <div className="group flex items-center justify-between text-white/80 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-purple-400" />
                          <span>{cert}</span>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeItem('certifications', index)}
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove ${cert}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </FadeInStaggerItem>
                  ))}
                </FadeInStagger>
                {isEditing && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add new certification"
                      className="bg-white/10 text-white/80 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      onKeyPress={(e) => e.key === 'Enter' && addItem('certifications', newCertification, setNewCertification)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Education */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="text-purple-400" size={24} />
                  Education
                </h2>
                <FadeInStagger>
                  {(data.education || []).map((edu, index) => (
                    <FadeInStaggerItem key={index}>
                      <div className="group flex items-center justify-between text-white/80 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-purple-400" />
                          <span>{edu}</span>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeItem('education', index)}
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove ${edu}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </FadeInStaggerItem>
                  ))}
                </FadeInStagger>
                {isEditing && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      placeholder="Add new education"
                      className="bg-white/10 text-white/80 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      onKeyPress={(e) => e.key === 'Enter' && addItem('education', newEducation, setNewEducation)}
                    />
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="text-purple-400" size={24} />
                  Experience
                </h2>
                <FadeInStagger>
                  {(data.experience || []).map((exp, index) => (
                    <FadeInStaggerItem key={index}>
                      <div className="group flex items-center justify-between text-white/80 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-purple-400" />
                          <span>{exp}</span>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeItem('experience', index)}
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove ${exp}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </FadeInStaggerItem>
                  ))}
                </FadeInStagger>
                {isEditing && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={newExperience}
                      onChange={(e) => setNewExperience(e.target.value)}
                      placeholder="Add new experience"
                      className="bg-white/10 text-white/80 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      onKeyPress={(e) => e.key === 'Enter' && addItem('experience', newExperience, setNewExperience)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tabbed Section: Progress */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-lg">
              <div className="flex border-b border-white/20 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'progress'
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('progress')}
                >
                  Learning Progress
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto pr-2">
                {progress && progress.levelProgress ? (
                  <FadeInStagger>
                    {Object.entries(progress.levelProgress).map(([domain, levels]) => (
                      <FadeInStaggerItem key={domain}>
                        <div className="mb-6">
                          <h3 className="text-lg font-medium text-white mb-2">{domain}</h3>
                          <div className="space-y-3">
                            {Object.entries(levels).map(([level, percentage]) => (
                              <div key={level} className="flex items-center gap-3">
                                <span className="text-white/80 capitalize w-24">{level}:</span>
                                <div className="flex-1 bg-white/10 rounded-full h-3">
                                  <div
                                    className="bg-gradient-to-r from-purple-400 to-indigo-400 h-3 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-white/80 w-12 text-right">{percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FadeInStaggerItem>
                    ))}
                  </FadeInStagger>
                ) : (
                  <p className="text-white/80">No progress data available.</p>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;