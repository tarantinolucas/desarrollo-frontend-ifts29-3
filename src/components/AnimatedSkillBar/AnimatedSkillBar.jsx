import { useState, useEffect, useRef } from 'react';
import '../../css/apipage.css';

function AnimatedSkillBar({ skill, index, isCardHovered }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    // Limpiar animación anterior
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }

    if (isCardHovered) {
      // Iniciar animación desde 0
      setDisplayValue(0);
      
      let current = 0;
      const increment = skill.level / 25; // Más rápido
      
      animationRef.current = setInterval(() => {
        current += increment;
        if (current >= skill.level) {
          setDisplayValue(skill.level);
          clearInterval(animationRef.current);
          animationRef.current = null;
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 20);
    } else {
      // Reset inmediato cuando el hover se pierde
      setDisplayValue(0);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isCardHovered, skill.level]);

  const skillClassMap = {
    "C#": "csharp",
    "Adobe Suite": "adobe",
    "NodeJS": "nodejs",
    "Express": "express",
    "NestJS": "nestjs",
    "MySQL": "mysql",
    "Godot": "godot",
    "Maya": "maya", 
    "Blender": "blender",
    "Flask": "python", // Usar el mismo color que Python
    "Firewall": "firewall",
    "Mikrotik": "mikrotik"
  };
  
  const skillClass = skillClassMap[skill.name] || skill.name.toLowerCase().replace(/[^a-z0-9]/g, '');

  return (
    <div className="skill-item">
      <div className="skill-header">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-percentage">
          {displayValue}%
        </span>
      </div>
      <div className="skill-bar">
        <div 
          className={`skill-progress ${skillClass}`} 
          style={{ '--skill-level': `${skill.level}%` }} 
        />
      </div>
    </div>
  );
}

export default AnimatedSkillBar;