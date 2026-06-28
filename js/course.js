// js/course.js - Learning Hub interactions
document.addEventListener('DOMContentLoaded', () => {
  const courseCards = document.querySelectorAll('.tool-action-card');

  // Hardcoded secure file mapping matrix for courses
  const courseNavigationMap = {
    'intro': 'courses/course-1.html',
    'attacks': 'courses/course-2.html',
    'phishing': 'courses/course-3.html',
    'password': 'courses/course-4.html',
    'encryption': 'courses/course-5.html',
    'browsing': 'courses/course-6.html',
    'qrscams': 'courses/course-7.html',
    'webbasics': 'courses/course-8.html',
    'social': 'courses/course-9.html',
    'quiz': 'courses/quiz.html'
  };

  courseCards.forEach(card => {
    // Make entire card interactive and clickable
    card.addEventListener('click', () => {
      const courseId = card.getAttribute('data-course-id');
      
      if (courseId && courseNavigationMap[courseId]) {
        console.log(`[RBEH Multiverse] Navigating to course pathway: ${courseNavigationMap[courseId]}`);
        
        // Immediate redirection without any popups, alerts, or dialog messages
        window.location.href = courseNavigationMap[courseId];
      }
    });
  });
});