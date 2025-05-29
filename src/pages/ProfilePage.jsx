
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleOnHover } from '../components/Animations';
import { getAuth } from 'firebase/auth';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Edit3,
  Github,
  Linkedin,
  Globe,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    // Load profile data from JSON instead of Firebase
    const mockProfile = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      title: 'Software Developer',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567',
      bio: 'Passionate software developer with expertise in web technologies and a focus on creating intuitive user experiences.',
      skills: ['React', 'JavaScript', 'Node.js'],
      experience: [
        {
          title: 'Senior Developer',
          company: 'Tech Solutions Inc.',
          period: '2022 - Present',
          description: 'Leading frontend development for enterprise applications.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of Technology',
          period: '2018 - 2022'
        }
      ],
      certifications: ['AWS Certified Developer'],
      socialLinks: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        portfolio: 'https://johndoe.dev'
      }
    };
    setData(mockProfile);
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: 'New Position',
        company: 'Company Name',
        period: 'Start - End',
        description: 'Describe your role'
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: 'Degree',
        school: 'School Name',
        period: 'Start - End'
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  if (!data) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white/70">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            {/* Profile Header */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-32 h-32 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <User className="w-16 h-16 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={data.fullName}
                          onChange={handleInputChange}
                          className="text-3xl font-bold bg-white/10 text-white mb-2 p-2 rounded-lg"
                        />
                      ) : (
                        <h1 className="text-3xl font-bold text-white mb-2">{data.fullName}</h1>
                      )}
                      {isEditing ? (
                        <input
                          type="text"
                          name="title"
                          value={data.title}
                          onChange={handleInputChange}
                          className="text-xl bg-white/10 text-white/70 p-2 rounded-lg w-full"
                        />
                      ) : (
                        <p className="text-xl text-white/70">{data.title}</p>
                      )}
                    </div>
                    <ScaleOnHover>
                      <button
                        onClick={handleEditToggle}
                        className={`${isEditing ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'} p-2 rounded-lg hover:bg-opacity-30 transition-colors`}
                      >
                        {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
                      </button>
                    </ScaleOnHover>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70">
                    <div className="flex items-center gap-2">
                      <Mail className="text-purple-400" size={16} />
                      {data.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-purple-400" size={16} />
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={data.phone}
                          onChange={handleInputChange}
                          className="bg-white/10 text-white/70 p-1 rounded-lg flex-1"
                        />
                      ) : (
                        data.phone
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-purple-400" size={16} />
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={data.location}
                          onChange={handleInputChange}
                          className="bg-white/10 text-white/70 p-1 rounded-lg flex-1"
                        />
                      ) : (
                        data.location
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio & Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={data.bio}
                      onChange={handleInputChange}
                      className="bg-white/10 text-white/70 p-2 rounded-lg w-full h-32"
                    />
                  ) : (
                    <p className="text-white/70">{data.bio}</p>
                  )}
                </div>
              </div>
              <div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm flex items-center"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(index)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="mt-4 flex items-center gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="bg-white/10 text-white/70 p-2 rounded-lg flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <button
                        onClick={addSkill}
                        className="bg-purple-500/20 text-purple-400 p-2 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Experience Section */}
              <div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Briefcase className="text-purple-400" size={20} />
                      Experience
                    </h2>
                    {isEditing && (
                      <button
                        onClick={addExperience}
                        className="bg-purple-500/20 text-purple-400 p-2 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>

                  {data.experience.map((exp, index) => (
                    <FadeInStaggerItem key={index}>
                      <div className="mb-6 last:mb-0">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                className="text-lg font-medium bg-white/10 text-white p-2 rounded-lg w-full"
                              />
                              <button
                                onClick={() => removeExperience(index)}
                                className="ml-2 text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              className="bg-white/10 text-purple-400 p-2 rounded-lg w-full"
                            />
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => updateExperience(index, 'period', e.target.value)}
                              className="bg-white/10 text-white/50 text-sm p-2 rounded-lg w-full"
                            />
                            <textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(index, 'description', e.target.value)}
                              className="bg-white/10 text-white/70 p-2 rounded-lg w-full h-24"
                            />
                          </div>
                        ) : (
                          <>
                            <h3 className="text-lg font-medium text-white">{exp.title}</h3>
                            <p className="text-purple-400">{exp.company}</p>
                            <p className="text-white/50 text-sm mb-2">{exp.period}</p>
                            <p className="text-white/70">{exp.description}</p>
                          </>
                        )}
                      </div>
                    </FadeInStaggerItem>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <GraduationCap className="text-purple-400" size={20} />
                      Education
                    </h2>
                    {isEditing && (
                      <button
                        onClick={addEducation}
                        className="bg-purple-500/20 text-purple-400 p-2 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>

                  {data.education.map((edu, index) => (
                    <FadeInStaggerItem key={index}>
                      <div className="mb-6 last:mb-0">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                className="text-lg font-medium bg-white/10 text-white p-2 rounded-lg w-full"
                              />
                              <button
                                onClick={() => removeEducation(index)}
                                className="ml-2 text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => updateEducation(index, 'school', e.target.value)}
                              className="bg-white/10 text-purple-400 p-2 rounded-lg w-full"
                            />
                            <input
                              type="text"
                              value={edu.period}
                              onChange={(e) => updateEducation(index, 'period', e.target.value)}
                              className="bg-white/10 text-white/50 text-sm p-2 rounded-lg w-full"
                            />
                          </div>
                        ) : (
                          <>
                            <h3 className="text-lg font-medium text-white">{edu.degree}</h3>
                            <p className="text-purple-400">{edu.school}</p>
                            <p className="text-white/50 text-sm">{edu.period}</p>
                          </>
                        )}
                      </div>
                    </FadeInStaggerItem>
                  ))}

                </div>

              </div>

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Certifications Section */}
              <div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Award className="text-purple-400" size={20} />
                      Certifications
                    </h2>
                    {isEditing && (
                      <button
                        onClick={() => {
                          if (newCertification.trim()) {
                            setEditableProfile(prev => ({
                              ...prev,
                              certifications: [...prev.certifications, newCertification.trim()]
                            }));
                            setNewCertification('');
                          }
                        }}
                        className="bg-purple-500/20 text-purple-400 p-2 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Add new certification"
                        className="bg-white/10 text-white/70 p-2 rounded-lg w-full"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newCertification.trim()) {
                            setEditableProfile(prev => ({
                              ...prev,
                              certifications: [...prev.certifications, newCertification.trim()]
                            }));
                            setNewCertification('');
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    {data.certifications.map((cert, index) => (
                      <div key={index} className="group flex items-center justify-between text-white/70">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          {cert}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeCertification(index)}
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-white mb-4">Connect With Me</h2>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Github className="text-purple-400" size={20} />
                        <input
                          type="text"
                          name="github"
                          value={data.socialLinks.github}
                          onChange={handleSocialLinkChange}
                          placeholder="GitHub URL"
                          className="bg-white/10 text-white/70 p-2 rounded-lg flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="text-purple-400" size={20} />
                        <input
                          type="text"
                          name="linkedin"
                          value={data.socialLinks.linkedin}
                          onChange={handleSocialLinkChange}
                          placeholder="LinkedIn URL"
                          className="bg-white/10 text-white/70 p-2 rounded-lg flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="text-purple-400" size={20} />
                        <input
                          type="text"
                          name="portfolio"
                          value={data.socialLinks.portfolio}
                          onChange={handleSocialLinkChange}
                          placeholder="Portfolio URL"
                          className="bg-white/10 text-white/70 p-2 rounded-lg flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      {data.socialLinks.github && (
                        <ScaleOnHover>
                          <a
                            href={data.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-500/20 text-purple-400  rounded-lg hover:bg-purple-500/30 transition-colors"
                          >
                            <Github size={24} />
                          </a>
                        </ScaleOnHover>
                      )}
                      {data.socialLinks.linkedin && (
                        <ScaleOnHover>
                          <a
                            href={data.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-500/20 text-purple-400  rounded-lg hover:bg-purple-500/30 transition-colors"
                          >
                            <Linkedin size={24} />
                          </a>
                        </ScaleOnHover>
                      )}
                      {data.socialLinks.portfolio && (
                        <ScaleOnHover>
                          <a
                            href={data.socialLinks.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                          >
                            <Globe size={24} />
                          </a>
                        </ScaleOnHover>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
};
export default ProfilePage;