import React, { useState, useEffect, useCallback } from 'react';
/**
 * Reusable SearchBar component
 * Props:
 *  - value: external controlled value (optional)
 *  - defaultValue: initial value if uncontrolled
 *  - onChange(term): callback after debounce
 *  - placeholder: input placeholder
 *  - delay: debounce ms (default 300)
 *  - autoFocus: focus input on mount
 */
const SearchBar = ({ value, defaultValue = '', onChange, placeholder = 'Search...', delay = 300, autoFocus = false }) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(isControlled ? value : defaultValue);

  // Keep internal in sync when controlled value changes
  useEffect(() => {
    if (isControlled) setInternal(value);
  }, [value, isControlled]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange && onChange(internal.trim());
    }, delay);
    return () => clearTimeout(handler);
  }, [internal, delay, onChange]);

  const handleInput = (e) => {
    const next = e.target.value;
    if (!isControlled) setInternal(next);
    else onChange && onChange(next); // if controlled forward immediately
  };

  const clear = useCallback(() => {
    if (!isControlled) setInternal('');
    onChange && onChange('');
  }, [isControlled, onChange]);

  return (
    <div className="search-bar" role="search" aria-label="Search issues">
      <input
        type="text"
        value={internal}
        onChange={handleInput}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
      />
      {internal && (
        <button type="button" onClick={clear} aria-label="Clear search">✕</button>
      )}
    </div>
  );
};

export default SearchBar;
