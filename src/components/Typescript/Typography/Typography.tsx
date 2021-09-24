import React from 'react';

interface TypographyProps {
  children?: React.ReactNode;
  capitalize?: boolean;
  className?: string;
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  paragraph?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  capitalize = true,
  className,
  component,
  paragraph = true,
  ...other
}) => {
  const Component = component || (paragraph && 'p') || 'span';

  return (
    <Component className={className} {...other}>
      {children}
    </Component>
  );
};
