import { useState, useEffect } from "react"

const ResourceTimeline = ({
  resources,
  resourceType,
  domainName,
  level,
  completedResources,
  markAsCompleted,
  onBack,
}) => {
  const [activeResource, setActiveResource] = useState(resources.length > 0 ? resources[0] : null)

  // Update the component to handle auto-completion of parent resources
  useEffect(() => {
    // When all resources in the timeline are completed, notify the parent component
    const allCompleted = resources.length > 0 && resources.every((r) => completedResources[r.id])

    if (allCompleted) {
      // Find the main resource of this type in the parent component
      // Use a domain-specific ID format
      const mainResourceId = `${domainName.toLowerCase().replace(/\s+/g, "-")}-${level}-${resourceType}`
      if (!completedResources[mainResourceId]) {
        markAsCompleted(mainResourceId)
      }
    }
  }, [completedResources, resources, domainName, level, resourceType, markAsCompleted])

  // Resource type icons
  const getIcon = () => {
    switch (resourceType) {
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


  // Render content based on resource type
const renderResourceContent = (resource) => {
  const isUnlocked = isResourceUnlocked(resource);
  if (!isUnlocked) {
    return (
      <div className="mb-6 bg-black/20 p-4 rounded-lg border border-gray-700">
        <p className="text-gray-300 mb-4">
          This resource is locked. Complete the previous resource to unlock.
        </p>
        <div className="inline-block bg-gray-600 text-white px-4 py-2 rounded cursor-not-allowed">
          Locked
        </div>
      </div>
    );
  }

  switch (resourceType) {
    case "video":
      return (
        <div className="mb-6 aspect-video bg-black/50 rounded-lg">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${resource.url.split("v=")[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    case "blog":
      return (
        <div className="mb-6 bg-black/20 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-300 mb-4">
            This blog post contains valuable information about {domainName.toLowerCase()}.
          </p>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white px-4 py-2 rounded transition-colors"
          >
            Read Blog Post
          </a>
        </div>
      );
    case "pdf":
      return (
        <div className="mb-6 bg-black/20 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-300 mb-4">
            This PDF document provides in-depth knowledge about {domainName.toLowerCase()}.
          </p>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white px-4 py-2 rounded transition-colors"
          >
            View PDF
          </a>
        </div>
      );
    default:
      return null;
  }
};

// Check if a resource is unlocked
const isResourceUnlocked = (resource) => {
  if (!resource.unlockRequirement) return true;
  const prevResourceIndex = resources.findIndex(r => r.id === resource.unlockRequirement);
  return prevResourceIndex === -1 || completedResources[resources[prevResourceIndex].id] === true;
};

return (
  <div className="min-h-screen bg-gradient-to-br from-[#0D1324] to-[#1A2540]">
    {/* Header */}
    <header className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button className="text-[#AD46FF] hover:underline flex items-center" onClick={onBack}>
          ← Back to Resources
        </button>
        <h1 className="text-2xl font-bold text-white">
          {domainName} {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}s
        </h1>
        <div></div> {/* Empty div for flex spacing */}
      </div>
      <p className="text-center text-gray-300">
        {level.charAt(0).toUpperCase() + level.slice(1)} level {resourceType} resources
      </p>
    </header>

    <div className="container mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timeline sidebar */}
        <div className="md:col-span-1 bg-[#1E293B] p-4 rounded-lg border border-[#AD46FF]/30">
          <h2 className="text-xl font-bold text-[#AD46FF] mb-4">
            {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Timeline
          </h2>

          <div className="space-y-4">
            {resources.map((resource, index) => {
              const isUnlocked = isResourceUnlocked(resource);
              const isCompleted = completedResources[resource.id] === true;

              return (
                <div key={resource.id} className="relative">
                  {/* Timeline line */}
                  {index < resources.length - 1 && (
                    <div
                      className={`absolute top-11 left-6 h-full w-0.5 ${isCompleted ? "bg-[#AD46FF]" : "bg-gray-600"}`}
                    ></div>
                  )}

                  <div
                    className={`flex items-start p-2 rounded-lg cursor-pointer transition-all
                      ${activeResource?.id === resource.id ? "bg-[#0D1324] border border-[#AD46FF]" : ""}
                      ${!isUnlocked ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0D1324]"}`}
                    onClick={() => {
                      if (isUnlocked) {
                        setActiveResource(resource);
                      }
                    }}
                  >
                    {/* Timeline dot */}
                    <div className="mt-1 mr-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-[#AD46FF] text-white"
                            : isUnlocked
                              ? "bg-[#1E293B] border-2 border-[#AD46FF] text-[#AD46FF]"
                              : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {isCompleted ? "✓" : isUnlocked ? index + 1 : "🔒"}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className={`font-medium ${isUnlocked ? "text-white" : "text-gray-500"}`}>{resource.title}</h3>
                      <p className="text-gray-400 text-sm">{resource.estimatedTime}</p>

                      {!isUnlocked && (
                        <div className="mt-1 text-xs text-yellow-400">
                          Complete previous resource to unlock
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

          {/* Resource content */}
          <div className="md:col-span-2">
            {activeResource ? (
              <div className="bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{getIcon()}</span>
                  <h2 className="text-xl font-bold text-white">{activeResource.title}</h2>
                </div>

                <p className="text-gray-300 mb-6">{activeResource.description}</p>

                <div className="mb-6">
                  <h3 className="text-[#AD46FF] font-medium mb-2">Estimated Time</h3>
                  <p className="text-white">{activeResource.estimatedTime}</p>
                </div>

                {renderResourceContent(activeResource)}

                <div className="flex justify-between items-center mt-8">
                  <a
                    href={activeResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#AD46FF] hover:underline"
                  >
                    Open in New Tab
                  </a>

                  {/* Allow marking as completed even if previous resources aren't completed */}
                  {!completedResources[activeResource.id] && (
                    <button
                      onClick={() => markAsCompleted(activeResource.id)}
                      className="bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {completedResources[activeResource.id] && (
                    <span className="text-green-500 font-medium">✓ Completed</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30 flex flex-col items-center justify-center h-full">
                <span className="text-5xl mb-4">{getIcon()}</span>
                <h2 className="text-xl font-bold text-white mb-2">No Resources Available</h2>
                <p className="text-gray-300 text-center">There are no resources available for this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceTimeline