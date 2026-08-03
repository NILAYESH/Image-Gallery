function AnimatedBackground({ theme }) {
  return (
    <div
      className={`animated-background animated-background--${theme}`}
      aria-hidden="true"
    >
      <div className="animated-background__aurora animated-background__aurora--left" />
      <div className="animated-background__aurora animated-background__aurora--right" />
      <div className="animated-background__orb animated-background__orb--one" />
      <div className="animated-background__orb animated-background__orb--two" />
      <div className="animated-background__orb animated-background__orb--three" />
      <div className="animated-background__ridge animated-background__ridge--back" />
      <div className="animated-background__ridge animated-background__ridge--front" />
      <div className="animated-background__veil" />
    </div>
  );
}

export default AnimatedBackground;
