import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const VIDEOS = [
  { id: 'video1', src: '/videos/video1.mp4', title: 'We_Prosper Studio', desc: 'Creative production at its finest ✨' },
  { id: 'video2', src: '/videos/video2.mp4', title: 'Behind The Scenes', desc: 'How we build digital experiences 🎬' },
  { id: 'video3', src: '/videos/video3.mp4', title: 'Our Vision', desc: "Africa's next generation of creators 🌍" },
  { id: 'video4', src: '/videos/video4.mp4', title: 'The Process', desc: 'From idea to reality 🚀' },
]

const EMOJIS = [
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
  { type: 'mindblown', emoji: '🤯', label: 'Wow' },
  { type: 'clap', emoji: '👏', label: 'Clap' },
]

function HomeButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="https://landingwebsite-eight.vercel.app/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed', top: '24px', left: '24px', zIndex: 9999,
        height: '48px', borderRadius: '28px',
        background: 'rgba(139, 92, 246, 0.15)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center',
        textDecoration: 'none', fontSize: '20px',
        boxShadow: hovered ? '0 0 40px rgba(139,92,246,0.6)' : '0 0 20px rgba(139,92,246,0.3)',
        cursor: 'pointer', transition: 'all 0.3s ease',
        padding: '0 14px', gap: '8px',
        width: hovered ? 'auto' : '48px',
        overflow: 'hidden', whiteSpace: 'nowrap',
      }}
    >
      <span>🏠</span>
      <span style={{
        color: 'rgba(167, 139, 250, 0.95)', fontSize: '11px',
        fontWeight: '600', letterSpacing: '0.05em',
        maxWidth: hovered ? '140px' : '0px',
        opacity: hovered ? 1 : 0,
        transition: 'all 0.3s ease', overflow: 'hidden',
      }}>
        Back to Landing Page
      </span>
    </a>
  )
}

function VideoCard({ video, isActive }) {
  const videoRef = useRef(null)
  const [reactions, setReactions] = useState({})
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [username, setUsername] = useState('')
  const [muted, setMuted] = useState(true)
  const [floatingEmoji, setFloatingEmoji] = useState(null)

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {})
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isActive])

  useEffect(() => {
    fetchReactions()
    fetchComments()
  }, [])

  const fetchReactions = async () => {
    const { data } = await supabase
      .from('video_reactions')
      .select('emoji')
      .eq('video_id', video.id)
    if (data) {
      const counts = {}
      data.forEach(r => { counts[r.emoji] = (counts[r.emoji] || 0) + 1 })
      setReactions(counts)
    }
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('video_comments')
      .select('*')
      .eq('video_id', video.id)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setComments(data)
  }

  const handleReaction = async (emojiType) => {
    await supabase.from('video_reactions').insert({ video_id: video.id, emoji: emojiType })
    setFloatingEmoji(EMOJIS.find(e => e.type === emojiType)?.emoji)
    setTimeout(() => setFloatingEmoji(null), 1000)
    fetchReactions()
  }

  const handleComment = async () => {
    if (!newComment.trim()) return
    const name = username.trim() || 'Anonymous'
    await supabase.from('video_comments').insert({
      video_id: video.id, username: name, comment: newComment.trim(),
    })
    setNewComment('')
    fetchComments()
  }

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0a0015', overflow: 'hidden' }}>

      <video
        ref={videoRef}
        src={video.src}
        loop muted={muted} playsInline
        onClick={() => setMuted(!muted)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: 'linear-gradient(to top, rgba(10,0,21,0.95) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '20%',
        background: 'linear-gradient(to bottom, rgba(10,0,21,0.6) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '48px', opacity: muted ? 0.6 : 0,
        transition: 'opacity 0.3s', pointerEvents: 'none',
      }}>🔇</div>

      <div style={{ position: 'absolute', bottom: '100px', left: '16px', right: '80px', color: 'white' }}>
        <div style={{
          display: 'inline-block', background: 'rgba(139,92,246,0.3)',
          border: '1px solid rgba(139,92,246,0.5)', borderRadius: '20px',
          padding: '3px 10px', fontSize: '10px', fontWeight: '700',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#c4b5fd', marginBottom: '8px',
        }}>We_Prosper Studio</div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          {video.title}
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{video.desc}</p>
        <p style={{ fontSize: '11px', color: 'rgba(167,139,250,0.7)', marginTop: '6px' }}>
          👆 Tap video to {muted ? 'unmute' : 'mute'}
        </p>
      </div>

      <div style={{
        position: 'absolute', bottom: '100px', right: '12px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
      }}>
        {EMOJIS.map(e => (
          <button key={e.type} onClick={() => handleReaction(e.type)} style={{
            background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '50%', width: '48px', height: '48px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)',
          }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{e.emoji}</span>
            <span style={{ fontSize: '9px', color: 'rgba(196,181,253,0.8)', marginTop: '2px' }}>
              {reactions[e.type] || 0}
            </span>
          </button>
        ))}

        <button onClick={() => setShowComments(!showComments)} style={{
          background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '50%', width: '48px', height: '48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '20px' }}>💬</span>
          <span style={{ fontSize: '9px', color: 'rgba(196,181,253,0.8)', marginTop: '2px' }}>{comments.length}</span>
        </button>

        <div style={{
          background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '50%', width: '48px', height: '48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span style={{ fontSize: '9px', color: 'rgba(196,181,253,0.8)', marginTop: '2px' }}>{totalReactions}</span>
        </div>
      </div>

      {floatingEmoji && (
        <div style={{
          position: 'absolute', bottom: '200px', right: '30px',
          fontSize: '40px', animation: 'fadeUp 1s ease forwards',
          pointerEvents: 'none',
        }}>{floatingEmoji}</div>
      )}

      {/* COMMENTS PANEL — fixed layout, input always visible */}
      {showComments && (
  <div style={{
    position: 'fixed', bottom: 0, left: 0, right: 0,
    height: '70vh',
    background: 'rgba(10,0,21,0.98)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '24px 24px 0 0',
    display: 'flex', flexDirection: 'column',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
    zIndex: 999,
  }}>

    {/* Header */}
    <div style={{
      flexShrink: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 16px',
      borderBottom: '1px solid rgba(139,92,246,0.15)',
    }}>
      <h4 style={{ color: '#c4b5fd', fontSize: '14px', fontWeight: '700' }}>
        💬 Comments ({comments.length})
      </h4>
      <button onClick={() => setShowComments(false)} style={{
        background: 'none', border: 'none',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '22px', cursor: 'pointer', lineHeight: 1,
      }}>×</button>
    </div>

    {/* Input — TOP, always visible first */}
    <div style={{
      flexShrink: 0,
      padding: '10px 16px',
      borderBottom: '1px solid rgba(139,92,246,0.15)',
      background: 'rgba(10,0,21,0.99)',
      display: 'flex', gap: '6px', alignItems: 'center',
    }}>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Name"
        style={{
          width: '75px', flexShrink: 0,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '10px', padding: '10px 8px',
          color: 'white', fontSize: '12px', outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <input
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleComment()}
        placeholder="Write a comment..."
        style={{
          flex: 1,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '10px', padding: '10px 8px',
          color: 'white', fontSize: '13px', outline: 'none',
        }}
      />
      <button onClick={handleComment} style={{
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        border: 'none', borderRadius: '10px',
        padding: '10px 12px', color: 'white',
        fontSize: '13px', fontWeight: '700',
        cursor: 'pointer', flexShrink: 0,
      }}>Post</button>
    </div>

    {/* Scrollable comments BELOW input */}
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: '12px 16px',
      display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      {comments.length === 0 && (
        <p style={{
          color: 'rgba(255,255,255,0.3)', fontSize: '13px',
          textAlign: 'center', marginTop: '20px',
        }}>
          No comments yet. Be the first! 🌟
        </p>
      )}
      {comments.map(c => (
        <div key={c.id} style={{
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: '12px', padding: '10px 12px', flexShrink: 0,
        }}>
          <p style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>
            @{c.username}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.4 }}>
            {c.comment}
          </p>
        </div>
      ))}
    </div>
  </div>
      )}
    </div>
  )
}


export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)
  const touchStartY = useRef(null)
  const isScrolling = useRef(false)

  const goTo = (index) => {
    if (index < 0 || index >= VIDEOS.length) return
    setCurrentIndex(index)
  }

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (isScrolling.current) return
      isScrolling.current = true
      if (e.deltaY > 0) goTo(currentIndex + 1)
      else goTo(currentIndex - 1)
      setTimeout(() => { isScrolling.current = false }, 800)
    }
    const el = containerRef.current
    el?.addEventListener('wheel', handleWheel, { passive: false })
    return () => el?.removeEventListener('wheel', handleWheel)
  }, [currentIndex])

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (!touchStartY.current) return
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1)
      else goTo(currentIndex - 1)
    }
    touchStartY.current = null
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100vw', height: '100vh', overflow: 'hidden',
        background: '#0a0015', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <HomeButton />

      <div style={{
        position: 'fixed', top: '20px', left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(167,139,250,0.6)', fontSize: '11px',
        fontWeight: '700', letterSpacing: '0.2em',
        textTransform: 'uppercase', zIndex: 100,
        textShadow: '0 0 20px rgba(139,92,246,0.5)',
        whiteSpace: 'nowrap',
      }}>
        We_Prosper Studio
      </div>

      <div style={{
        position: 'relative', width: '100%',
        maxWidth: '420px', height: '100vh', overflow: 'hidden',
      }}>
        {VIDEOS.map((video, index) => (
          <div key={video.id} style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <VideoCard video={video} isActive={index === currentIndex} />
          </div>
        ))}
      </div>

      <div style={{
        position: 'fixed', right: '6px', top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 100,
      }}>
        {VIDEOS.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{
            width: i === currentIndex ? '4px' : '3px',
            height: i === currentIndex ? '24px' : '8px',
            borderRadius: '4px',
            background: i === currentIndex ? '#7c3aed' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease', cursor: 'pointer',
            boxShadow: i === currentIndex ? '0 0 8px rgba(124,58,237,0.8)' : 'none',
          }} />
        ))}
      </div>
    </div>
  )
}