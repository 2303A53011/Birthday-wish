import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Sparkles, Star } from 'lucide-react';

// Types
interface VoiceMessage {
  id: number;
  name: string;
  photo: string;
  audioUrl: string;
}

interface Chapter {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

// Sparkle component for animated sparkles
const SparkleAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            scale: 0,
            opacity: 0,
          }}
          animate={{
            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600)],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
        >
          <Sparkles className="text-yellow-300" size={16 + Math.random() * 8} />
        </motion.div>
      ))}
    </div>
  );
};

// Waveform animation component
const WaveformAnimation = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-center space-x-1 h-8">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-pink-500 to-yellow-400 rounded-full"
          animate={isPlaying ? {
            height: [8, 24, 12, 32, 16, 28, 8],
          } : { height: 8 }}
          transition={{
            duration: 1.5,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Confetti component
const ConfettiAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB'][i % 5],
            left: Math.random() * 100 + '%',
          }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 10,
            rotate: 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<number | null>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});


  // Sample data (to be replaced with real content)
  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Cherished Moments",
      description: "Snapshots of joy that make life special",
      imageUrl: "/images/chapters/IMG-20200604-WA0069.jpg"
    },
    {
      id: 2,
      title: "School Adventures",
      description: "Making memories every day",
      imageUrl: "/images/chapters/IMG-20200605-WA0004.jpg"
    },
    {
      id: 3,
      title: "Family Ties",
      description: "Where love and support always surround you.",
      imageUrl: "/images/chapters/WhatsApp Image 2025-08-27 at 22.19.04_aee5ab8d.jpg"
    },
    {
      id: 4,
      title: "Celebrations",
      description: "Every occasion brighter because of you.",
      imageUrl: "/images/chapters/WhatsApp Image 2025-08-27 at 22.19.05_28e9df4b.jpg"
    },
    {
      id: 5,
      title: "Adventures Together",
      description: "Memories written under open skies.",
      imageUrl: "/images/chapters/IMG-20200604-WA0066.jpg"
    },
    {
      id: 6,
      title: "Smiles & Laughter",
      description: "Happiness that shines in every picture.",
      imageUrl:"/images/chapters/WhatsApp Image 2025-08-27 at 22.46.58_de120d4d.jpg"
    },
    {
      id: 7,
      title: "Unforgettable Days",
      description: "Moments etched in our hearts forever",
      imageUrl:"/images/chapters/IMG_20250827_215441.jpg"
    },
    {
      id: 8,
      title: "With Loved Ones",
      description: "Because every journey is sweeter with company",
      imageUrl:"/images/chapters/WhatsApp Image 2025-08-27 at 23.16.59_d2b6883f.jpg"
    },
    {
      id: 9,
      title: "Joyful Steps",
      description: "Moving forward with courage and grace",
      imageUrl:"/images/chapters/WhatsApp Image 2025-08-27 at 22.19.05_41790c78.jpg"
    },
    {
      id: 10,
      title: "Beautiful You",
      description: "The heart, the soul, the light of our lives.",
      imageUrl:"/images/chapters/WhatsApp Image 2025-08-27 at 22.19.05_db72146f.jpg"
    },
    {
      id: 11,
      title: "The Journey Ahead",
      description: "Wishing you love, success, and endless happiness",
      imageUrl:"/images/chapters/WhatsApp Image 2025-08-27 at 23.19.22_751a8d5b.jpg"
    }
  ];

  const voiceMessages: VoiceMessage[] = [
    {
      id: 1,
      name: "Mom",
      photo: "/images/people/mom.jpg",
      audioUrl: "/voices/mom.mp3"
    },
    {
      id: 2,
      name: "Dad",
      photo: "/images/people/dad.jpg",
      audioUrl: "/voices/dad.mp3"
    },
    {
      id: 3,
      name: "Best Friend",
      photo: "/images/people/friend.jpg",
      audioUrl: "/voices/friend.mp3"
    }
  ];

  const handleVoicePlay = (messageId: number) => {
    // Stop any currently playing audio
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    if (playingVoice === messageId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(messageId);
      
      // Create and play audio if it doesn't exist
      if (!audioRefs.current[messageId]) {
        const audio = new Audio(voiceMessages.find(v => v.id === messageId)?.audioUrl);
        audio.addEventListener('ended', () => setPlayingVoice(null));
        audio.addEventListener('error', () => {
          console.log('Audio file not found, using demo mode');
          // Demo mode - auto stop after 5 seconds
          setTimeout(() => setPlayingVoice(null), 5000);
        });
        audioRefs.current[messageId] = audio;
      }
      
      // Try to play the audio
      audioRefs.current[messageId].play().catch(() => {
        console.log('Audio file not found, using demo mode');
        // Demo mode - auto stop after 5 seconds
        setTimeout(() => setPlayingVoice(null), 5000);
      });
    }
  };

  // Auto-play Fazal's message in climax section
  useEffect(() => {
    if (currentSection === 3) { // Climax section
      const fazalAudio = new Audio('/voices/fazal.mp3');
      fazalAudio.play().catch(() => {
        console.log('Fazal message audio not found');
      });
      
      return () => {
        fazalAudio.pause();
      };
    }
  }, [currentSection]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);
    
  const sections = [
    "landing",
    "chapters", 
    "voices",
    "climax"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const newSection = Math.floor(scrollY / windowHeight);
      setCurrentSection(Math.min(newSection, sections.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Landing Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <SparkleAnimation />
        
        <div className="text-center z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-yellow-300 mb-8"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
            }}
          >
            Happy 20th Birthday<br />
            <span className="text-yellow-300">Ammu</span> ✨
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="flex justify-center space-x-4"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              >
                <Star className="text-yellow-300" size={24} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-white text-sm animate-bounce">
            Scroll to explore ↓
          </div>
        </motion.div>
      </section>

      {/* Chapters Section */}
      <section className="min-h-screen py-20 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
        >
          Chapters of Your Story
        </motion.h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30, rotate: -5 + Math.random() * 10 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 + Math.random() * 4 }}
              whileHover={{ scale: 1.05, rotate: 0, z: 10 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group cursor-pointer flex flex-col h-full"
            >
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl flex flex-col h-full">
                <div className="flex-grow overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img
                    src={chapter.imageUrl}
                    alt={chapter.title}
                    className="w-full h-auto max-h-64 object-contain group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-64 flex items-center justify-center bg-gray-100"><div class="text-gray-500 text-center p-4"><div class="text-4xl mb-2">📸</div><div class="text-sm">Add ${chapter.title.toLowerCase()} photo</div></div></div>`;
                      }
                    }}
                  />
                </div>
                
                <div className="p-4 bg-gradient-to-br from-white to-gray-50">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{chapter.title}</h3>
                  <p className="text-gray-600 text-sm">{chapter.description}</p>
                </div>
                
                {/* Polaroid tape effect */}
                <div className="absolute top-4 left-4 w-16 h-6 bg-yellow-200 opacity-60 rotate-12 rounded-sm shadow-md"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Voices Section */}
      <section className="min-h-screen py-20 px-4 bg-gradient-to-br from-indigo-900 to-purple-900">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
        >
          Voices of Love
        </motion.h2>
        
        <div className="max-w-lg mx-auto space-y-6">
          {voiceMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={message.photo}
                    alt={message.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="text-gray-600 text-2xl">👤</div>`;
                      }
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-lg truncate">{message.name}</h3>
                  <p className="text-white/70 text-sm">Has a message for you</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <WaveformAnimation isPlaying={playingVoice === message.id} />
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVoicePlay(message.id)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {playingVoice === message.id ? <Pause size={20} /> : <Play size={20} />}
                </motion.button>
              </div>
              
              {playingVoice === message.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 text-white/80 text-sm italic"
                >
                  🎤 Playing voice message...
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Climax Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600">
        <ConfettiAnimation />
        
        <div className="text-center z-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-9xl md:text-[12rem] font-bold text-white mb-8"
            style={{
              textShadow: '0 0 50px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 215, 0, 0.6)',
              filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.9))'
            }}
          >
            20
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mx-4 max-w-md mx-auto border border-white/30"
          >
            <p className="text-white text-lg mb-4">🎤 A special message from Fazal</p>
            <div className="flex justify-center">
              <WaveformAnimation isPlaying={true} />
            </div>
            <p className="text-white/80 text-sm mt-2 italic">Auto-playing personal message...</p>
          </motion.div>
        </div>
        
        {/* Fireworks effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 50 + '%',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              <div className="w-2 h-2 bg-yellow-300 rounded-full">
                {[...Array(8)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="absolute w-1 h-8 bg-gradient-to-t from-yellow-300 to-transparent origin-bottom"
                    style={{
                      transform: `rotate(${j * 45}deg)`,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{
                      duration: 1,
                      delay: Math.random() * 2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-white">
            <span className="text-lg">Made with</span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="text-red-500 fill-current" size={24} />
            </motion.div>
            <span className="text-lg">by</span>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Fazal
            </span>
          </div>
          
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-4 text-white/60 text-sm"
          >
            ✨ A celebration of 20 amazing years ✨
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}

export default App;