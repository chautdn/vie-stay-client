import React from 'react';

const RadioGroup = ({ value, onValueChange, children, className, ...props }) => {
  return (
    <div 
      className={className}
      role="radiogroup"
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selectedValue: value,
            onValueChange
          });
        }
        return child;
      })}
    </div>
  );
};

const RadioGroupItem = ({ value, id, selectedValue, onValueChange, ...props }) => {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={selectedValue === value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      {...props}
    />
  );
};

export { RadioGroup, RadioGroupItem };