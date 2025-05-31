# Uday Tharu's Portfolio Website

A modern, responsive portfolio website showcasing my work as a web developer and designer. Built with HTML, CSS, and JavaScript, featuring smooth animations, interactive elements, and a clean design.

## 🌟 Features

- **Responsive Design**: Fully responsive layout that works seamlessly across all devices
- **Modern UI/UX**: Clean and professional design with smooth animations
- **Interactive Elements**:
  - Animated typing effect for role descriptions
  - Interactive project cards with flip animation
  - Smooth scrolling navigation
  - Dynamic skill cards with spotlight effect
  - Contact form with real-time validation
  - Scroll progress indicator
  - Floating "Go to Top" button with animation
  - Background shapes animation
  - Confetti effect on form submission

## 🛠️ Technologies Used

- **Frontend**:
  - HTML5
  - CSS3 (with Tailwind CSS)
  - JavaScript (ES6+)
  - Font Awesome Icons
  - AOS (Animate On Scroll) Library
  - EmailJS for contact form
  - Canvas Confetti for celebration effects

## 📁 Project Structure

```
portfolio/
├── assets/
│   ├── images/     # All image assets
│   └── icons/      # Icon assets
├── css/            # Stylesheets
│   └── style.css   # Main stylesheet
├── js/             # JavaScript files
│   └── script.js   # Main script file
├── docs/           # Documentation
│   ├── README.md   # This file
│   └── cv.pdf      # Resume/CV
└── index.html      # Main HTML file
```

## 🚀 Key Features Implementation

### 1. Typing Animation
- Dynamic typing effect for role descriptions
- Configurable typing speed and phrases
- Smooth transitions between phrases

### 2. Project Showcase
- Interactive project cards with flip animation
- Responsive grid layout
- Project details with links to live demos and GitHub repositories

### 3. Contact Form
- Real-time form validation
- EmailJS integration for form submission
- Success/error notifications
- Confetti effect on successful submission

### 4. Responsive Navigation
- Mobile-friendly hamburger menu
- Smooth scrolling to sections
- Active section highlighting
- Sticky navigation with blur effect

### 5. Performance Optimizations
- Lazy loading for images
- Deferred loading of non-critical scripts
- Optimized animations for better performance
- Critical CSS inlined for faster initial render

## 🎨 Design Features

- Clean and modern design
- Consistent color scheme
- Smooth transitions and animations
- Interactive elements with hover effects
- Professional typography
- Optimized for readability
- Accessible design elements

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/udaytharu/portfolio.git
   ```

2. Navigate to the project directory:
   ```bash
   cd portfolio
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

## 📝 Customization

### Updating Content
- Edit `index.html` to modify text content
- Update project details in the projects section
- Modify skills and percentages in the skills section
- Update social media links in the contact section

### Styling
- Main styles are in `css/style.css`
- Tailwind CSS classes are used for utility styling
- Custom animations and effects are defined in the CSS

### JavaScript
- Main functionality is in `js/script.js`
- Typing animation configuration can be modified in the config object
- Form handling and validation can be customized
- Animation timings and effects can be adjusted

## 📧 Contact Form Setup

1. Sign up for EmailJS (https://www.emailjs.com/)
2. Create an email service and template
3. Update the EmailJS configuration in `script.js`:
   ```javascript
   emailjs.init('YOUR_USER_ID');
   ```

## 🔒 Security

- EmailJS User ID is exposed but this is normal for client-side email services
- Form validation is implemented both client-side and server-side
- No sensitive data is stored or processed

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Uday Tharu**
- LinkedIn: [Uday Tharu](https://www.linkedin.com/in/uday-tharu-25b9042ba/)
- GitHub: [@udaytharu](https://github.com/udaytharu)
- Email: udaytharu813@gmail.com

## 🙏 Acknowledgments

- Font Awesome for icons
- Tailwind CSS for utility classes
- AOS library for scroll animations
- EmailJS for form handling
- Canvas Confetti for celebration effects
