// TeamCarousel3D.jsx - CON PAUSA AL HACER HOVER
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamCarousel3D.css';
import '../../css/apipage.css';
import AnimatedSkillBar from '../AnimatedSkillBar/AnimatedSkillBar';

const TeamCarousel3D = ({ 
  integrantes, 
  autoRotate = true, 
  interval = 10000
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isPaused, setIsPaused] = useState(false); // Estado para pausar
  const navigate = useNavigate();

  useEffect(() => {
    // Esto es para depurar. Revisa tu consola (F12) 
    // para ver qué datos está recibiendo este componente.
    if (integrantes && integrantes.length > 0) {
      console.log("Datos de integrantes recibidos:", integrantes);
    }
  }, [integrantes]);

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

  // Timer de rotación automática que se pausa cuando isPaused es true
  useEffect(() => {
    if (!autoRotate || isPaused) return;
    
    const timer = setInterval(() => {
      rotate(1);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, interval, integrantes.length, isPaused]);

  const handleCardClick = (integranteNombre) => {
    navigate(`/integrantes/${integranteNombre.toLowerCase()}`);
  };

  // Esta función solo detiene la propagación,
  // para que al hacer clic en el link no se active el clic de la tarjeta.
  const handleSocialClick = (e) => {
    e.stopPropagation();
  };

  // Manejadores para pausar/reanudar
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="team-carousel-wrapper">
      <div 
        className="team-carousel-3d-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
                className="card team-card h-100" 
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(integrante.nombre)}
                // Estilos de tu versión (tarjeta oscura, padding, etc.)
                style={{ 
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(30, 30, 30, 0.8))',
                  color: '#FFFFFF',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.2rem 1rem',
                  gap: '0.8rem',
                  alignItems: 'center' // <--- CORRECCIÓN PARA CENTRAR TODO
                }}
              >
                {/* Contenedor de imagen (centrado) */}
                <div 
                  className="image-container" 
                  style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    width: '100%' // Asegura el centrado
                  }}
                >
                  <img
                    src={integrante.img}
                    alt={integrante.nombre}
                    style={{ 
                      borderRadius: '50%',
                      width: '90px',
                      height: '90px',
                      objectFit: 'cover',
                      border: '3px solid rgba(255, 255, 255, 0.2)'
                    }}
                  />
                </div>
                
                {/* Contenido (flex) */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.6rem',
                  flex: 1,
                  width: '100%' // Asegura que ocupe todo el ancho
                }}>
                  {/* Nombre y ubicación */}
                  <div style={{ textAlign: 'center' }}>
                    <h5 className="dev-name" style={{ 
                      fontSize: '0.9rem', 
                      marginBottom: '0.3rem',
                      fontWeight: '600',
                      color: '#FFFFFF'
                    }}>
                      {integrante.nombre}
                    </h5>
                    <p className="dev-location" style={{ 
                      fontSize: '0.65rem', 
                      marginBottom: '0',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {integrante.ubicacion}
                    </p>
                  </div>
                  
                  {/* Social links (con lógica condicional) */}
                  <div className="social-links" style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    margin: '0.5rem 0'
                  }}>
                    
                    {/* El botón de LinkedIn solo aparece si 'integrante.linkedin' existe */}
                    {integrante.linkedin && (
                      <a
                        href={integrante.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleSocialClick}
                        className="social-btn social-linkedin"
                        title="LinkedIn"
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="bi bi-linkedin" style={{ fontSize: '1rem' }}></i>
                      </a>
                    )}
                    
                    {/* El botón de GitHub solo aparece si 'integrante.github' existe */}
                    {integrante.github && (
                      <a
                        href={integrante.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleSocialClick}
                        className="social-btn social-github"
                        title="GitHub"
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="bi bi-github" style={{ fontSize: '1rem' }}></i>
                      </a>
                    )}

                    {/* El botón de Instagram solo aparece si 'integrante.instagram' existe */}
                    {integrante.instagram && (
                      <a
                        href={integrante.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleSocialClick}
                        className="social-btn social-instagram"
                        title="Instagram"
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="bi bi-instagram" style={{ fontSize: '1rem' }}></i>
                      </a>
                    )}
                  </div>
                  
                  {/* Descripción */}
                  <p 
                    className="card-text" 
                    style={{ 
                      marginBottom: '0', 
                      fontSize: '0.7rem',
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4',
                      color: 'rgba(255, 255, 255, 0.85)',
                      textAlign: 'center'
                    }}
                  >
                    {integrante.descripcion}
                  </p>

                  {/* Contenedor de Skills + Texto (para empujar al fondo) */}
                  <div style={{ marginTop: 'auto' }}>
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

                    {/* Texto informativo */}
                    <p style={{
                      fontSize: '0.6rem',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.5)',
                      margin: '0.3rem 0 0 0',
                      fontStyle: 'italic'
                    }}>
                      Pasa el mouse por encima para revelar
                    </p>
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