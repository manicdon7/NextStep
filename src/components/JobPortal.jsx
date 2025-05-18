import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Building2, Clock, DollarSign, Globe, ExternalLink } from 'lucide-react';
import { Layout } from './Layout';
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleOnHover } from './Animations';

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('United States');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    const options = {
      method: 'GET',
      url: 'https://upwork-jobs-api2.p.rapidapi.com/active-freelance-1h',
      params: {
        location_filter: location,
        limit: '10'
      },
      headers: {
        'X-RapidAPI-Host': 'upwork-jobs-api2.p.rapidapi.com',
        'X-RapidAPI-Key': 'YOUR_RAPID_API_KEY'
      }
    };

    try {
      const response = await axios.request(options);
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Find Your Dream Job</h2>
              <p className="text-xl text-white/70">Discover freelance opportunities that match your skills</p>
            </div>
          </FadeIn>

        <FadeIn delay={0.2}>
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-purple-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by skill or keyword"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-3 text-purple-400" size={20} />
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="United States">United States</option>
                  <option value="Worldwide">Worldwide</option>
                </select>
              </div>
              <ScaleOnHover>
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 transition-colors w-full md:w-auto"
                >
                  Search Jobs
                </button>
              </ScaleOnHover>
            </div>
          </form>
        </FadeIn>

        <FadeInStagger>
          {loading ? (
            <div className="text-center text-white/70">Loading opportunities...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <FadeInStaggerItem key={job.id || index}>
                  <ScaleOnHover>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-purple-400" />
                              <span>Posted {job.posted_time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2 text-purple-400" />
                              <span>{job.location}</span>
                            </div>
                            {job.hourly_budget && (
                              <div className="flex items-center">
                                <DollarSign size={16} className="mr-2 text-purple-400" />
                                <span>{job.hourly_budget}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-white/70 line-clamp-3">{job.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills?.slice(0, 4).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <ScaleOnHover>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            View Job <ExternalLink size={16} />
                          </a>
                        </ScaleOnHover>
                      </div>
                    </div>
                  </ScaleOnHover>
                </FadeInStaggerItem>
              ))}
            </div>
          )}
        </FadeInStagger>
      </div>
    </div>
    </Layout>
  );
};

export default JobPortal;

