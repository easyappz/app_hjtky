import React from 'react';

function KeyButton({
  label,
  ariaLabel,
  onClick,
  variant = 'default',
  wide = false,
  dataTag,
}) {
  const classNames = [
    'btn',
    variant === 'operator' ? 'btn--operator' : '',
    variant === 'equals' ? 'btn--equals' : '',
    variant === 'utility' ? 'btn--utility' : '',
    wide ? 'btn--wide' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classNames}
      aria-label={ariaLabel || String(label)}
      onClick={onClick}
      data-easytag={dataTag}
    >
      {label}
    </button>
  );
}

export default KeyButton;
