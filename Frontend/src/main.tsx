import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Custom cursor component
function CustomCursor() {
  const cursor = document.createElement('div')
  cursor.className = 'cursor'
  document.body.appendChild(cursor)

  const trails: HTMLElement[] = []
  const trailLength = 5

  // Create trail elements
  for (let i = 0; i < trailLength; i++) {
    const trail = document.createElement('div')
    trail.className = 'cursor-trail'
    trail.style.opacity = (1 - i / trailLength).toString()
    document.body.appendChild(trail)
    trails.push(trail)
  }

  let mouseX = 0
  let mouseY = 0
  let cursorX = 0
  let cursorY = 0

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  // Animate cursor
  function animateCursor() {
    const speed = 0.15
    cursorX += (mouseX - cursorX) * speed
    cursorY += (mouseY - cursorY) * speed

    cursor.style.left = cursorX - 10 + 'px'
    cursor.style.top = cursorY - 10 + 'px'

    // Animate trails
    trails.forEach((trail, index) => {
      const delay = index * 2
      setTimeout(() => {
        trail.style.left = cursorX - 4 + 'px'
        trail.style.top = cursorY - 4 + 'px'
      }, delay)
    })

    requestAnimationFrame(animateCursor)
  }

  animateCursor()

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0'
    trails.forEach(trail => trail.style.opacity = '0')
  })

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1'
    trails.forEach((trail, index) => {
      trail.style.opacity = (1 - index / trailLength).toString()
    })
  })
}

// Initialize custom cursor
document.addEventListener('DOMContentLoaded', CustomCursor)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)