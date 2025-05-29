import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Info,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Lock,
  CheckCircle,
  FileText,
  Video,
  Link as LinkIcon,
  LogOut,
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../constants';
import AddSubResource from './AddSubResource';

const AddResource = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  let user = {};
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) user = JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }
  const isAdmin = user.role === 'admin';
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [subResources, setSubResources] = useState([]);
  const [userProgress, setUserProgress] = useState({ completedSubResources: [], completedResources: [] });
  const [isCreatingNewCard, setIsCreatingNewCard] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(null);
  const [isEditingSubResource, setIsEditingSubResource] = useState(null);
  const [isSubResourceSectionOpen, setIsSubResourceSectionOpen] = useState({});
  const [cardForm, setCardForm] = useState({
    domain: 'cs',
    level: 'beginner',
    type: 'video',
    title: '',
    description: '',
    estimatedTime: '',
    unlockRequirement: '',
  });
  const [subResourceForm, setSubResourceForm] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    url: '',
    file: null,
    type: 'video',
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ type: null, data: null, message: '' });
  const [isLoading, setIsLoading] = useState(true);

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
    { id: 'philosophy', name: 'Philosophy' },
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resourcesResponse, progressResponse] = await Promise.all([
          axios.get(`${API_URL}/api/resources`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/user-progress`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setResources(resourcesResponse.data || []);
        setUserProgress(progressResponse.data || { completedSubResources: [], completedResources: [] });

        if (selectedResourceId) {
          const subResourcesResponse = await axios.get(`${API_URL}/api/detailed-resources`, {
            params: { resourceId: selectedResourceId },
            headers: { Authorization: `Bearer ${token}` },
          });
          setSubResources(subResourcesResponse.data || []);
        }
      } catch (error) {
        setErrors({ fetch: error.response?.data?.error || 'Failed to load resources' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, navigate, selectedResourceId, user._id]);

  const validateCardForm = () => {
    const newErrors = {};
    if (!cardForm.title.trim()) newErrors.title = 'Title is required';
    if (!cardForm.description.trim()) newErrors.description = 'Description is required';
    if (!cardForm.estimatedTime.trim()) {
      newErrors.estimatedTime = 'Estimated time is required';
    } else if (!/^\d+\s*(min|hour|hours)$/i.test(cardForm.estimatedTime.trim())) {
      newErrors.estimatedTime = 'Format: e.g., "30 min" or "1 hour"';
    }
    if (cardForm.unlockRequirement.trim() && !/^[0-9a-fA-F]{24}$/.test(cardForm.unlockRequirement)) {
      newErrors.unlockRequirement = 'Enter a valid MongoDB ObjectId';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSubResourceForm = () => {
    const newErrors = {};
    if (!selectedResourceId && !isCreatingNewCard) {
      newErrors.resourceId = 'Please select or create a resource card';
    }
    if (!subResourceForm.title.trim()) newErrors.title = 'Title is required';
    if (!subResourceForm.description.trim()) newErrors.description = 'Description is required';
    if (!subResourceForm.estimatedTime.trim()) {
      newErrors.estimatedTime = 'Estimated time is required';
    } else if (!/^\d+\s*(min|hour|hours)$/i.test(subResourceForm.estimatedTime.trim())) {
      newErrors.estimatedTime = 'Format: e.g., "15 min" or "1 hour"';
    }
    if (subResourceForm.type === 'pdf' && !subResourceForm.file && !subResourceForm.url) {
      newErrors.file = 'Please upload a PDF file';
    }
    if (subResourceForm.type === 'video' && !subResourceForm.url && !subResourceForm.file) {
      newErrors.url = 'Please provide a video URL or upload a video file';
    }
    if (['link', 'blog'].includes(subResourceForm.type) && !subResourceForm.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (
      ['link', 'blog', 'video'].includes(subResourceForm.type) &&
      subResourceForm.url &&
      !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(subResourceForm.url)
    ) {
      newErrors.url = 'Enter a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!validateCardForm()) return;
    setModal({
      type: isEditingCard ? 'editCard' : 'createCard',
      data: cardForm,
      message: isEditingCard ? 'Are you sure you want to update this resource card?' : 'Are you sure you want to create this resource card?',
    });
  };

  const handleSubResourceSubmit = async (e) => {
    e.preventDefault();
    if (!validateSubResourceForm()) return;
    setModal({
      type: isEditingSubResource ? 'editSubResource' : 'createSubResource',
      data: subResourceForm,
      message: isEditingSubResource ? 'Are you sure you want to update this sub-resource?' : 'Are you sure you want to add this sub-resource?',
    });
  };

  const handleMarkComplete = async (subResourceId) => {
    try {
      await axios.post(
        `${API_URL}/api/detailed-resources/${subResourceId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const progressResponse = await axios.get(`${API_URL}/api/user-progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProgress(progressResponse.data);
      if (selectedResourceId) {
        const subResourcesResponse = await axios.get(`${API_URL}/api/detailed-resources`, {
          params: { resourceId: selectedResourceId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubResources(subResourcesResponse.data || []);
      }
      setModal({ type: 'success', message: 'Sub-resource marked as completed!' });
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'Failed to mark as completed' });
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    });
    return response.data.fileUrl;
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    setModal({ type: null, data: null, message: '' });

    try {
      let resourceId = selectedResourceId;

      if (modal.type === 'createCard') {
        const cardPayload = {
          domain: cardForm.domain,
          level: cardForm.level,
          type: cardForm.type,
          title: cardForm.title,
          description: cardForm.description,
          estimatedTime: cardForm.estimatedTime,
          unlockRequirement: cardForm.unlockRequirement || null,
        };
        const response = await axios.post(`${API_URL}/api/resources`, cardPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        resourceId = response.data._id;
        setResources([...resources, response.data]);
        setSelectedResourceId(resourceId);
        setIsCreatingNewCard(false);
        setCardForm({ domain: 'cs', level: 'beginner', type: 'video', title: '', description: '', estimatedTime: '', unlockRequirement: '' });
      } else if (modal.type === 'editCard') {
        const cardPayload = {
          domain: cardForm.domain,
          level: cardForm.level,
          type: cardForm.type,
          title: cardForm.title,
          description: cardForm.description,
          estimatedTime: cardForm.estimatedTime,
          unlockRequirement: cardForm.unlockRequirement || null,
        };
        const response = await axios.patch(`${API_URL}/api/resources/${isEditingCard}`, cardPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(resources.map((r) => (r._id === isEditingCard ? response.data : r)));
        setIsEditingCard(null);
        setCardForm({ domain: 'cs', level: 'beginner', type: 'video', title: '', description: '', estimatedTime: '', unlockRequirement: '' });
      }

      if (modal.type === 'createSubResource' || modal.type === 'editSubResource') {
        let fileUrl = subResourceForm.url;
        if (subResourceForm.file) {
          fileUrl = await uploadFile(subResourceForm.file);
        }
        const selectedResource = resources.find((r) => r._id === selectedResourceId);
        const subResourcePayload = {
          domain: selectedResource?.domain || cardForm.domain,
          level: selectedResource?.level || cardForm.level,
          type: subResourceForm.type,
          title: subResourceForm.title,
          description: subResourceForm.description,
          estimatedTime: subResourceForm.estimatedTime,
          url: fileUrl,
          resourceId,
          unlockRequirement: subResources.length > 0 ? subResources[subResources.length - 1]._id : null,
        };

        if (modal.type === 'createSubResource') {
          const response = await axios.post(`${API_URL}/api/detailed-resources`, subResourcePayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSubResources([...subResources, response.data]);
        } else {
          const response = await axios.patch(`${API_URL}/api/detailed-resources/${isEditingSubResource}`, subResourcePayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSubResources(subResources.map((sr) => (sr._id === isEditingSubResource ? response.data : sr)));
        }

        setSubResourceForm({ title: '', description: '', estimatedTime: '', url: '', file: null, type: 'video' });
        setPreviewUrl(null);
        setIsEditingSubResource(null);
      }

      setErrors({});
      setModal({
        type: 'success',
        message: modal.type.includes('edit') ? 'Resource updated successfully!' : 'Resource added successfully!',
      });
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'Failed to process request' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardForm({ ...cardForm, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubResourceChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      setSubResourceForm({ ...subResourceForm, file });
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setSubResourceForm({ ...subResourceForm, [name]: value });
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleEditCard = (resource) => {
    setCardForm({
      domain: resource.domain,
      level: resource.level,
      type: resource.type,
      title: resource.title,
      description: resource.description,
      estimatedTime: resource.estimatedTime,
      unlockRequirement: resource.unlockRequirement || '',
    });
    setIsEditingCard(resource._id);
    setIsCreatingNewCard(false);
  };

  const handleDeleteCard = async (resourceId) => {
    setModal({
      type: 'deleteCard',
      data: resourceId,
      message: 'Are you sure you want to delete this resource card and all its sub-resources?',
    });
  };

  const confirmDeleteCard = async () => {
    const resourceId = modal.data;
    setModal({ type: null, data: null, message: '' });
    try {
      await axios.delete(`${API_URL}/api/resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(resources.filter((r) => r._id !== resourceId));
      if (selectedResourceId === resourceId) {
        setSelectedResourceId(null);
        setSubResources([]);
      }
      setIsEditingCard(null);
      setIsCreatingNewCard(false);
      setModal({ type: 'success', message: 'Resource card deleted successfully!' });
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'Failed to delete resource' });
    }
  };

  const handleEditSubResource = (subResource) => {
    setSubResourceForm({
      title: subResource.title,
      description: subResource.description,
      estimatedTime: subResource.estimatedTime,
      url: subResource.url,
      file: null,
      type: subResource.type,
    });
    setPreviewUrl(subResource.url);
    setIsEditingSubResource(subResource._id);
    setIsSubResourceSectionOpen({ ...isSubResourceSectionOpen, [selectedResourceId]: true });
  };

  const handleDeleteSubResource = async (subResourceId) => {
    setModal({
      type: 'deleteSubResource',
      data: subResourceId,
      message: 'Are you sure you want to delete this sub-resource?',
    });
  };

  const confirmDeleteSubResource = async () => {
    const subResourceId = modal.data;
    setModal({ type: null, data: null, message: '' });
    try {
      await axios.delete(`${API_URL}/api/detailed-resources/${subResourceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubResources(subResources.filter((sr) => sr._id !== subResourceId));
      setModal({ type: 'success', message: 'Sub-resource deleted successfully!' });
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'Failed to delete sub-resource' });
    }
  };

  const selectResource = async (resourceId) => {
    setSelectedResourceId(resourceId);
    setIsSubResourceSectionOpen({ ...isSubResourceSectionOpen, [resourceId]: false });
    try {
      const subResourcesResponse = await axios.get(`${API_URL}/api/detailed-resources`, {
        params: { resourceId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubResources(subResourcesResponse.data || []);
    } catch (error) {
      setErrors({ fetch: error.response?.data?.error || 'Failed to load sub-resources' });
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
      case 'blog':
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const isSubResourceUnlocked = (subResource) => {
    if (!subResource.unlockRequirement) return true;
    return userProgress.completedSubResources.includes(subResource.unlockRequirement);
  };

  const renderPreview = (type, url) => {
    if (!url) return null;
    switch (type) {
      case 'pdf':
        return (
          <div className="mt-3">
            <p className="text-gray-300 text-sm font-medium">PDF Preview:</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View PDF
            </a>
          </div>
        );
      case 'video':
        return (
          <div className="mt-3">
            <p className="text-gray-300 text-sm font-medium">Video Preview:</p>
            {url.includes('youtube.com') || url.includes('youtu.be') ? (
              <iframe
                width="100%"
                height="200"
                src={url.replace('watch?v=', 'embed/')}
                title="Video Preview"
                className="rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video width="100%" height="200" controls className="rounded-lg">
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        );
      case 'link':
      case 'blog':
        return (
          <div className="mt-3">
            <p className="text-gray-300 text-sm font-medium">Link Preview:</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors break-all"
            >
              {url}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1F] to-[#1E2A44] text-white font-sans">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
          <Sparkles className="h-10 w-10 text-indigo-400" />
          <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
            NextStep
          </span>
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('user');
            navigate('/login');
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 transition-all duration-300"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="py-12 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
            Manage
          </span>{' '}
          Resources
        </h1>
        <p className="text-lg text-gray-300">
          Curate and organize learning resources with ease, from videos to PDFs and more.
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
            <span className="ml-3 text-lg text-gray-300">Loading resources...</span>
          </div>
        ) : (
          <div className="bg-[#1A2540] p-8 rounded-xl border border-indigo-500/20">
            {errors.fetch && (
              <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6">{errors.fetch}</div>
            )}
            {errors.submit && (
              <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6">{errors.submit}</div>
            )}

            {/* Resource Cards */}
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {resources.map((resource) => (
                  <div
                    key={resource._id}
                    className={`bg-[#0F1A33] p-6 rounded-xl border ${selectedResourceId === resource._id ? 'border-indigo-400' : 'border-indigo-500/20'
                      } cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group`}
                    onClick={() => selectResource(resource._id)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors">
                        {resource.title || 'Untitled'}
                      </h3>
                      {isAdmin && (
                        <div className="flex space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCard(resource);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="Edit Resource"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(resource._id);
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Resource"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">{resource.description || 'No description'}</p>
                    <p className="text-gray-400 text-xs">
                      Level: {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)} | Time: {resource.estimatedTime || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-lg mb-8">
                {isAdmin ? 'No resource cards available. Create one below.' : 'No resource cards available. Contact an admin.'}
              </p>
            )}

            {/* Create/Edit Resource Card Form */}
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setIsCreatingNewCard(!isCreatingNewCard);
                    setIsEditingCard(null);
                    setErrors({});
                    setCardForm({
                      domain: 'cs',
                      level: 'beginner',
                      type: 'video',
                      title: '',
                      description: '',
                      estimatedTime: '',
                      unlockRequirement: '',
                    });
                  }}
                  className="flex items-center space-x-2 text-indigo-300 hover:text-indigo-200 transition-colors mb-8"
                >
                  <span>{isCreatingNewCard ? 'Cancel New Card' : 'Create New Resource Card'}</span>
                  {isCreatingNewCard ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>

                {(isCreatingNewCard || isEditingCard) && (
                  <form
                    onSubmit={handleCardSubmit}
                    className="bg-[#0F1A33] p-6 rounded-xl border border-indigo-500/20 mb-8 space-y-6"
                  >
                    <h3 className="text-2xl font-semibold text-gray-100">
                      {isEditingCard ? 'Edit Resource Card' : 'New Resource Card'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                          <span>Domain</span>
                          <Info className="h-4 w-4 text-gray-400" title="Select the field of study" />
                        </label>
                        <select
                          name="domain"
                          value={cardForm.domain}
                          onChange={handleCardChange}
                          className="w-full bg-[#1A2540] text-white p-3 rounded-lg border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all"
                          required
                        >
                          {domains.map((domain) => (
                            <option key={domain.id} value={domain.id}>
                              {domain.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                          <span>Level</span>
                          <Info className="h-4 w-4 text-gray-400" title="Select the difficulty level" />
                        </label>
                        <select
                          name="level"
                          value={cardForm.level}
                          onChange={handleCardChange}
                          className="w-full bg-[#1A2540] text-white p-3 rounded-lg border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all"
                          required
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                          <span>Type</span>
                          <Info className="h-4 w-4 text-gray-400" title="Select the resource format" />
                        </label>
                        <select
                          name="type"
                          value={cardForm.type}
                          onChange={handleCardChange}
                          className="w-full bg-[#1A2540] text-white p-3 rounded-lg border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all"
                          required
                        >
                          <option value="video">Video</option>
                          <option value="blog">Blog</option>
                          <option value="pdf">PDF</option>
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                          <span>Title</span>
                          <Info className="h-4 w-4 text-gray-400" title="Enter a concise title" />
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={cardForm.title}
                          onChange={handleCardChange}
                          className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.title ? 'border-red-400' : 'border-indigo-500/30'
                            } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                          required
                          placeholder="e.g., Introduction to Python"
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                          <span>Description</span>
                          <Info className="h-4 w-4 text-gray-400" title="Provide a brief overview" />
                        </label>
                        <textarea
                          name="description"
                          value={cardForm.description}
                          onChange={handleCardChange}
                          className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.description ? 'border-red-400' : 'border-indigo-500/30'
                            } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                          rows="4"
                          required
                          placeholder="e.g., Learn the basics of Python programming."
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                          <span>Estimated Time</span>
                          <Info className="h-4 w-4 text-gray-400" title="Enter duration (e.g., '30 min')" />
                        </label>
                        <input
                          type="text"
                          name="estimatedTime"
                          value={cardForm.estimatedTime}
                          onChange={handleCardChange}
                          className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.estimatedTime ? 'border-red-400' : 'border-indigo-500/30'
                            } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                          required
                          placeholder="e.g., 30 min"
                        />
                        {errors.estimatedTime && <p className="text-red-400 text-xs mt-1">{errors.estimatedTime}</p>}
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                          <span>Unlock Requirement (Optional)</span>
                          <Info className="h-4 w-4 text-gray-400" title="Enter a MongoDB ObjectId" />
                        </label>
                        <input
                          type="text"
                          name="unlockRequirement"
                          value={cardForm.unlockRequirement}
                          onChange={handleCardChange}
                          className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.unlockRequirement ? 'border-red-400' : 'border-indigo-500/30'
                            } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                          placeholder="e.g., 507f1f77bcf86cd799439011"
                        />
                        {errors.unlockRequirement && <p className="text-red-400 text-xs mt-1">{errors.unlockRequirement}</p>}
                      </div>
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/30 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        {isSubmitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                        {isSubmitting ? 'Processing...' : isEditingCard ? 'Update Card' : 'Create Card'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingCard(null);
                          setIsCreatingNewCard(false);
                          setCardForm({
                            domain: 'cs',
                            level: 'beginner',
                            type: 'video',
                            title: '',
                            description: '',
                            estimatedTime: '',
                            unlockRequirement: '',
                          });
                          setErrors({});
                        }}
                        className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* Sub-Resources */}
            {selectedResourceId && (
              <div className="border-t border-indigo-500/20 pt-8">
                <h3 className="text-2xl font-semibold text-gray-100 mb-6">
                  Sub-Resources for {resources.find((r) => r._id === selectedResourceId)?.title || 'Selected Resource'}
                </h3>
                {subResources.length > 0 ? (
                  <ul className="space-y-4 mb-8">
                    {subResources.map((subResource) => {
                      const isUnlocked = isSubResourceUnlocked(subResource);
                      const isCompleted = userProgress.completedSubResources.includes(subResource._id);
                      return (
                        <li
                          key={subResource._id}
                          className={`bg-[#0F1A33] p-4 rounded-xl border border-indigo-500/20 flex items-center justify-between transition-all ${!isUnlocked ? 'opacity-60' : 'hover:shadow-md hover:shadow-indigo-500/20'
                            }`}
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <span className="text-indigo-300">{getIcon(subResource.type)}</span>
                            <div>
                              <p className="text-gray-100 font-medium">{subResource.title || 'Untitled'}</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{subResource.description || 'No description'}</p>
                              {renderPreview(subResource.type, subResource.url)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-400" title="Completed" />
                            ) : isUnlocked ? (
                              <button
                                onClick={() => handleMarkComplete(subResource._id)}
                                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm shadow-md hover:shadow-green-500/30 transition-all"
                              >
                                Mark Complete
                              </button>
                            ) : (
                              <Lock className="h-5 w-5 text-gray-400" title="Locked" />
                            )}
                            {isAdmin && selectedResourceId && (
                              <AddSubResource
                                selectedResourceId={selectedResourceId}
                                resources={resources}
                                subResources={subResources}
                                setSubResources={setSubResources}
                                token={token}
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-300 text-lg mb-6">No sub-resources available for this card.</p>
                )}

                {isAdmin && (
                  <div>
                    <button
                      onClick={() =>
                        setIsSubResourceSectionOpen({
                          ...isSubResourceSectionOpen,
                          [selectedResourceId]: !isSubResourceSectionOpen[selectedResourceId],
                        })
                      }
                      className="flex items-center space-x-2 text-indigo-300 hover:text-indigo-200 transition-colors mb-6"
                    >
                      <span>
                        {isSubResourceSectionOpen[selectedResourceId] ? 'Hide Sub-Resource Form' : 'Add Sub-Resource'}
                      </span>
                      {isSubResourceSectionOpen[selectedResourceId] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                    {isSubResourceSectionOpen[selectedResourceId] && (
                      <form
                        onSubmit={handleSubResourceSubmit}
                        className="bg-[#0F1A33] p-6 rounded-xl border border-indigo-500/20 space-y-6"
                      >
                        <h3 className="text-2xl font-semibold text-gray-100">
                          {isEditingSubResource ? 'Edit Sub-Resource' : 'Add Sub-Resource'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                              <span>Type</span>
                              <Info className="h-4 w-4 text-gray-400" title="Select the sub-resource format" />
                            </label>
                            <select
                              name="type"
                              value={subResourceForm.type}
                              onChange={handleSubResourceChange}
                              className="w-full bg-[#1A2540] text-white p-3 rounded-lg border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all"
                              required
                            >
                              <option value="pdf">PDF</option>
                              <option value="video">Video</option>
                              <option value="link">Link</option>
                              <option value="blog">Blog</option>
                            </select>
                          </div>
                          <div>
                            <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                              <span>Title</span>
                              <Info className="h-4 w-4 text-gray-400" title="Enter a concise title" />
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={subResourceForm.title}
                              onChange={handleSubResourceChange}
                              className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.title ? 'border-red-400' : 'border-indigo-500/30'
                                } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                              required
                              placeholder="e.g., Python Variables Video"
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                          </div>
                          <div className="md:col-span-2">
                            <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                              <span>Description</span>
                              <Info className="h-4 w-4 text-gray-400" title="Provide a brief overview" />
                            </label>
                            <textarea
                              name="description"
                              value={subResourceForm.description}
                              onChange={handleSubResourceChange}
                              className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.description ? 'border-red-400' : 'border-indigo-500/30'
                                } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                              rows="4"
                              required
                              placeholder="e.g., A video explaining Python variables."
                            />
                            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                          </div>
                          <div>
                            <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                              <span>Estimated Time</span>
                              <Info className="h-4 w-4 text-gray-400" title="Enter duration (e.g., '15 min')" />
                            </label>
                            <input
                              type="text"
                              name="estimatedTime"
                              value={subResourceForm.estimatedTime}
                              onChange={handleSubResourceChange}
                              className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.estimatedTime ? 'border-red-400' : 'border-indigo-500/30'
                                } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                              required
                              placeholder="e.g., 15 min"
                            />
                            {errors.estimatedTime && <p className="text-red-400 text-xs mt-1">{errors.estimatedTime}</p>}
                          </div>
                          {subResourceForm.type === 'pdf' && (
                            <div className="md:col-span-2">
                              <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                                <span>Upload PDF</span>
                                <Info className="h-4 w-4 text-gray-400" title="Upload a PDF file" />
                              </label>
                              <input
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={handleSubResourceChange}
                                className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.file ? 'border-red-400' : 'border-indigo-500/30'
                                  } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                              />
                              {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
                              {previewUrl && renderPreview('pdf', previewUrl)}
                            </div>
                          )}
                          {subResourceForm.type === 'video' && (
                            <>
                              <div>
                                <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                                  <span>Video URL (Optional)</span>
                                  <Info className="h-4 w-4 text-gray-400" title="Enter a video URL" />
                                </label>
                                <input
                                  type="url"
                                  name="url"
                                  value={subResourceForm.url}
                                  onChange={handleSubResourceChange}
                                  className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.url ? 'border-red-400' : 'border-indigo-500/30'
                                    } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                                  placeholder="e.g., https://youtube.com/watch?v=example"
                                />
                                {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url}</p>}
                                {subResourceForm.url && renderPreview('video', subResourceForm.url)}
                              </div>
                              <div>
                                <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                                  <span>Upload Video (Optional)</span>
                                  <Info className="h-4 w-4 text-gray-400" title="Upload an MP4 video" />
                                </label>
                                <input
                                  type="file"
                                  name="file"
                                  accept="video/mp4"
                                  onChange={handleSubResourceChange}
                                  className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.file ? 'border-red-400' : 'border-indigo-500/30'
                                    } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                                />
                                {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
                                {previewUrl && renderPreview('video', previewUrl)}
                              </div>
                            </>
                          )}
                          {['link', 'blog'].includes(subResourceForm.type) && (
                            <div className="md:col-span-2">
                              <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                                <span>URL</span>
                                <Info className="h-4 w-4 text-gray-400" title="Enter the resource link" />
                              </label>
                              <input
                                type="url"
                                name="url"
                                value={subResourceForm.url}
                                onChange={handleSubResourceChange}
                                className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${errors.url ? 'border-red-400' : 'border-indigo-500/30'
                                  } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all`}
                                required
                                placeholder="e.g., https://example.com"
                              />
                              {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url}</p>}
                              {subResourceForm.url && renderPreview(subResourceForm.type, subResourceForm.url)}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-4 pt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/30 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          >
                            {isSubmitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                            {isSubmitting ? 'Processing...' : isEditingSubResource ? 'Update Sub-Resource' : 'Add Sub-Resource'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSubResourceForm({
                                title: '',
                                description: '',
                                estimatedTime: '',
                                url: '',
                                file: null,
                                type: 'video',
                              });
                              setPreviewUrl(null);
                              setIsEditingSubResource(null);
                              setIsSubResourceSectionOpen({
                                ...isSubResourceSectionOpen,
                                [selectedResourceId]: false,
                              });
                              setErrors({});
                            }}
                            className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-all"
                          >
                            Done
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1A2540] p-6 rounded-xl border border-indigo-500/20 max-w-md w-full shadow-2xl shadow-indigo-500/10">
            <h3 className="text-xl font-semibold text-indigo-300 mb-4">
              {modal.type === 'success' ? 'Success' : 'Confirm Action'}
            </h3>
            <p className="text-gray-300 mb-6">{modal.message}</p>
            <div className="flex space-x-4">
              {modal.type === 'success' ? (
                <button
                  onClick={() => setModal({ type: null, data: null, message: '' })}
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/30 transition-all"
                >
                  OK
                </button>
              ) : (
                <>
                  <button
                    onClick={
                      modal.type === 'deleteCard'
                        ? confirmDeleteCard
                        : modal.type === 'deleteSubResource'
                          ? confirmDeleteSubResource
                          : confirmSubmission
                    }
                    className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/30 transition-all"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setModal({ type: null, data: null, message: '' })}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-all"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm bg-[#0F1A33]">
        <p>NextStep © {new Date().getFullYear()} | Expand your knowledge and skills</p>
      </footer>
    </div>
  );
};

export default AddResource;