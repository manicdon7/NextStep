import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Star, DollarSign, ExternalLink, User, Award, TrendingUp, Globe, Filter } from 'lucide-react';

const JobPortal = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    setLoading(true);
    setError(null);
    
    const options = {
      method: 'GET',
      url: 'https://freelancer-api.p.rapidapi.com/api/find-freelancers',
      headers: {
        'x-rapidapi-key': '71d86edd03msh9186aa845712ec9p17b6b5jsn20bb8bd45881',
        'x-rapidapi-host': 'freelancer-api.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log('API Response:', response.data);
      
      // Handle different response structures
      if (response.data?.freelancers) {
        setFreelancers(response.data.freelancers);
      } else if (Array.isArray(response.data)) {
        setFreelancers(response.data);
      } else {
        setError('Unexpected response format');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      setError('Failed to fetch freelancers. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  const filteredFreelancers = freelancers.filter(freelancer =>
    freelancer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.skills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFreelancers = [...filteredFreelancers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return parseFloat(b.stars || 0) - parseFloat(a.stars || 0);
      case 'reviews':
        return parseInt(b.reviews?.match(/\d+/)?.[0] || 0) - parseInt(a.reviews?.match(/\d+/)?.[0] || 0);
      case 'hourly':
        return parseFloat(b.hourRating?.match(/\d+/)?.[0] || 0) - parseFloat(a.hourRating?.match(/\d+/)?.[0] || 0);
      case 'earnings':
        return parseFloat(b.earnings || 0) - parseFloat(a.earnings || 0);
      default:
        return 0;
    }
  });

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'FL';
  };

  const getSkillsArray = (skills) => {
    return skills?.split(',').map(skill => skill.trim()) || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Find Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Freelancers</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Connect with skilled professionals ready to bring your projects to life
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-purple-300" size={20} />
              <input
                type="text"
                placeholder="Search by name, skills, or expertise..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-3.5 text-purple-900" size={20} />
              <select
                className="pl-12 pr-8 py-3 rounded-xl bg-purple-300 border border-purple-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-400 min-w-[200px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
                <option value="hourly">Sort by Hourly Rate</option>
                <option value="earnings">Sort by Earnings</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 font-medium"
            >
              Search
            </button>
          </form>
          
          <div className="text-white/60 text-sm">
            Showing {sortedFreelancers.length} freelancer{sortedFreelancers.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
            <p className="text-white/70 mt-4">Loading talented freelancers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-300">{error}</p>
              <button
                onClick={fetchFreelancers}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Freelancers Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedFreelancers.map((freelancer, index) => (
              <div
                key={`${freelancer.name}-${index}`}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {getInitials(freelancer.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white capitalize">
                        {freelancer.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-current" size={16} />
                          <span className="text-white/80 ml-1 font-medium">
                            {freelancer.stars}
                          </span>
                        </div>
                        <div className="flex items-center text-white/60">
                          <User size={16} className="mr-1" />
                          <span className="text-sm">{freelancer.reviews}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-green-400 font-bold text-lg">
                      <DollarSign size={18} />
                      <span>{freelancer.hourRating?.replace('USD', '').trim()}</span>
                    </div>
                    <div className="flex items-center text-white/60 text-sm mt-1">
                      <TrendingUp size={14} className="mr-1" />
                      <span>{freelancer.earnings}/10 Success</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {freelancer.bio}
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {getSkillsArray(freelancer.skills).slice(0, 5).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 text-xs font-medium border border-purple-400/30"
                      >
                        {skill}
                      </span>
                    ))}
                    {getSkillsArray(freelancer.skills).length > 5 && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs">
                        +{getSkillsArray(freelancer.skills).length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  <a
                    href={freelancer.freelancerProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 font-medium"
                  >
                    View Profile
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedFreelancers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-white/40" size={32} />
            </div>
            <p className="text-white/70 text-lg">No freelancers found matching your criteria</p>
            <p className="text-white/50 text-sm mt-2">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPortal;