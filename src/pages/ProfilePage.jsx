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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../constants';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [quote, setQuote] = useState('Stay curious, keep learning!');
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('progress');
  const navigate = useNavigate();

  // Fetch profile and progress data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const userId = localStorage.getItem('userId');
      console.log(`Fetching profile for email: ${email}, userId: ${userId}`);

      if (!token || !email || !userId) {
        console.warn('Missing token, email, or userId');
        toast.error('Please log in to view your profile');
        navigate('/login');
        return;
      }

      try {
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
        console.log('Profile data received:', profileData);

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
        console.log('Progress data received:', progressData);
        setProgress(progressData.data || progressData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        toast.error(err.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);


  const getAIResponse = async (userInput) => {
  try {
    // const encodedPrompt = encodePrompt(userInput);
    const response = await fetch(`https://text.pollinations.ai/${userInput}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return "## Oops! 🤔\n\nI apologize, but I'm having trouble connecting right now. Could you please try asking your question again?";
  }
};

  useEffect(() => {
  if (!data) return;

  let isFetching = false; // Prevent overlapping calls
  let lastValidQuote = 'Stay curious, keep learning!'; // Cache last valid quote

  const fetchQuote = async () => {
    if (isFetching) {
      console.log('Skipping quote fetch: previous request still in progress');
      return;
    }

    isFetching = true;
    try {
      // Construct a robust prompt
      const skillsList = data.skills?.length ? data.skills.join(', ') : 'various technologies';
      const certsList = data.certifications?.length ? data.certifications.join(', ') : 'multiple fields';
      const prompt = `Generate a two-line motivational quote (max 100 characters) for a user named ${data.name || 'User'}, skilled in ${skillsList}, certified in ${certsList}, described as "${data.bio || 'a curious learner'}"`;
      console.log('Fetching quote with prompt:', prompt);

      // Fetch quote using getAIResponse
      const quoteText = await getAIResponse(prompt);
      console.log('Quote response:', quoteText);

      // Check for error response from getAIResponse
      if (quoteText.startsWith('## Oops!')) {
        console.warn('AI API error response:', quoteText);
        setQuote(lastValidQuote); // Use last valid quote
        toast.error('Failed to load motivational quote', { toastId: 'quote-error' }); // Prevent duplicate toasts
        return;
      }

      // Update quote and cache it
      const trimmedQuote = quoteText.trim();
      setQuote(trimmedQuote);
      lastValidQuote = trimmedQuote;
    } catch (err) {
      // getAIResponse handles errors, so this is unlikely to trigger
      console.error('Unexpected error fetching quote:', err);
      setQuote(lastValidQuote);
      toast.error('Failed to load motivational quote', { toastId: 'quote-error' });
    } finally {
      isFetching = false;
    }
  };

  fetchQuote(); // Initial fetch
  const interval = setInterval(fetchQuote, 240000); // Every 4 minutes

  return () => clearInterval(interval); // Cleanup
}, [data]);

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    }
    setIsEditing(!isEditing);
    console.log(`Toggled edit mode: ${!isEditing}`);
    toast.info(isEditing ? 'Changes saved' : 'Editing profile');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    console.log(`Saving profile for email: ${email}`, data);

    if (!token || !email) {
      const errorMsg = 'Missing authentication token or email';
      console.warn(errorMsg);
      setError(errorMsg);
      toast.error('Please log in to save your profile');
      navigate('/login');
      return;
    }

    if (!data || typeof data !== 'object') {
      const errorMsg = 'Invalid profile data';
      console.warn(errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const validatedData = {
      name: typeof data.name === 'string' ? data.name.trim() : undefined,
      bio: typeof data.bio === 'string' ? data.bio.trim() : undefined,
      skills: Array.isArray(data.skills) ? data.skills.map(skill => skill.trim()).filter(skill => skill) : undefined,
      github: typeof data.github === 'string' ? data.github.trim() : undefined,
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : undefined,
      certifications: Array.isArray(data.certifications) ? data.certifications.map(cert => cert.trim()).filter(cert => cert) : undefined,
      education: Array.isArray(data.education) ? data.education : undefined,
      experience: Array.isArray(data.experience) ? data.experience : undefined,
      learningStreaks: typeof data.learningStreaks === 'string' ? data.learningStreaks : undefined,
    };

    const payload = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(payload).length === 0) {
      const errorMsg = 'No valid data to save';
      console.warn(errorMsg);
      setError(errorMsg);
      toast.warn(errorMsg);
      return;
    }

    if (payload.github) {
      const urlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/?$/;
      if (!urlPattern.test(payload.github)) {
        const errorMsg = 'Invalid GitHub URL';
        console.warn(errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
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

      let responseData;
      try {
        responseData = await response.json();
        console.log('Save profile response:', responseData);
      } catch (jsonError) {
        console.error('Failed to parse response JSON:', jsonError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        if (response.status === 403) {
          const errorMsg = responseData.message || 'Unauthorized access';
          console.error(errorMsg);
          setError(errorMsg);
          toast.error('You are not authorized to update this profile. Please log in with the correct account.');
          navigate('/login');
          return;
        }
        if (response.status === 401) {
          const errorMsg = responseData.message || 'Invalid or expired token';
          console.error(errorMsg);
          setError(errorMsg);
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        const errorMsg = `Failed to update profile: ${response.status} - ${responseData.message || 'Unknown error'}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      if (responseData.success && responseData.data) {
        setData(responseData.data);
        console.log('Profile updated successfully:', responseData.data);
        toast.success('Profile updated successfully');
        setError('');
      } else {
        console.warn('Unexpected response format:', responseData);
        throw new Error('Unexpected response format from server');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to save profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`Updated field ${name}: ${value}`);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
      console.log(`Added skill: ${newSkill.trim()}`);
      toast.success(`Added skill: ${newSkill.trim()}`);
    }
  };

  const removeSkill = (index) => {
    const skill = data.skills[index];
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
    console.log(`Removed skill at index: ${index}`);
    toast.success(`Removed skill: ${skill}`);
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setData((prev) => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification.trim()],
      }));
      setNewCertification('');
      console.log(`Added certification: ${newCertification.trim()}`);
      toast.success(`Added certification: ${newCertification.trim()}`);
    }
  };

  const removeCertification = (index) => {
    const cert = data.certifications[index];
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
    console.log(`Removed certification at index: ${index}`);
    toast.success(`Removed certification: ${cert}`);
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
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-800">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            {/* Profile Header */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-8 mb-8 backdrop-blur-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-purple-600/20 flex items-center justify-center ring-4 ring-purple-500/30">
                  <User className="w-16 h-16 text-purple-300" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={data.name || ''}
                          onChange={handleInputChange}
                          className="text-3xl font-semibold bg-white/10 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter your name"
                        />
                      ) : (
                        <h1 className="text-3xl font-semibold text-white">{data.name || 'Anonymous User'}</h1>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-white/80">
                        <Mail size={16} className="text-purple-400" />
                        <p>{data.email || 'N/A'}</p>
                      </div>
                    </div>
                    <ScaleOnHover>
                      <button
                        onClick={handleEditToggle}
                        className={`p-3 rounded-lg transition-colors ${
                          isEditing
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                            : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                        }`}
                        aria-label={isEditing ? 'Save profile' : 'Edit profile'}
                      >
                        {isEditing ? <Save size={24} /> : <Edit3 size={24} />}
                      </button>
                    </ScaleOnHover>
                  </div>
                  {data.learningStreaks && (
                    <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-white/70 text-sm">
                      <Calendar className="text-purple-400" size={16} />
                      <span>Last Active: {new Date(data.learningStreaks).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* AI Quote */}
              <div className="mt-6 p-4 bg-purple-900/20 rounded-xl flex items-center gap-3">
                <Sparkles className="text-purple-400" size={20} />
                <p className="text-white/80 italic text-sm">{quote}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 backdrop-blur-md shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={data.bio || ''}
                  onChange={handleInputChange}
                  className="bg-white/10 text-white/80 p-3 rounded-lg w-full h-32 resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about yourself"
                />
              ) : (
                <p className="text-white/80 leading-relaxed">{data.bio || 'No bio provided.'}</p>
              )}
            </div>

            {/* Skills & Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Skills */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(data.skills || []).map((skill, index) => (
                    <FadeInStaggerItem key={index}>
                      <span className="px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 text-sm flex items-center shadow-sm">
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(index)}
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
                      className="bg-white/10 text-white/80 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <button
                      onClick={addSkill}
                      className="bg-purple-600/20 text-purple-400 p-3 rounded-lg hover:bg-purple-600/30 transition-colors"
                      aria-label="Add skill"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-lg">
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
                            onClick={() => removeCertification(index)}
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
                      className="bg-white/10 text-white/80 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tabbed Section: Progress & GitHub */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-lg">
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
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'github'
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('github')}
                >
                  Connect
                </button>
              </div>
              {activeTab === 'progress' ? (
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
                                      className="bg-purple-400 h-3 rounded-full transition-all"
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
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Connect With Me</h2>
                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <Github className="text-purple-400" size={24} />
                      <input
                        type="text"
                        name="github"
                        value={data.github || ''}
                        onChange={handleInputChange}
                        placeholder="GitHub URL"
                        className="bg-white/10 text-white/80 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ) : (
                    <div>
                      {data.github ? (
                        <ScaleOnHover>
                          <a
                            href={data.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-600/20 text-purple-400 p-3 rounded-lg hover:bg-purple-600/30 transition-colors inline-flex items-center gap-2 shadow-sm"
                          >
                            <Github size={20} />
                            View GitHub
                          </a>
                        </ScaleOnHover>
                      ) : (
                        <p className="text-white/80">No GitHub link provided.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;