import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/carrousel.css";

export default function Carousel3DHome({ integrantes }) {
  const [angle, setAngle] = useState(0);
  const [velocity, setVelocity] = useState(0.6);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const rotationStep = 360 / integrantes.length;

  //  rotacion 
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev - velocity);
      setVelocity((v) => v * 0.98);
    }, 30);
    return () => clearInterval(interval);
  }, [velocity]);

  // dontrol del arrastre
  const handleStart = (x) => {
    setDragging(true);
    setStartX(x);
  };

  const handleMove = (x) => {
    if (!dragging) return;
    const deltaX = x - startX;
    setStartX(x);
    setVelocity(deltaX * 0.02);
  };

  const handleEnd = () => setDragging(false);

  const handleNext = () => {
    setAngle((prev) => prev - rotationStep);
    setVelocity(0);
  };

  const handlePrev = () => {
    setAngle((prev) => prev + rotationStep);
    setVelocity(0);
  };

  return (
    <div className="carousel-3d-container">
      <div className="carousel-3d-wrapper">
        <button className="carousel-arrow left" onClick={handlePrev}>
          ❮
        </button>

        <div
          className="carousel-3d"
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          <div
            className="carousel-3d-inner"
            style={{
              transform: `rotateY(${angle}deg)`,
              transition: dragging ? "none" : "transform 0.4s ease-out",
            }}
          >
            {integrantes.map((integrante, i) => {
              const rotation = rotationStep * i;
              return (
                <div
                  key={i}
                  className="carousel-3d-item"
                  style={{
                    transform: `rotateY(${rotation}deg) translateZ(420px)`,
                  }}
                >
                  <Link
                    to={`/integrantes/${integrante.nombre.toLowerCase()}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <div className="member-card">
                      <img
                        src={integrante.img}
                        alt={integrante.nombre}
                        className="member-img"
                      />
                      <h5>{integrante.nombre}</h5>
                      <p className="ubicacion">
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {integrante.ubicacion}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <button className="carousel-arrow right" onClick={handleNext}>
          ❯
        </button>
      </div>

      <div
        className="drag-bar"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <p> Arrastrá iquierda o derecha para mover el carrusel</p>
      </div>
    </div>
  );
}
