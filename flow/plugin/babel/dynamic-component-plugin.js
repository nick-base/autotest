const template = require('@babel/template').default;
const fs = require('fs');
const path = require('path');

const dependentPath = 'src/components/';

const loadComponent = (dir = '', prefix = null) => {
  const root = path.resolve(process.cwd(), dependentPath, dir);
  return fs
    .readdirSync(root)
    .filter((name) => fs.statSync(path.join(root, name)).isDirectory())
    .flatMap((name) => {
      const componentName = prefix ? `${prefix}.${name}` : name;
      const componentPath = dir ? `${dir}/${name}` : `${name}`;

      return [{ dir, prefix, componentName, componentPath }, ...loadComponent(`${componentPath}/`, componentName)];
    });
};

const buildImport = template(`import __dynamic from 'next/dynamic';`);

const buildComponentMap = () => {
  const componentMapData = loadComponent()
    .reduce((prevs, curr) => {
      prevs.push(`'${curr.componentName}': __dynamic(() => import('@/components/${curr.componentPath}')),`);
      return prevs;
    }, [])
    .join('\n');

  return `DYNAMIC_COMPONENT_MAP = { ${componentMapData} }`;
};

const LoadComponentPlugin = (api) => {
  let root;
  let imported = false;

  return {
    visitor: {
      Program(path) {
        root = path;
      },
      VariableDeclarator(path) {
        if (path.node.id.name === 'DYNAMIC_COMPONENT_MAP') {
          path.replaceWithSourceString(buildComponentMap());
          root.unshiftContainer('body', buildImport());
          imported = true;
        }
      },
    },
  };
};

module.exports = LoadComponentPlugin;
