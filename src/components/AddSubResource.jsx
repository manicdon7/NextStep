import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { Info, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const AddSubResource = ({ selectedResourceId, resources, subResources, setSubResources, token }) => {
  const [subResourceForm, setSubResourceForm] = useState({
    title: '', description: '', estimatedTime: '', url: '', file: null, type: 'video',
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState({ type: null, message: '' });

  const validateForm = () => {
    const newErrors = {};
    if (!selectedResourceId) newErrors.resourceId = 'Please select a resource card';
    if (!subResourceForm.title.trim()) newErrors.title = 'Title is required';
    if (!subResourceForm.description.trim()) newErrors.description = 'Description is required';
    if (!subResourceForm.estimatedTime.trim()) {
      newErrors.estimatedTime = 'Estimated time is required';
    } else if (!/^\d+\s*(min|hour|hours)$/i.test(subResourceForm.estimatedTime.trim())) {
      newErrors.estimatedTime = 'Format: e.g., "15 min"';
    }
    if (subResourceForm.type === 'pdf' && !subResourceForm.file && !subResourceForm.url) {
      newErrors.file = 'Please upload a PDF file';
    }
    if (subResourceForm.type === 'video' && !subResourceForm.url && !subResourceForm.file) {
      newErrors.url = 'Please provide a video URL or upload a file';
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

  const handleChange = (e) => {
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

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    });
    return response.data.fileUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setModal({
      type: 'createSubResource',
      message: 'Are you sure you want to add this sub-resource?',
    });
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    setModal({ type: null, message: '' });
    try {
      let fileUrl = subResourceForm.url;
      if (subResourceForm.file) {
        fileUrl = await uploadFile(subResourceForm.file);
      }
      const selectedResource = resources.find((r) => r._id === selectedResourceId);
      const payload = {
        domain: selectedResource.domain,
        level: selectedResource.level,
        type: subResourceForm.type,
        title: subResourceForm.title,
        description: subResourceForm.description,
        estimatedTime: subResourceForm.estimatedTime,
        url: fileUrl,
        resourceId: selectedResourceId,
        unlockRequirement: subResources.length > 0 ? subResources[subResources.length - 1]._id : null,
      };
      const response = await axios.post(`${API_URL}/api/detailed-resources`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubResources([...subResources, response.data]);
      setSubResourceForm({ title: '', description: '', estimatedTime: '', url: '', file: null, type: 'video' });
      setPreviewUrl(null);
      setErrors({});
      setModal({ type: 'success', message: 'Sub-resource added successfully!' });
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'Failed to add sub-resource' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = (type, url) => {
    if (!url) return null;
    switch (type) {
      case 'pdf':
        return (
          <div className="mt-3">
            <p className="text-gray-300 text-sm font-medium">PDF Preview:</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400">View PDF</a>
          </div>
        );
      case 'video':
        return (
          <div className="mt-3">
            <p className="text-gray-300 text-sm font-medium">Video Preview:</p>
            {url.includes('youtube.com') || url.includes('youtu.be') ? (
              <iframe width="100%" height="200" src={url.replace('watch?v=', 'embed/')} className="rounded-lg" />
            ) : (
              <video width="100%" height="200" controls className="rounded-lg">
                <source src={url} type="video/mp4" />
              </video>
            )}
          </div>
        );
      case 'link':
      case 'blog':
        return (
          <div className="mt-3">
            <p className="text-gray-300 text-sm font-medium">Link Preview:</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 break-all">{url}</a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-indigo-300 hover:text-indigo-200 mb-6"
      >
        <span>{isOpen ? 'Hide Sub-Resource Form' : 'Add Sub-Resource'}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && (
        <form onSubmit={handleSubmit} className="bg-[#0F1A33] p-6 rounded-xl border border-indigo-500/20 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-100">Add Sub-Resource</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-gray-300 text-sm font-medium mb-2">
                <span>Type</span>
                <Info className="h-4 w-4 text-gray-400" title="Select the sub-resource format" />
              </label>
              <select
                name="type"
                value={subResourceForm.type}
                onChange={handleChange}
                className="w-full bg-[#1A2540] text-white p-3 rounded-lg border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50"
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
                onChange={handleChange}
                className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${
                  errors.title ? 'border-red-400' : 'border-indigo-500/30'
                } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50`}
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
                onChange={handleChange}
                className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${
                  errors.description ? 'border-red-400' : 'border-indigo-500/30'
                } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50`}
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
                onChange={handleChange}
                className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${
                  errors.estimatedTime ? 'border-red-400' : 'border-indigo-500/30'
                } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50`}
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
                  onChange={handleChange}
                  className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${
                    errors.file ? 'border-red-400' : 'border-indigo-500/30'
                  } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50`}
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
                    onChange={handleChange}
                    className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${
                      errors.url ? 'border-red-400' : 'border-indigo-500/30'
                    } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50`}
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
                    onChange={handleChange}
                    className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${
                      errors.file ? 'border-red-400' : 'border-indigo-500/30'
                    } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50`}
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
                  onChange={handleChange}
                  className={`w-full bg-[#1A2540] text-white p-3 rounded-lg border ${
                    errors.url ? 'border-red-400' : 'border-indigo-500/30'
                  } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50`}
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
              className={`flex items-center px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/30 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {isSubmitting ? 'Processing...' : 'Add Sub-Resource'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSubResourceForm({ title: '', description: '', estimatedTime: '', url: '', file: null, type: 'video' });
                setPreviewUrl(null);
                setIsOpen(false);
                setErrors({});
              }}
              className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {modal.type && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1A2540] p-6 rounded-xl border border-indigo-500/20 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-indigo-300 mb-4">
              {modal.type === 'success' ? 'Success' : 'Confirm Action'}
            </h3>
            <p className="text-gray-300 mb-6">{modal.message}</p>
            <div className="flex space-x-4">
              {modal.type === 'success' ? (
                <button
                  onClick={() => setModal({ type: null, message: '' })}
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
                >
                  OK
                </button>
              ) : (
                <>
                  <button
                    onClick={confirmSubmission}
                    className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setModal({ type: null, message: '' })}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {errors.submit && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6">{errors.submit}</div>
      )}
    </div>
  );
};

export default AddSubResource;