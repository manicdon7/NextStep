import { useState, useEffect, useMemo, useCallback } from "react";
import ResourceTimeline from "../components/resource-timeline";
import { Sparkles, Loader2, LogOut, Lock, ArrowLeft, ChevronDown, ChevronUp, Search, Menu, Sun, Moon, Filter, BarChart2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constants";
import { Tooltip } from "react-tooltip";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

const Tys = () => {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [completedResources, setCompletedResources] = useState({});
  const [levelProgress, setLevelProgress] = useState({});
  const [showResourceTimeline, setShowResourceTimeline] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [resources, setResources] = useState([]);
  const [detailedResources, setDetailedResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedResourceId, setExpandedResourceId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const domains = useMemo(
    () => [
      { id: "cs", name: "Computer Science" },
      { id: "data", name: "Data Analysis" },
      { id: "pm", name: "Project Management" },
      { id: "content", name: "Content Creation" },
      { id: "engineering", name: "Engineering" },
      { id: "psychology", name: "Psychology" },
      { id: "writing", name: "Writing" },
      { id: "design", name: "Graphic Design" },
      { id: "art", name: "Art" },
      { id: "finance", name: "Finance" },
      { id: "science", name: "Science" },
      { id: "teaching", name: "Teaching" },
      { id: "entrepreneur", name: "Entrepreneurship" },
      { id: "journalism", name: "Journalism" },
      { id: "architecture", name: "Architecture" },
      { id: "gamedesign", name: "Game Design" },
      { id: "math", name: "Mathematics" },
      { id: "anthropology", name: "Anthropology" },
      { id: "crafts", name: "Craftsmanship" },
      { id: "philosophy", name: "Philosophy" },
    ],
    []
  );

  const isValidObjectId = (id) => {
    return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Redirect to login if no token or userId
  useEffect(() => {
    if (!token || !userId || !isValidObjectId(userId)) {
      navigate("/login");
    }
  }, [token, userId, navigate]);

  // Fetch user progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId || !token || !isValidObjectId(userId)) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/progress/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLevelProgress(response.data.levelProgress || {});
        setCompletedResources(response.data.completedResources || {});
      } catch (error) {
        console.error("Error fetching progress:", error);
        setError("Failed to load progress. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [userId, token]);

  // Fetch resources for selected domain and level
  useEffect(() => {
    if (!selectedDomain || !selectedLevel) {
      setResources([]);
      setIsLoading(false);
      return;
    }
    const fetchResources = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/resources`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { domain: selectedDomain, level: selectedLevel },
        });
        setResources(response.data?.filter(r => isValidObjectId(r?._id)) || []);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Failed to load resources. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [selectedDomain, selectedLevel, token]);

  // Fetch detailed resources for a specific resource
  const fetchDetailedResources = useCallback(
    async (resourceId) => {
      if (!isValidObjectId(resourceId)) {
        console.error("Invalid resourceId for fetching sub-resources:", resourceId);
        setError("Invalid resource ID.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/detailed-resources`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { resourceId },
        });
        setDetailedResources(response.data?.filter(r => isValidObjectId(r?._id)) || []);
      } catch (error) {
        console.error("Error fetching detailed resources:", error);
        setError("Failed to load sub-resources.");
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // Fetch detailed resources when expandedResourceId changes
  useEffect(() => {
    if (expandedResourceId && isValidObjectId(expandedResourceId)) {
      fetchDetailedResources(expandedResourceId);
    } else {
      setDetailedResources([]);
    }
  }, [expandedResourceId, fetchDetailedResources]);

  // Save progress with debouncing
  const saveProgress = useCallback(
    debounce(async (resourcesToSave) => {
      if (!userId || !token || !isValidObjectId(userId) || !Object.keys(resourcesToSave).length) return;
      try {
        const response = await axios.post(
          `${API_URL}/api/progress/${userId}`,
          { completedResources: resourcesToSave },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLevelProgress(response.data.levelProgress || {});
        setCompletedResources(response.data.completedResources || {});
      } catch (error) {
        console.error("Error saving progress:", error);
        setError("Failed to save progress. Please try again.");
      }
    }, 1000),
    [userId, token]
  );

  useEffect(() => {
    saveProgress(completedResources);
    return () => saveProgress.cancel(); // Cleanup debounce
  }, [completedResources, saveProgress]);

  // Check if a level is unlocked
  const isLevelUnlocked = useCallback(
    (domain, level) => {
      if (level === "beginner") return true;
      const domainProgress = levelProgress[domain] || { beginner: 0, intermediate: 0, advanced: 0 };
      if (level === "intermediate") return domainProgress.beginner >= 100;
      if (level === "advanced") return domainProgress.intermediate >= 100;
      return false;
    },
    [levelProgress]
  );

  // Check if a resource is unlocked
  const isResourceUnlocked = useCallback(
    (resource, index) => {
      if (!resource || !isValidObjectId(resource._id)) return false;
      if (index === 0) return true;
      const prevResource = resources[index - 1];
      return prevResource && isValidObjectId(prevResource._id) && !!completedResources[prevResource._id];
    },
    [completedResources, resources]
  );

  // Mark resource as completed
  const markAsCompleted = useCallback(
    async (resourceId) => {
      if (!isValidObjectId(resourceId)) {
        console.error("Invalid resourceId for completion:", resourceId);
        setError("Invalid resource ID.");
        return;
      }
      try {
        const response = await axios.post(
          `${API_URL}/api/resources/${resourceId}/complete`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompletedResources(response.data.completedResources || {});
        setLevelProgress(response.data.levelProgress || {});
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer); // Cleanup timeout
      } catch (error) {
        console.error("Error marking resource as completed:", error);
        setError("Failed to mark resource as completed.");
      }
    },
    [token]
  );

  // Handle resource access
  const handleAccessResource = useCallback(
    async (resourceId) => {
      if (!isValidObjectId(resourceId)) {
        console.error("Invalid resourceId in handleAccessResource:", resourceId);
        setError("Invalid resource ID.");
        return;
      }
      setSelectedResourceId(resourceId);
      await fetchDetailedResources(resourceId);
      if (!error) {
        setShowResourceTimeline(true);
      }
    },
    [error, fetchDetailedResources]
  );

  // Toggle sub-resources
  const toggleSubResources = useCallback((resourceId) => {
    if (!isValidObjectId(resourceId)) {
      console.error("Invalid resourceId for toggle:", resourceId);
      setError("Invalid resource ID.");
      return;
    }
    setExpandedResourceId(expandedResourceId === resourceId ? null : resourceId);
  }, [expandedResourceId]);

  // Get resource icon
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return "📹";
      case "blog":
        return "📝";
      case "pdf":
        return "📄";
      default:
        return "📚";
    }
  };

  // Parse estimated time
  const parseEstimatedTime = (time) => {
    if (!time || typeof time !== "string") return 0;
    const hoursMatch = time.match(/(\d*\.?\d+)\s*hour/i);
    const minutesMatch = time.match(/(\d*\.?\d+)\s*min/i);
    const hours = hoursMatch ? parseFloat(hoursMatch[1]) * 60 : 0;
    const minutes = minutesMatch ? parseFloat(minutesMatch[1]) : 0;
    return hours + minutes;
  };

  // Calculate total estimated time
  const getTotalEstimatedTime = useMemo(() => {
    return resources.reduce((total, resource) => total + parseEstimatedTime(resource?.estimatedTime), 0);
  }, [resources]);

  // Format time
  const formatTime = (totalMinutes) => {
    if (!totalMinutes || isNaN(totalMinutes)) return "0 min";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min`;
  };

  // Filter resources
  const filteredResources = useMemo(() => {
    let filtered = resources.filter(r => isValidObjectId(r?._id));
    if (resourceFilter !== "all") {
      filtered = filtered.filter(r => r?.type?.toLowerCase() === resourceFilter);
    }
    if (sortOrder === "time") {
      filtered = [...filtered].sort((a, b) => parseEstimatedTime(a?.estimatedTime) - parseEstimatedTime(b?.estimatedTime));
    }
    return filtered;
  }, [resources, resourceFilter, sortOrder]);

  // Filter domains
  const filteredDomains = useMemo(() => {
    if (!searchQuery) return domains;
    return domains.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, domains]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setError(null);
    if (selectedResourceId && isValidObjectId(selectedResourceId)) {
      fetchDetailedResources(selectedResourceId);
    } else if (selectedDomain && selectedLevel) {
      setIsLoading(true);
      const fetchResources = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/resources`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { domain: selectedDomain, level: selectedLevel },
          });
          setResources(response.data?.filter(r => isValidObjectId(r?._id)) || []);
        } catch (error) {
          console.error("Error retrying resources:", error);
          setError("Failed to load resources. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchResources();
    }
  }, [selectedResourceId, selectedDomain, selectedLevel, token, fetchDetailedResources]);

  // Render ResourceTimeline component
  if (showResourceTimeline && selectedDomain && isValidObjectId(selectedResourceId)) {
    const selectedResource = resources.find(r => r._id === selectedResourceId);
    const domainName = domains.find(d => d.id === selectedDomain)?.name || "Unknown Domain";
    return (
      <ResourceTimeline
        resources={detailedResources}
        resourceType={selectedResource?.type || "Unknown"}
        domainName={domainName}
        level={selectedLevel}
        completedResources={completedResources}
        markAsCompleted={markAsCompleted}
        onBack={() => {
          setShowResourceTimeline(false);
          setSelectedResourceId(null);
          setDetailedResources([]);
          setError(null);
        }}
        parentResourceId={selectedResourceId}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0D1324] to-[#1A2540] text-white font-sans relative overflow-hidden ${isDarkMode ? "dark" : ""}`}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <header className="p-6 bg-[#1E293B]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden text-[#AD46FF]"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-[#AD46FF]" />
              <span className="text-2xl font-bold text-white">NextStep</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-[#AD46FF]/20 text-[#AD46FF] hover:bg-[#AD46FF]/30"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate("/login");
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#AD46FF]/20 text-[#AD46FF] hover:bg-[#AD46FF]/30"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 left-0 h-full w-64 bg-[#1E293B] z-30 shadow-lg md:hidden p-4 border-r border-[#AD46FF]/30"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#AD46FF]">Domains</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-[#AD46FF]"
                aria-label="Close sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#AD46FF]" />
              <input
                type="text"
                placeholder="Search domains..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 p-2 rounded-lg bg-[#0D1324] text-white border border-gray-700 focus:border-[#AD46FF]"
                aria-label="Search domains"
              />
            </div>
            <div className="space-y-2 mt-4">
              {filteredDomains.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => {
                    setSelectedDomain(domain.id);
                    setShowSidebar(false);
                  }}
                  className="w-full text-left p-2 rounded-lg text-[#AD46FF] hover:bg-[#0D1324] border border-[#AD46FF]/30"
                  aria-label={`Select ${domain.name} domain`}
                >
                  {domain.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-12 text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Train Yourself
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-300"
        >
          Discover curated learning paths to master new skills.
        </motion.p>
      </section>

      <main className="max-w-7xl mx-auto px-4 pb-16">
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#AD46FF]" />
            <span className="ml-2 text-gray-300">Loading...</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 text-yellow-400 p-4 rounded-lg mb-6 text-center flex items-center justify-center border border-[#AD46FF]/30"
          >
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="ml-4 px-3 py-1 bg-[#AD46FF]/90 text-white rounded-lg text-sm hover:bg-[#AD46FF]"
              aria-label="Retry loading resources"
            >
              Retry
            </button>
          </motion.div>
        )}

        {!selectedDomain ? (
          <section>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-[#AD46FF] mb-6 text-center"
            >
              Choose Your Learning Path
            </motion.h2>
            <div className="mb-6 flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#AD46FF]" />
                <input
                  type="text"
                  placeholder="Search domains..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 p-2 rounded-lg bg-[#0D1324] text-white border border-gray-700 focus:border-[#AD46FF]"
                  aria-label="Search domains"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDomains.map(domain => (
                <motion.button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-lg bg-[#1E293B] border border-[#AD46FF]/30 text-white hover:bg-[#0D1324]"
                  aria-label={`Select ${domain.name} domain`}
                >
                  {domain.name}
                </motion.button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <div className="flex justify-between items-center mb-6">
              <motion.button
                onClick={() => {
                  setSelectedDomain(null);
                  setResources([]);
                  setDetailedResources([]);
                  setSelectedResourceId(null);
                  setShowResourceTimeline(false);
                  setExpandedResourceId(null);
                  setError(null);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#AD46FF] hover:underline flex items-center"
                aria-label="Back to domains"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Domains
              </motion.button>
              <h2 className="text-2xl font-bold text-white">
                {domains.find(d => d.id === selectedDomain)?.name || "Unknown Domain"}
              </h2>
              <motion.button
                onClick={() => setShowProgressDashboard(!showProgressDashboard)}
                className="flex items-center space-x-2 text-[#AD46FF] hover:underline"
                aria-label={showProgressDashboard ? "Hide progress dashboard" : "Show progress dashboard"}
              >
                <BarChart2 className="h-5 w-5" />
                <span>Progress</span>
              </motion.button>
            </div>

            <AnimatePresence>
              {showProgressDashboard && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-8 bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30"
                >
                  <h3 className="text-xl font-bold text-[#AD46FF] mb-4">Progress Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {domains.map(domain => (
                      <div key={domain.id} className="p-4 rounded-lg bg-black/20 border border-gray-700">
                        <h4 className="text-lg font-medium text-[#AD46FF]">{domain.name}</h4>
                        {["beginner", "intermediate", "advanced"].map(level => (
                          <div key={level} className="mt-2">
                            <div className="flex justify-between text-sm text-gray-300">
                              <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                              <span>{levelProgress[domain.id]?.[level] || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                              <div
                                className="bg-[#AD46FF] h-2 rounded-full"
                                style={{ width: `${levelProgress[domain.id]?.[level] || 0}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30"
            >
              <div className="flex justify-between items-center mb-3 text-gray-300">
                <span className="text-lg font-medium">Progress ({selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)})</span>
                <span className="text-[#AD46FF] font-semibold">{levelProgress[selectedDomain]?.[selectedLevel] || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-[#AD46FF] h-2.5 rounded-full"
                  style={{ width: `${levelProgress[selectedDomain]?.[selectedLevel] || 0}%` }}
                />
              </div>
            </motion.div>

            <div className="flex border-b border-gray-700 mb-8">
              {["beginner", "intermediate", "advanced"].map(level => {
                const unlocked = isLevelUnlocked(selectedDomain, level);
                return (
                  <motion.button
                    key={level}
                    className={`px-6 py-3 text-lg font-medium ${
                      !unlocked
                        ? "text-gray-500 cursor-not-allowed"
                        : selectedLevel === level
                        ? "text-[#AD46FF] border-b-2 border-[#AD46FF]"
                        : "text-gray-300 hover:text-[#AD46FF]"
                    }`}
                    onClick={() => unlocked && setSelectedLevel(level)}
                    disabled={!unlocked}
                    data-tooltip-id="level-tooltip"
                    data-tooltip-content={
                      !unlocked ? `Complete ${level === "intermediate" ? "Beginner" : "Intermediate"} level to unlock` : ""
                    }
                    aria-label={`Select ${level} level${!unlocked ? " (locked)" : ""}`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                    <span className="ml-2 text-sm text-gray-400">{formatTime(getTotalEstimatedTime)}</span>
                    {!unlocked && <Lock className="inline h-4 w-4 ml-2" />}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-[#AD46FF]" />
                <select
                  value={resourceFilter}
                  onChange={e => setResourceFilter(e.target.value)}
                  className="p-2 rounded-lg bg-[#0D1324] text-white border border-gray-700 focus:border-[#AD46FF]"
                  aria-label="Filter resources by type"
                >
                  <option value="all">All Types</option>
                  <option value="video">Videos</option>
                  <option value="blog">Blogs</option>
                  <option value="pdf">PDFs</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="p-2 rounded-lg bg-[#0D1324] text-white border border-gray-700 focus:border-[#AD46FF]"
                  aria-label="Sort resources"
                >
                  <option value="default">Default</option>
                  <option value="time">Time</option>
                </select>
              </div>
            </div>

            {filteredResources.length === 0 && (
              <motion.div className="text-center py-12">
                <p className="text-lg text-gray-300">No resources available for this domain and level.</p>
                <button
                  onClick={() => setSelectedDomain(null)}
                  className="mt-4 px-4 py-2 bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white rounded-lg transition-colors"
                  aria-label="Explore other domains"
                >
                  Explore Other Domains
                </button>
              </motion.div>
            )}
            <div className="space-y-4">
              {filteredResources.map((resource, index) => {
                const isUnlocked = isResourceUnlocked(resource, index);
                const isCompleted = !!completedResources[resource._id];
                const isExpanded = expandedResourceId === resource._id;

                return (
                  <motion.div
                    key={resource._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    {index < filteredResources.length - 1 && (
                      <div
                        className={`absolute top-10 left-6 h-[calc(100%-2.5rem)] w-0.5 ${
                          isCompleted ? "bg-[#AD46FF]" : "bg-gray-600"
                        }`}
                      />
                    )}
                    <div className="flex items-start">
                      <div className="mt-1 mr-6">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCompleted
                              ? "bg-[#AD46FF] text-white"
                              : isUnlocked
                              ? "bg-[#1E293B] border-2 border-[#AD46FF] text-[#AD46FF]"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                      </div>
                      <div className="flex-1 bg-[#1E293B] rounded-lg border border-[#AD46FF]/30 hover:bg-[#0D1324]">
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <span className="text-2xl mr-2">{getIcon(resource?.type)}</span>
                            <span className="text-sm uppercase font-bold text-[#AD46FF]">{resource?.type || "Unknown"}</span>
                            <span className="ml-auto text-sm text-gray-400">{resource?.estimatedTime || "N/A"}</span>
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">{resource?.title || "Untitled Resource"}</h3>
                          <p className="text-sm text-gray-300 mb-4">{resource?.description || "No description available."}</p>
                          <div className="flex items-center justify-between mb-2">
                            <button
                              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                isUnlocked
                                  ? "bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white"
                                  : "bg-gray-600 text-gray-500 cursor-not-allowed"
                              }`}
                              onClick={() => isUnlocked && handleAccessResource(resource._id)}
                              disabled={!isUnlocked}
                              data-tooltip-id="resource-tooltip"
                              data-tooltip-content={isUnlocked ? "" : "Complete the previous resource to unlock"}
                              aria-label={`View sub-resources for ${resource?.title || "resource"}`}
                            >
                              View Sub-Resources
                            </button>
                            {!isCompleted && (
                              <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                  isUnlocked
                                    ? "bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white"
                                    : "bg-gray-600 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={() => isUnlocked && markAsCompleted(resource._id)}
                                disabled={!isUnlocked}
                                data-tooltip-id="resource-tooltip"
                                data-tooltip-content={isUnlocked ? "" : "Complete the previous resource to unlock"}
                                aria-label={`Mark ${resource?.title || "resource"} as completed`}
                              >
                                Mark as Completed
                              </button>
                            )}
                            {isCompleted && (
                              <span className="text-[#AD46FF] font-medium">✓ Completed</span>
                            )}
                          </div>
                          {!isUnlocked && (
                            <div className="text-xs text-yellow-400 flex items-center">
                              <Lock className="mr-1 h-3 w-3" /> Complete previous resource
                            </div>
                          )}
                          {isUnlocked && (
                            <button
                              onClick={() => toggleSubResources(resource._id)}
                              className="flex items-center space-x-2 text-[#AD46FF] hover:text-[#AD46FF]/80 mt-2 text-sm"
                              aria-label={isExpanded ? `Hide sub-resources for ${resource?.title || "resource"}` : `Show sub-resources for ${resource?.title || "resource"}`}
                            >
                              <span>{isExpanded ? "Hide Sub-Resources" : "Show Sub-Resources"}</span>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          )}
                          <AnimatePresence>
                            {isExpanded && isUnlocked && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 bg-black/20 p-3 rounded-lg border border-gray-700"
                              >
                                {isLoading && (
                                  <div className="flex justify-center items-center py-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-[#AD46FF]" />
                                  </div>
                                )}
                                {!isLoading && detailedResources.length === 0 && (
                                  <p className="text-sm text-gray-400">No sub-resources available for this category.</p>
                                )}
                                {!isLoading &&
                                  detailedResources.length > 0 &&
                                  detailedResources.map((subResource, subIndex) => {
                                    const isSubUnlocked = subIndex === 0 ? true : !!completedResources[detailedResources[subIndex - 1]?._id];
                                    const isSubCompleted = !!completedResources[subResource._id];

                                    return (
                                      <div
                                        key={subResource._id}
                                        className="flex items-start p-2 rounded-lg hover:bg-[#0D1324]"
                                      >
                                        <div
                                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                                            isSubCompleted
                                              ? "bg-[#AD46FF] text-white"
                                              : isSubUnlocked
                                              ? "bg-[#1E293B] border border-[#AD46FF] text-[#AD46FF]"
                                              : "bg-gray-700 text-gray-400"
                                          }`}
                                        >
                                          {isSubCompleted ? "✓" : subIndex + 1}
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="text-sm font-medium text-white">{subResource?.title || "Untitled"}</h4>
                                          <p className="text-xs text-gray-300">{subResource?.description || "No description."}</p>
                                          <p className="text-xs text-gray-400 mt-0.5">
                                            {subResource?.estimatedTime || "N/A"} • {subResource?.type || "Unknown"}
                                          </p>
                                          {subResource?.url && (
                                            <a
                                              href={subResource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`text-[#AD46FF] hover:underline text-xs mt-1 inline-block ${
                                                !isSubUnlocked ? "pointer-events-none opacity-50" : ""
                                              }`}
                                              aria-label={`View sub-resource ${subResource?.title || "resource"}`}
                                            >
                                              View Resource
                                            </a>
                                          )}
                                          {!isSubCompleted && (
                                            <button
                                              className={`mt-1 px-3 py-1 rounded-lg text-xs font-medium ${
                                                isSubUnlocked
                                                  ? "bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white"
                                                  : "bg-gray-400 text-gray-500 cursor-not-allowed"
                                              }`}
                                              onClick={() => isSubUnlocked && markAsCompleted(subResource._id)}
                                              disabled={!isSubUnlocked}
                                              aria-label={`Mark sub-resource ${subResource?.title || "resource"} as completed`}
                                            >
                                              Mark as Completed
                                            </button>
                                          )}
                                          {isSubCompleted && (
                                            <span className="text-[#AD46FF] text-xs mt-1 inline-block">✓ Completed</span>
                                          )}
                                          {!isSubUnlocked && (
                                            <div className="text-yellow-400 text-xs mt-1 flex items-center">
                                              <Lock className="mr-1 h-2 w-2 text-white" /> Complete previous sub-resource
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30"
            >
              <h3 className="text-xl font-bold text-[#AD46FF] mb-4">Learning Path</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <h4 className="text-base font-medium text-white mb-2">
                    Beginner {(levelProgress[selectedDomain]?.beginner || 0) >= 100 ? "✅" : ""}
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>- Understand core concepts</li>
                    <li>- Learn fundamental terminology</li>
                    <li>- Explore introductory resources</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-base font-medium text-white mb-2">
                    Intermediate {(levelProgress[selectedDomain]?.intermediate || 0) >= 100 ? "✅" : ""}
                    {(levelProgress[selectedDomain]?.beginner || 0) < 100 ? " 🔒" : ""}
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>- Apply concepts to real-world problems</li>
                    <li>- Develop practical skills</li>
                    <li>- Complete guided projects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-base font-medium text-white mb-2">
                    Advanced {(levelProgress[selectedDomain]?.advanced || 0) >= 100 ? "✅" : ""}
                    {(levelProgress[selectedDomain]?.intermediate || 0) < 100 ? " 🔒" : ""}
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>- Master complex techniques</li>
                    <li>- Develop specialized knowledge</li>
                    <li>- Build advanced projects</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30"
            >
              <h3 className="text-xl font-bold text-[#AD46FF] mb-4">Additional Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-black/20 p-3 rounded-lg border border-gray-700">
                  <h4 className="text-base font-medium text-white mb-2">Top YouTube Channels</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>
                      <a
                        href={`https://youtube.com/results?search_query=${encodeURIComponent(
                          domains.find(d => d.id === selectedDomain)?.name || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`YouTube tutorials for ${domains.find(d => d.id === selectedDomain)?.name || "domain"}`}
                      >
                        - {domains.find(d => d.id === selectedDomain)?.name || "Domain"} Tutorials
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://youtube.com/results?search_query=learn+${encodeURIComponent(
                          domains.find(d => d.id === selectedDomain)?.name || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`Learn ${domains.find(d => d.id === selectedDomain)?.name || "domain"} on YouTube`}
                      >
                        - Learn {domains.find(d => d.id === selectedDomain)?.name || "Domain"}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://youtube.com/results?search_query=${encodeURIComponent(
                          (domains.find(d => d.id === selectedDomain)?.name || "") + " mastery"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`${domains.find(d => d.id === selectedDomain)?.name || "domain"} mastery on YouTube`}
                      >
                        - {domains.find(d => d.id === selectedDomain)?.name || "Domain"} Mastery
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-gray-700">
                  <h4 className="text-base font-medium text-white mb-2">Best Blogs & Podcasts</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>
                      <a
                        href={`https://medium.com/search?q=${encodeURIComponent(
                          domains.find(d => d.id === selectedDomain)?.name || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`Medium collection for ${domains.find(d => d.id === selectedDomain)?.name || "domain"}`}
                      >
                        - Medium's {domains.find(d => d.id === selectedDomain)?.name || "Domain"} Collection
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          (domains.find(d => d.id === selectedDomain)?.name || "") + " blog"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`${domains.find(d => d.id === selectedDomain)?.name || "domain"} blogs on Google`}
                      >
                        - {domains.find(d => d.id === selectedDomain)?.name || "Domain"} Today
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          (domains.find(d => d.id === selectedDomain)?.name || "") + " journal"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`${domains.find(d => d.id === selectedDomain)?.name || "domain"} journal on Google`}
                      >
                        - The {domains.find(d => d.id === selectedDomain)?.name || "Domain"} Journal
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-gray-700">
                  <h4 className="text-base font-medium text-white mb-2">Free E-Books & PDFs</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>
                      <a
                        href={`https://openlibrary.org/search?q=${encodeURIComponent(
                          domains.find(d => d.id === selectedDomain)?.name || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`Open Library books for ${domains.find(d => d.id === selectedDomain)?.name || "domain"}`}
                      >
                        - {domains.find(d => d.id === selectedDomain)?.name || "Domain"} Fundamentals
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://www.pdfdrive.com/search?q=${encodeURIComponent(
                          domains.find(d => d.id === selectedDomain)?.name || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`PDF Drive resources for ${domains.find(d => d.id === selectedDomain)?.name || "domain"}`}
                      >
                        - Practical {domains.find(d => d.id === selectedDomain)?.name || "Domain"}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          (domains.find(d => d.id === selectedDomain)?.name || "") + " free pdf"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AD46FF] hover:underline"
                        aria-label={`Free PDFs for ${domains.find(d => d.id === selectedDomain)?.name || "domain"} on Google`}
                      >
                        - {domains.find(d => d.id === selectedDomain)?.name || "Domain"} Handbook
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </main>

      <footer className="py-2 text-center text-sm text-gray-400 bg-[#1E293B]/30 backdrop-blur-md">
        <p>NextStep © {new Date().getFullYear()} | Expand your knowledge and skills</p>
      </footer>

      <Tooltip id="level-tooltip" className="bg-[#AD46FF] text-white" />
      <Tooltip id="resource-tooltip" className="bg-[#AD46FF] text-white" />
    </div>
  );
};

export default Tys;