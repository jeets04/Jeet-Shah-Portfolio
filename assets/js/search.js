// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('query');
    const searchForm = document.getElementById('searchForm');
    
    // Define searchable content
    const searchableContent = {
        projects: [
            {
                title: 'PPE Violation Detection',
                description: 'AI-powered safety monitoring system for construction sites',
                link: 'project/ppe-detection.html'
            },
            {
                title: 'AcademIQ',
                description: 'Next-gen Learning Management System',
                link: 'project/academiq.html'
            },
            {
                title: 'DropX',
                description: 'Seamless delivery management system',
                link: 'project/dropx.html'
            },
            {
                title: 'CollabText',
                description: 'Real-time document collaboration platform',
                link: 'project/collab-text.html'
            },
            {
                title: 'GatherEase',
                description: 'Smart event planning solution',
                link: 'project/gather-ease.html'
            },
            {
                title: 'Chatify',
                description: 'Real-time voice and text communication platform',
                link: 'project/chatify.html'
            }
        ],
        technologies: [
            {
                title: 'Java',
                description: 'Developing scalable and secure backend applications'
            },
            {
                title: 'React',
                description: 'Building dynamic, responsive web applications'
            },
            {
                title: 'AWS',
                description: 'Deploying scalable cloud solutions efficiently'
            },
            {
                title: 'Docker',
                description: 'Containerizing applications for portability'
            }
        ],
        achievements: [
            {
                title: 'AI Hackathon Winner – IIM Ahmedabad',
                description: 'Won first place in AI Hackathon with PPE Detection project',
                link: '#modal1'
            },
            {
                title: 'Advanced DevOps Training Certificate',
                description: 'Completed comprehensive training in Git, GitHub, Docker, and AWS',
                link: '#modal1'   
            }
        ]
    };

    // Create search results container
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.id = 'searchResults';
    searchResultsContainer.style.display = 'none';
    searchResultsContainer.style.position = 'absolute';
    searchResultsContainer.style.top = '100%';
    searchResultsContainer.style.left = '0';
    searchResultsContainer.style.right = '0';
    searchResultsContainer.style.backgroundColor = '#ffffff';
    searchResultsContainer.style.border = '1px solid #ddd';
    searchResultsContainer.style.borderRadius = '4px';
    searchResultsContainer.style.maxHeight = '400px';
    searchResultsContainer.style.overflowY = 'auto';
    searchResultsContainer.style.zIndex = '1000';
    searchResultsContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    searchForm.appendChild(searchResultsContainer);

    // Search function
    function performSearch(query) {
        const results = [];
        query = query.toLowerCase();

        // Search in projects
        searchableContent.projects.forEach(project => {
            if (project.title.toLowerCase().includes(query) || 
                project.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'Project',
                    ...project
                });
            }
        });

        // Search in technologies
        searchableContent.technologies.forEach(tech => {
            if (tech.title.toLowerCase().includes(query) || 
                tech.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'Technology',
                    ...tech
                });
            }
        });

        // Search in achievements
        searchableContent.achievements.forEach(achievement => {
            if (achievement.title.toLowerCase().includes(query) || 
                achievement.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'Achievement',
                    ...achievement
                });
            }
        });

        return results;
    }

    // Display search results
    function displayResults(results) {
        searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<div style="padding: 10px;">No results found</div>';
            searchResultsContainer.style.display = 'block';
            return;
        }

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.style.padding = '10px';
            resultElement.style.borderBottom = '1px solid #eee';
            resultElement.style.cursor = 'pointer';
            
            resultElement.innerHTML = `
                <div style="font-weight: bold; color: #f56a6a;">${result.type}</div>
                <div style="font-weight: bold;">${result.title}</div>
                <div style="font-size: 0.9em; color: #666;">${result.description}</div>
            `;

            resultElement.addEventListener('click', () => {
                if (result.link) {
                    if (result.link.startsWith('#')) {
                        // Handle modal links
                        const modal = document.querySelector(result.link);
                        if (modal) {
                            modal.style.display = 'block';
                            searchResultsContainer.style.display = 'none';
                        }
                    } else {
                        // Handle regular links
                        window.location.href = result.link;
                    }
                }
            });

            resultElement.addEventListener('mouseover', () => {
                resultElement.style.backgroundColor = '#f5f5f5';
            });

            resultElement.addEventListener('mouseout', () => {
                resultElement.style.backgroundColor = '#ffffff';
            });

            searchResultsContainer.appendChild(resultElement);
        });

        searchResultsContainer.style.display = 'block';
    }

    // Event listeners
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            const results = performSearch(query);
            displayResults(results);
        } else {
            searchResultsContainer.style.display = 'none';
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
});