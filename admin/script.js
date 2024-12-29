// DOM Elements
const heroForm = document.getElementById('hero-form');
const aboutForm = document.getElementById('about-form');
const projectsContainer = document.getElementById('projects-container');
const contactForm = document.getElementById('contact-form');
const addProjectBtn = document.getElementById('add-project');

let siteData = {
    hero: { title: '', subtitle: '' },
    about: { text: '', additional: '' },
    projects: [],
    contact: {
        email: '',
        linkedin: '',
        pinterest: '',
        instagram: '',
        telegram: ''
    }
};

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('/data.json');
        if (!response.ok) throw new Error('Failed to load data');
        siteData = await response.json();
        updateFormFields();
        showNotification('Data loaded successfully!');
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error loading data', 'error');
    }
}

// Save data to JSON file
async function saveData() {
    try {
        const response = await fetch('/admin/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(siteData)
        });

        if (!response.ok) throw new Error('Failed to save data');
        
        showNotification('Changes saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Error saving changes', 'error');
    }
}

// Update form fields with current data
function updateFormFields() {
    // Hero section
    document.getElementById('hero-title').value = siteData.hero.title;
    document.getElementById('hero-subtitle').value = siteData.hero.subtitle;

    // About section
    document.getElementById('about-text').value = siteData.about.text;
    document.getElementById('about-additional').value = siteData.about.additional;

    // Contact section
    document.getElementById('contact-email').value = siteData.contact.email;
    document.getElementById('contact-linkedin').value = siteData.contact.linkedin;
    document.getElementById('contact-pinterest').value = siteData.contact.pinterest;
    document.getElementById('contact-instagram').value = siteData.contact.instagram;
    document.getElementById('contact-telegram').value = siteData.contact.telegram;

    // Projects section
    renderProjects();
}

// Render projects
function renderProjects() {
    projectsContainer.innerHTML = '';
    siteData.projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        projectsContainer.appendChild(projectCard);
    });
}

// Create project card
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-header">
            <input type="text" placeholder="Project Title" value="${project.title || ''}" 
                onchange="updateProject(${index}, 'title', this.value)">
            <button onclick="deleteProject(${index})" class="delete-btn">Delete</button>
        </div>
        <div class="project-inputs">
            <textarea placeholder="Project Description" 
                onchange="updateProject(${index}, 'description', this.value)">${project.description || ''}</textarea>
            <input type="text" placeholder="Project Link" value="${project.link || ''}" 
                onchange="updateProject(${index}, 'link', this.value)">
            <input type="text" placeholder="Category" value="${project.category || ''}" 
                onchange="updateProject(${index}, 'category', this.value)">
            <input type="text" placeholder="Tags (comma-separated)" value="${(project.tags || []).join(', ')}" 
                onchange="updateProject(${index}, 'tags', this.value)">
            <div class="image-upload">
                <input type="file" accept="image/*" onchange="handleImageUpload(${index}, this)">
                ${project.image ? `<img src="${project.image}" alt="Project preview">` : ''}
            </div>
        </div>
    `;
    return card;
}

// Update project
function updateProject(index, field, value) {
    if (field === 'tags') {
        siteData.projects[index][field] = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else {
        siteData.projects[index][field] = value;
    }
}

// Add new project
function addProject() {
    siteData.projects.push({
        title: '',
        description: '',
        image: '',
        category: '',
        link: '',
        tags: []
    });
    renderProjects();
}

// Delete project
function deleteProject(index) {
    siteData.projects.splice(index, 1);
    renderProjects();
}

// Handle image upload
async function handleImageUpload(index, input) {
    const file = input.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/admin/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const data = await response.json();
            siteData.projects[index].image = data.url;
            renderProjects();
            showNotification('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            showNotification('Error uploading image', 'error');
        }
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
heroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    siteData.hero.title = document.getElementById('hero-title').value;
    siteData.hero.subtitle = document.getElementById('hero-subtitle').value;
    saveData();
});

aboutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    siteData.about.text = document.getElementById('about-text').value;
    siteData.about.additional = document.getElementById('about-additional').value;
    saveData();
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    siteData.contact.email = document.getElementById('contact-email').value;
    siteData.contact.linkedin = document.getElementById('contact-linkedin').value;
    siteData.contact.pinterest = document.getElementById('contact-pinterest').value;
    siteData.contact.instagram = document.getElementById('contact-instagram').value;
    siteData.contact.telegram = document.getElementById('contact-telegram').value;
    saveData();
});

addProjectBtn.addEventListener('click', addProject);

// Initialize
document.addEventListener('DOMContentLoaded', loadData);
