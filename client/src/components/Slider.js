import React from 'react';

const Slider = ({ label, value, min = 0, max = 100, step = 1, onChange, unit = '%', color }) => {
  const displayValue = unit === '°' ? Math.round(value) : Math.round(value);

  // Intensity/white sliders get inline gradient style, RGB handled by CSS classes
  const getSliderStyle = () => {
    if (color === 'white' || color === 'intensity') {
      return {
        background: `linear-gradient(to right, #222 0%, #fff 100%)`
      };
    }
    return {};
  };

  // Map color names to CSS classes
  const getThumbClass = () => {
    if (color === 'intensity' || color === 'white') return 'slider intensity-slider';
    // Look theme colors and RGB channel colors
    if (color) return `slider ${color}-slider`;
    return 'slider';
  };

  return (
    <div className="slider-group">
      <div className="slider-label">
        <span>{label}</span>
        <span>{displayValue}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={getThumbClass()}
        style={getSliderStyle()}
      />
    </div>
  );
};

export default Slider;
