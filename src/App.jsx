import { useState, useEffect } from 'react'
import './App.css'

const penguinOrder = ['baz', 'shelley', 'emma', 'chad', 'cody']

function App() {
  const [isNightMode, setIsNightMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1) // Start at -1 to show main.png first
  const [showResults, setShowResults] = useState(false)
  const [swipeStats, setSwipeStats] = useState({})
  const [touchStart, setTouchStart] = useState(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const [flyDirection, setFlyDirection] = useState('')
  const [showHeart, setShowHeart] = useState(false)
  const [heartScale, setHeartScale] = useState(0)
  const [heartOpacity, setHeartOpacity] = useState(0)
  const [showCross, setShowCross] = useState(false)
  const [crossScale, setCrossScale] = useState(0)
  const [crossOpacity, setCrossOpacity] = useState(0)

  useEffect(() => {
    const savedStats = localStorage.getItem('penguinSwipeStats')
    if (savedStats) {
      setSwipeStats(JSON.parse(savedStats))
    } else {
      const initialStats = penguinOrder.reduce((acc, name) => {
        acc[name] = 0
        return acc
      }, {})
      setSwipeStats(initialStats)
    }
  }, [])

  // Check if it's night time (11pm - 10am)
  useEffect(() => {
    const checkNightMode = () => {
      const now = new Date()
      const hour = now.getHours()
      // Night mode from 11pm (23:00) to 10am (10:00)
      const isNight = hour >= 23 || hour < 10
      setIsNightMode(isNight)
    }

    // Check immediately
    checkNightMode()

    // Check every minute
    const interval = setInterval(checkNightMode, 60000)

    return () => clearInterval(interval)
  }, [])

  const saveStats = (newStats) => {
    setSwipeStats(newStats)
    localStorage.setItem('penguinSwipeStats', JSON.stringify(newStats))
  }

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile)
    audio.volume = 0.5
    audio.play().catch(console.error)
  }

  const handleSwipe = (direction) => {
    if (currentIndex === -1) {
      setCurrentIndex(0)
      return
    }

    if (direction === 'right') {
      const currentPenguin = penguinOrder[currentIndex]
      const newStats = {
        ...swipeStats,
        [currentPenguin]: swipeStats[currentPenguin] + 1
      }
      saveStats(newStats)
      playSound('./like.mp3')
    } else if (direction === 'left') {
      playSound('./dislike.mp3')
    }

    if (currentIndex >= penguinOrder.length - 1) {
      setShowResults(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!touchStart || !isDragging) return

    const currentTouch = e.touches[0].clientX
    const diff = currentTouch - touchStart
    
    // On main screen (index -1), only allow right swipes
    if (currentIndex === -1 && diff < 0) {
      // Restrict left swipe on main screen - allow minimal movement for feedback
      setDragOffset(Math.max(diff * 0.1, -50))
    } else {
      setDragOffset(diff)
    }
    
    // Show heart animation for right swipes (likes)
    if (diff > 0 && currentIndex >= 0) { // Only on penguin screens, not main screen
      const threshold = window.innerWidth * 0.3
      const progress = Math.min(Math.abs(diff) / threshold, 1) // 0 to 1
      
      setShowHeart(true)
      setHeartScale(progress * 0.8) // Scale up to 0.8 during drag
      setHeartOpacity(progress * 0.8) // Fade in during drag
      
      // Hide cross if showing
      setShowCross(false)
      setCrossScale(0)
      setCrossOpacity(0)
    } 
    // Show cross animation for left swipes (dislikes) - but not on main screen
    else if (diff < 0 && currentIndex >= 0) { // Only on penguin screens, not main screen
      const threshold = window.innerWidth * 0.3
      const progress = Math.min(Math.abs(diff) / threshold, 1) // 0 to 1
      
      setShowCross(true)
      setCrossScale(progress * 0.8) // Scale up to 0.8 during drag
      setCrossOpacity(progress * 0.8) // Fade in during drag
      
      // Hide heart if showing
      setShowHeart(false)
      setHeartScale(0)
      setHeartOpacity(0)
    } else {
      // Hide both animations
      setShowHeart(false)
      setHeartScale(0)
      setHeartOpacity(0)
      setShowCross(false)
      setCrossScale(0)
      setCrossOpacity(0)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const threshold = window.innerWidth * 0.3 // 30% of screen width

    if (Math.abs(dragOffset) > threshold) {
      const direction = dragOffset > 0 ? 'right' : 'left'
      
      // On main screen, only allow right swipes
      if (currentIndex === -1 && direction === 'left') {
        // Reset drag state - don't allow left swipe on main screen
        setDragOffset(0)
        setIsDragging(false)
        setTouchStart(null)
        return
      }
      
      // If it's a right swipe (like), trigger heart animation
      if (direction === 'right' && currentIndex >= 0) {
        setHeartScale(1)
        setHeartOpacity(1)
        
        // After 0.3s, start the fade out and scale up further
        setTimeout(() => {
          setHeartScale(5)
          setHeartOpacity(0)
          
          // Hide heart after fade out completes
          setTimeout(() => {
            setShowHeart(false)
            setHeartScale(0)
          }, 300)
        }, 300)
      }
      // If it's a left swipe (dislike), trigger cross animation
      else if (direction === 'left' && currentIndex >= 0) {
        setCrossScale(1)
        setCrossOpacity(1)
        
        // After 0.3s, start the fade out and scale up further
        setTimeout(() => {
          setCrossScale(5)
          setCrossOpacity(0)
          
          // Hide cross after fade out completes
          setTimeout(() => {
            setShowCross(false)
            setCrossScale(0)
          }, 300)
        }, 300)
      }
      
      // Start fly-off animation
      setIsFlying(true)
      setFlyDirection(direction)
      setIsDragging(false)
      
      // After animation completes, handle the swipe
      setTimeout(() => {
        handleSwipe(direction)
        setIsFlying(false)
        setFlyDirection('')
        setDragOffset(0)
        setTouchStart(null)
      }, 300)
    } else {
      // Reset drag state and animations if threshold not met
      setDragOffset(0)
      setIsDragging(false)
      setTouchStart(null)
      setShowHeart(false)
      setHeartScale(0)
      setHeartOpacity(0)
      setShowCross(false)
      setCrossScale(0)
      setCrossOpacity(0)
    }
  }

  const resetApp = () => {
    setCurrentIndex(-1)
    setShowResults(false)
  }

  if (showResults) {
    const sortedPenguins = Object.entries(swipeStats)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }))

    return (
      <div className="app results-page">
        <div className="flippr-header">
          <div className="flippr-logo">🐧 flippr</div>
        </div>
        
        <div className="results-content">
          <div className="message">
            You've run out of potential<br />
            matches in your area.<br />
            Penguins are pretty loyal!
          </div>
          
          <div className="popular-title">
            Here's the most popular<br />
            penguins in the last 12 months
          </div>
          
          <div className="penguin-stats">
            {sortedPenguins.map((penguin, index) => (
              <div key={penguin.name} className="penguin-stat">
                <span className="penguin-name">{penguin.name.charAt(0).toUpperCase() + penguin.name.slice(1)}</span>
                <img src="./heart.svg" alt="heart" className="heart-icon" />
                <span className="penguin-count">{penguin.count}</span>
              </div>
            ))}
          </div>
          
          <button className="start-over-btn" onClick={resetApp}>
            Start over
          </button>
        </div>
      </div>
    )
  }


  const getCardStack = () => {
    const cards = []
    const maxCards = 3 // Show up to 3 cards in stack
    
    for (let i = 0; i < maxCards; i++) {
      const cardIndex = currentIndex + i
      let imageSrc, name
      
      if (cardIndex === -1) {
        imageSrc = './images/main.png'
        name = 'Main'
      } else if (cardIndex < penguinOrder.length) {
        imageSrc = `./images/${penguinOrder[cardIndex]}.png`
        name = penguinOrder[cardIndex].charAt(0).toUpperCase() + penguinOrder[cardIndex].slice(1)
      } else {
        break // No more cards to show
      }
      
      cards.push({
        imageSrc,
        name,
        index: cardIndex,
        stackPosition: i
      })
    }
    
    return cards
  }

  // Night mode screen (11pm - 10am)
  if (isNightMode) {
    return <div className="night-mode-screen"></div>
  }

  return (
    <div className="app">
      {/* <div className="flippr-header">
        <div className="flippr-logo">🐧 flippr</div>
      </div> */}
      
      <div className="card-container">
        {getCardStack().map((card, index) => (
          <div 
            key={`${card.index}-${index}`}
            className={`penguin-card ${index === 0 ? 'top-card' : ''}`}
            style={{
              transform: index === 0 && isFlying 
                ? `translateX(${flyDirection === 'right' ? '100vw' : '-100vw'})` 
                : index === 0 
                ? `translateX(${dragOffset}px)` 
                : 'none',
              transition: index === 0 && isDragging 
                ? 'none' 
                : index === 0 && isFlying 
                ? 'transform 0.3s ease-out'
                : 'transform 0.3s ease',
              zIndex: 10 - index
            }}
            onTouchStart={index === 0 ? handleTouchStart : undefined}
            onTouchMove={index === 0 ? handleTouchMove : undefined}
            onTouchEnd={index === 0 ? handleTouchEnd : undefined}
          >
            <img 
              src={card.imageSrc} 
              alt={card.name} 
              className="penguin-image"
            />
          </div>
        ))}
        
        {showHeart && (
          <div 
            className="heart-animation"
            style={{
              transform: `scale(${heartScale})`,
              opacity: heartOpacity,
              transition: isDragging ? 'none' : 'all 0.3s ease-out'
            }}
          >
            <img src="./heart.svg" alt="love" className="love-heart" />
          </div>
        )}
        
        {showCross && (
          <div 
            className="cross-animation"
            style={{
              transform: `scale(${crossScale})`,
              opacity: crossOpacity,
              transition: isDragging ? 'none' : 'all 0.3s ease-out'
            }}
          >
            <div className="cross-icon">
              <div className="cross-line"></div>
              <div className="cross-line"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
