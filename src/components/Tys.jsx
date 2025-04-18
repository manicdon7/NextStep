import { useState, useEffect } from "react"
import ResourceTimeline from "./resource-timeline"
import resourcesData from "../data/resouces.json"

const Tys = () => {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState("beginner")
  const [completedResources, setCompletedResources] = useState({})
  const [levelProgress, setLevelProgress] = useState({})
  const [showResourceTimeline, setShowResourceTimeline] = useState(false)
  const [selectedResourceType, setSelectedResourceType] = useState(null)

  // Load saved progress from localStorage on component mount
  useEffect(() => {
    const savedLevelProgress = localStorage.getItem("levelProgress")
    const savedCompletedResources = localStorage.getItem("completedResources")

    if (savedLevelProgress) setLevelProgress(JSON.parse(savedLevelProgress))
    if (savedCompletedResources) setCompletedResources(JSON.parse(savedCompletedResources))
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("levelProgress", JSON.stringify(levelProgress))
    localStorage.setItem("completedResources", JSON.stringify(completedResources))
  }, [levelProgress, completedResources])

  // Auto-complete resource types when all detailed resources are completed
  useEffect(() => {
    if (selectedDomain && selectedLevel) {
      const resourceTypes = ["video", "blog", "pdf"]
      const updatedCompletedResources = { ...completedResources }
      let changed = false

      resourceTypes.forEach((type) => {
        const typeResources = getDetailedResources(selectedDomain, selectedLevel, type)
        if (typeResources.length > 0) {
          const allTypeResourcesCompleted = typeResources.every((r) => completedResources[r.id])
          if (allTypeResourcesCompleted) {
            // Find the main resource of this type and mark it as completed
            const mainResource = getResources(selectedDomain, selectedLevel).find((r) => r.type === type)
            if (mainResource && !completedResources[mainResource.id]) {
              updatedCompletedResources[mainResource.id] = true
              changed = true
            }
          }
        }
      })

      // Update completed resources if changes were made
      if (changed) {
        setCompletedResources(updatedCompletedResources)

        // Recalculate level progress for the specific domain
        const currentResources = getResources(selectedDomain, selectedLevel)
        const completedCount = currentResources.filter((r) => updatedCompletedResources[r.id]).length
        const newProgress = Math.floor((completedCount / currentResources.length) * 100)

        setLevelProgress((prev) => ({
          ...prev,
          [selectedDomain]: {
            ...(prev[selectedDomain] || { beginner: 0, intermediate: 0, advanced: 0 }),
            [selectedLevel]: newProgress,
          },
        }))
      }
    }
  }, [completedResources, selectedDomain, selectedLevel])

  const domains = [
    { id: "cs", name: "Computer Science" },
    { id: "data", name: "Data Analysis" },
    { id: "pm", name: "Project Management" },
    { id: "content", name: "Content Creation" },
    { id: "engineering", name: "Engineering" },
    { id: "psychology", name: "Psychology" },
    { id: "writing", name: "Writing" },
    { id: "design", name: "Graphic Design" },
    { id: "art", name: "Artist" },
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
  ]

  // Get resources with unlocking logic
  const getResources = (domain, level) => {
    if (resourcesData[domain] && resourcesData[domain][level]) {
      return resourcesData[domain][level]
    }

    // Generate default content if specific domain isn't defined yet
    return []
  }

  // Get detailed resources for a specific type (videos, blogs, pdfs)
  const getDetailedResources = (domain, level, type) => {
    // Get the detailed resources from the resourcesData
    if (
      resourcesData.detailedResources &&
      resourcesData.detailedResources[domain] &&
      resourcesData.detailedResources[domain][level] &&
      resourcesData.detailedResources[domain][level][type]
    ) {
      return resourcesData.detailedResources[domain][level][type]
    }

    // Return empty array if not defined
    return []
  }

  // Check if a level is unlocked for a specific domain
  const isLevelUnlocked = (domain, level) => {
    if (level === "beginner") return true

    const domainProgress = levelProgress[domain] || { beginner: 0, intermediate: 0, advanced: 0 }

    if (level === "intermediate") return domainProgress.beginner === 100
    if (level === "advanced") return domainProgress.intermediate === 100

    return false
  }

  // Check if a resource is unlocked
  const isResourceUnlocked = (resource) => {
    // First resource is always unlocked
    if (!resource.unlockRequirement) return true

    // Check if the required previous resource is completed
    return completedResources[resource.unlockRequirement] === true
  }

  // Mark a resource as completed
  const markAsCompleted = (resourceId) => {
    setCompletedResources((prev) => {
      const updated = { ...prev, [resourceId]: true }

      // Calculate progress percentage for current domain and level
      const currentResources = getResources(selectedDomain, selectedLevel)
      const completedCount = currentResources.filter((r) => updated[r.id]).length
      const newProgress = Math.floor((completedCount / currentResources.length) * 100)

      // Update the progress for the specific domain and level
      setLevelProgress((prev) => ({
        ...prev,
        [selectedDomain]: {
          ...(prev[selectedDomain] || { beginner: 0, intermediate: 0, advanced: 0 }),
          [selectedLevel]: newProgress,
        },
      }))

      return updated
    })
  }

  // Handle clicking on "Access Resource" button
  const handleAccessResource = (resourceType) => {
    setSelectedResourceType(resourceType)
    setShowResourceTimeline(true)
  }

  // Resource type icons
  const getIcon = (type) => {
    switch (type) {
      case "video":
        return "📹"
      case "blog":
        return "📝"
      case "pdf":
        return "📄"
      default:
        return "📚"
    }
  }

  // Calculate estimated total time for a level
  const getTotalEstimatedTime = (domain, level) => {
    const levelResources = getResources(domain, level)
    return levelResources.reduce((total, resource) => {
      const time = resource.estimatedTime || "0 min"
      const hours = time.includes("hour") ? Number.parseFloat(time) * 60 : 0
      const minutes = time.includes("min") ? Number.parseFloat(time) : 0
      return total + hours + minutes
    }, 0)
  }

  // Format minutes to hours and minutes
  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)

    if (hours === 0) return `${minutes} min`
    if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min`
  }

  // If showing resource timeline, render that component
  if (showResourceTimeline && selectedDomain && selectedResourceType) {
    return (
      <ResourceTimeline
        resources={getDetailedResources(selectedDomain, selectedLevel, selectedResourceType)}
        resourceType={selectedResourceType}
        domainName={domains.find((d) => d.id === selectedDomain)?.name}
        level={selectedLevel}
        completedResources={completedResources}
        markAsCompleted={markAsCompleted}
        onBack={() => setShowResourceTimeline(false)}
      />
    )
  }

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
              {domains.map((domain) => (
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
              <h2 className="text-2xl font-bold text-white">{domains.find((d) => d.id === selectedDomain)?.name}</h2>
              <div></div> {/* Empty div for flex spacing */}
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Your Progress ({selectedLevel})</span>
                <span className="text-[#AD46FF]">{levelProgress[selectedDomain]?.[selectedLevel] || 0}%</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-4 overflow-hidden">
                <div
                  className="bg-[#AD46FF] h-4 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress[selectedDomain]?.[selectedLevel] || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Level tabs */}
            <div className="flex border-b border-[#AD46FF]/30 mb-6">
              {["beginner", "intermediate", "advanced"].map((level) => {
                const unlocked = isLevelUnlocked(selectedDomain, level)
                const domainProgress = levelProgress[selectedDomain] || { beginner: 0, intermediate: 0, advanced: 0 }

                return (
                  <button
                    key={level}
                    className={`px-4 py-2 font-medium ${
                      !unlocked
                        ? "text-gray-600 cursor-not-allowed"
                        : selectedLevel === level
                          ? "text-[#AD46FF] border-b-2 border-[#AD46FF]"
                          : "text-gray-400 hover:text-gray-200"
                    }`}
                    onClick={() => unlocked && setSelectedLevel(level)}
                    disabled={!unlocked}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                    <span className="ml-2 text-xs text-gray-400">
                      {formatTime(getTotalEstimatedTime(selectedDomain, level))}
                    </span>
                    {!unlocked && (
                      <span className="ml-2 text-xs text-yellow-500">
                        🔒 {level === "intermediate" ? "Complete Beginner" : "Complete Intermediate"}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Timeline with resources */}
            <div className="mb-10">
              {getResources(selectedDomain, selectedLevel).map((resource, index) => {
                const isUnlocked = isResourceUnlocked(resource)
                const isCompleted = completedResources[resource.id] === true

                return (
                  <div key={resource.id} className="relative pb-10">
                    {/* Timeline line */}
                    {index < getResources(selectedDomain, selectedLevel).length - 1 && (
                      <div
                        className={`absolute top-10 left-4 h-full w-0.5 ${isCompleted ? "bg-[#AD46FF]" : "bg-gray-700"}`}
                      ></div>
                    )}

                    {/* Resource card */}
                    <div className={`flex mb-4 ${!isUnlocked ? "opacity-60" : ""}`}>
                      {/* Timeline dot */}
                      <div className="mt-2 mr-6">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                            <button
                              className="inline-block bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white px-4 py-2 rounded transition-colors"
                              onClick={() => handleAccessResource(resource.type)}
                            >
                              Access Resource
                            </button>

                            {/* {!isCompleted && (
                              <button
                                onClick={() => markAsCompleted(resource.id)}
                                className={`ml-3 ${
                                  isUnlocked
                                    ? "bg-green-600/80 hover:bg-green-600 text-white"
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                } px-4 py-2 rounded transition-colors`}
                                disabled={!isUnlocked}
                              >
                                Mark as Completed
                              </button>
                            )} */}

                            {isCompleted && <span className="text-green-500 font-medium">Completed</span>}
                          </div>

                          {!isUnlocked && (
                            <div className="mt-3 text-sm text-yellow-400">Complete previous resources to unlock</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Learning path */}
            <div className="mt-10 bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30">
              <h3 className="text-xl font-bold text-[#AD46FF] mb-4">Learning Path</h3>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-medium text-white mb-2">
                    Beginner {(levelProgress[selectedDomain]?.beginner || 0) === 100 ? "✅" : ""}
                  </h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Understand core concepts</li>
                    <li>• Learn fundamental terminology</li>
                    <li>• Practice basic techniques</li>
                  </ul>
                </div>
                <div className="mb-4 md:mb-0">
                  <h4 className="font-medium text-white mb-2">
                    Intermediate {(levelProgress[selectedDomain]?.intermediate || 0) === 100 ? "✅" : ""}
                    {(levelProgress[selectedDomain]?.beginner || 0) < 100 && " 🔒"}
                  </h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Build on core knowledge</li>
                    <li>• Develop practical skills</li>
                    <li>• Complete guided projects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Advanced {(levelProgress[selectedDomain]?.advanced || 0) === 100 ? "✅" : ""}
                    {(levelProgress[selectedDomain]?.intermediate || 0) < 100 && " 🔒"}
                  </h4>
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
                    <li>• {domains.find((d) => d.id === selectedDomain)?.name} Academy</li>
                    <li>• Learn {domains.find((d) => d.id === selectedDomain)?.name}</li>
                    <li>• {domains.find((d) => d.id === selectedDomain)?.name} Mastery</li>
                  </ul>
                </div>
                <div className="p-3 bg-[#0D1324] rounded-lg">
                  <h4 className="font-medium text-white mb-2">Best Blogs & Publications</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Medium's {domains.find((d) => d.id === selectedDomain)?.name} Collection</li>
                    <li>• {domains.find((d) => d.id === selectedDomain)?.name} Today</li>
                    <li>• The {domains.find((d) => d.id === selectedDomain)?.name} Journal</li>
                  </ul>
                </div>
                <div className="p-3 bg-[#0D1324] rounded-lg">
                  <h4 className="font-medium text-white mb-2">Free E-Books & PDFs</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• {domains.find((d) => d.id === selectedDomain)?.name} Fundamentals</li>
                    <li>• Practical {domains.find((d) => d.id === selectedDomain)?.name}</li>
                    <li>• {domains.find((d) => d.id === selectedDomain)?.name} Handbook</li>
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
  )
}

export default Tys
