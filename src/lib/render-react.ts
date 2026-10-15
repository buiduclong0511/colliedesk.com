// Renders a React component to static HTML at build time, for <Fragment set:html={...} /> in
// .astro files. Public react-dom/server API only: no renderer integration, so nothing of React
// reaches the browser.
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function html<P extends object>(Component: ComponentType<P>, props: P): string {
  return renderToStaticMarkup(createElement(Component, props));
}
