// TeamCarousel3D.jsx - CON ANIMACIÓN DE PORCENTAJES
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamCarousel3D.css';
import '../../css/apipage.css';
import AnimatedSkillBar from '../AnimatedSkillBar/AnimatedSkillBar'; // Importar el componente animado

const TeamCarousel3D = ({ 
  integrantes, 
  autoRotate = true, 
  interval = 10000
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rotate = (direction) => {
    setCurrentSlide(prev => {
      const newSlide = prev + direction;
      if (newSlide >= integrantes.length) return 0;
      if (newSlide < 0) return integrantes.length - 1;
      return newSlide;
    });
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!autoRotate) return;
    
    const timer = setInterval(() => {
      rotate(1);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, interval, integrantes.length]);

  const handleCardClick = (integranteNombre) => {
    navigate(`/integrantes/${integranteNombre.toLowerCase()}`);
  };

  const handleSocialClick = (e, url) => {
    e.stopPropagation();
    if (url && url !== "#") {
      window.open(url, '_blank');
    }
  };

   return (
    <div className="team-carousel-wrapper">
    <div className="team-carousel-3d-container">
      <div 
        className="team-carousel-3d" 
        style={!isMobile ? { transform: `rotateY(${currentSlide * -72}deg)` } : {}}
      >
        {integrantes.map((integrante, index) => (
          <div 
            key={index}
            className={`team-carousel-3d-item ${index === currentSlide ? 'active' : ''}`}
            style={!isMobile ? { '--rotation': index } : {}}
          >
            <div 
              className="card team-card h-100 weather-card"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(integrante.nombre)}
              style={{ 
                background: 'white',
                color: '#1F2937',
                overflow: 'hidden',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Contenedor de imagen - SEGURO */}
              <div 
                className="image-container" 
                style={{ 
                  padding: '0.5rem 1rem 0',
                  overflow: 'hidden',
                  flexShrink: 0,
                   display: 'flex',           // Para centrado
                    justifyContent: 'center',  // Centrado horizontal
                    alignItems: 'center',      // Centrado vertical
                    height: 'auto'           // Altura fija
                }}
              >
                <img
                  src={integrante.img}
                 
                  alt={integrante.nombre}
                  style={{ 
                    borderRadius: '50%',     // Circular
                    width: '100px',          // Tamaño fijo
                    height: '100px',         // Mismo que width para circular perfecto
                    objectFit: 'cover'
                  }}
                />
              </div>
              
              {/* Contenido */}
              <div 
                className="card-body text-center"
                
              >
                <div>
                  <h5 className="dev-name" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                    {integrante.nombre}
                  </h5>
                  <p className="dev-location" style={{ fontSize: '0.6rem', marginBottom: '0.5rem' }}>
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {integrante.ubicacion}
                  </p>
                  {/* Social links */}
                <div className="social-links" style={{ marginTop: '0rem' }}>
                  <a 
                    href={integrante.linkedin || "#"} 
                    className="social-btn social-linkedin"
                    title="LinkedIn"
                    onClick={(e) => handleSocialClick(e, integrante.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a 
                    href={integrante.github || "#"} 
                    className="social-btn social-github"
                    title="GitHub"
                    onClick={(e) => handleSocialClick(e, integrante.github)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-github"></i>
                  </a>
                  <a 
                    href={integrante.instagram || "#"} 
                    className="social-btn social-instagram"
                    title="Instagram"
                    onClick={(e) => handleSocialClick(e, integrante.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                </div>
                  <p 
                    className="card-text" 
                    style={{ 
                      marginBottom: '0.5rem', 
                      fontSize: '0.65rem',
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {integrante.descripcion}
                  </p>
                </div>

                {/* Skills */}
                <div className="skills-container">
                  {integrante.skills.slice(0, 3).map((skill, j) => (
                    <AnimatedSkillBar 
                      key={j}
                      skill={skill}
                      index={j}
                      isCardHovered={hoveredCard === index}
                    />
                  ))}
                </div>

                
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Controles */}
      <div className="team-carousel-3d-controls">
        <button className="team-carousel-3d-btn prev" onClick={() => rotate(-1)}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="team-carousel-3d-btn next" onClick={() => rotate(1)}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
      
      {/* Indicadores */}
      <div className="team-carousel-3d-indicators">
        {integrantes.map((_, index) => (
          <button
            key={index}
            className={`team-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
    </div>
  );
};

export default TeamCarousel3D;