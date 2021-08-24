import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import capitalizeLetters from '../../../utils/capitalize';

const Typography = forwardRef(function Typography(props, ref) {
  const {
    children,
    capitalize = true,
    className,
    component,
    paragraph = true,
    ...other
  } = props;

  const Component = component || (paragraph && 'p') || 'span';

  return (
    <Component className={className} ref={ref} {...other}>
      {capitalize && typeof children === 'string'
        ? capitalizeLetters(children)
        : children}
    </Component>
  );
});

Typography.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  paragraph: PropTypes.bool,
  component: PropTypes.oneOf([
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span',
  ]),
};
