// The Electron app uses plain CSS + inline styles — no PostCSS plugins.
// An empty config here stops postcss-load-config from walking up to the
// parent (website) folder and picking up its Tailwind config, which would
// fail because @tailwindcss/postcss is not installed in this project.
export default {};
