// Skills data
const skills = [
    { name: 'HTML/CSS', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 80 },
    { name: 'Node.js', level: 75 },
    { name: 'Python', level: 70 }
];

// Add skills to the page
function renderSkills() {
    const skillsContainer = document.querySelector('.skills');
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill';
        skillElement.innerHTML = `
            <div class="skill-name">${skill.name}</div>
            <div class="skill-bar">
                <div class="skill-level" style="width: ${skill.level}%"></div>
            </div>
        `;
        skillsContainer.appendChild(skillElement);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderSkills();
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Certificate display
const certificateButtons = document.querySelectorAll('.certificate-card .btn');
const certificateModal = document.createElement('div');
certificateModal.className = 'certificate-modal';
const modalImage = document.createElement('img');
modalImage.className = 'modal-image';
certificateModal.appendChild(modalImage);
document.body.appendChild(certificateModal);

certificateButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const certificateCard = button.closest('.certificate-card');
        const certificateImg = certificateCard.querySelector('.certificate-img');
        modalImage.src = certificateImg.src;
        certificateModal.style.display = 'flex';
    });
});

certificateModal.addEventListener('click', () => {
    certificateModal.style.display = 'none';
});

// Contact Form
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Message sent successfully!');
    contactForm.reset();
});

// Smooth scrolling for sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Section visibility animation
const sections = document.querySelectorAll('.section');
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Scroll progress bar
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
const scrollBar = document.createElement('div');
scrollBar.className = 'scroll-progress-bar';
scrollProgress.appendChild(scrollBar);
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalScroll) * 100;
    scrollBar.style.width = `${progress}%`;
});

// Loading animation
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        } else {
            entry.target.classList.remove('animate');
        }
    });
});

document.querySelectorAll('.project-card, .animated-text').forEach(el => {
    observer.observe(el);
});

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    
    gsap.to(cursorFollower, {
        x: e.clientX - 15,
        y: e.clientY - 15,
        duration: 0.3
    });
});

// Hover effects
document.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursorFollower.style.transform = 'scale(2)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Scroll animations
gsap.registerPlugin(ScrollTrigger);

gsap.from('.about-content', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
    },
    y: 100,
    opacity: 0
});

// Project cards animation
projectCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'center center',
            scrub: 1
        },
        y: 100,
        opacity: 0,
        delay: index * 0.2
    });
});
