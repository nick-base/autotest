import React from 'react';

const NotFound = (props = {}) => {
  return <div>Component &lsquo;{props.ComponentName}&rsquo; not found!</div>;
};

const DYNAMIC_COMPONENT_MAP = {};

const dev = 'development' === process.env.NODE_ENV;

if (dev) {
  console.log('Recompile dynamic component map', __COMPONENTS_REBUILD_TIME__, DYNAMIC_COMPONENT_MAP);
}

export function render(components, level = 0) {
  if (!components) {
    return React.Fragment;
  }

  if (!Array.isArray(components)) {
    components = [components];
  }

  return components.map((item = {}, index) => {
    const { name = '', key = `${level}-${index}-${name}`, children } = item;

    return React.createElement(
      DYNAMIC_COMPONENT_MAP[name]?.component || (dev ? NotFound : React.Fragment),
      {
        key,
        ...(!DYNAMIC_COMPONENT_MAP[name]?.component && dev ? { ComponentName: name } : {}),
      },
      children ? render(children, level + 1) : null
    );
  });
}

const Render = (props) => {
  return render(props.components);
};

export default Render;
