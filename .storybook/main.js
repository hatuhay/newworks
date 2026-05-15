import { cwd } from "node:process";

const themePath = cwd();
const canvasShimPath = `${themePath}/.storybook/mocks/canvas.js`;

const config = {
  stories: [
    "../components/**/*.stories.@(js|mdx)",
    "../components/**/*.component.yml",
    "../components/**/*.story.yml",
    "../components/**/*.stories.yml",
  ],
  addons: [
    {
      name: "storybook-addon-sdc",
      options: {
        sdcStorybookOptions: {
          twigLib: "twig",
          namespace: "newworks",
          namespaces: {
            ayarachis: themePath,
          },
        },
      },
    },
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  async viteFinal(config) {
    config.server = config.server ?? {};
    config.server.host = "0.0.0.0";
    config.server.allowedHosts = true;

    config.resolve = config.resolve ?? {};
    const existingAlias = config.resolve.alias ?? [];
    if (Array.isArray(existingAlias)) {
      config.resolve.alias = [
        ...existingAlias,
        { find: "canvas", replacement: canvasShimPath },
      ];
    } else {
      config.resolve.alias = {
        ...existingAlias,
        canvas: canvasShimPath,
      };
    }

    config.optimizeDeps = config.optimizeDeps ?? {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude ?? []),
      "canvas",
    ];
    return config;
  },
  features: {
    storyStoreV7: false,
  },
};

export default config;
