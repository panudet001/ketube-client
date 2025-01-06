// https://nuxt.com/docs/api/configuration/nuxt-config
import { createRequire } from "node:module";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";

const require = createRequire(import.meta.url);

const larkTheme = require.resolve("@ckeditor/ckeditor5-theme-lark");

export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ["@apollo/client", "ts-invariant/process"],
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0",
      meta: [
        {
          name: "msapplication-TileColor",
          content: "#FFFFFF",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
        {
          name: "author",
          content: "Ketube",
        },
      ],
      script: [
        {
          src: "https://cdn.jwplayer.com/libraries/tBeDofb9.js",
          defer: true,
        },
        { src: "https://code.jquery.com/jquery-3.7.1.min.js", defer: true },
        {
          src: "/js/slick.min.js",
          defer: true,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.0/socket.io.js",
          defer: true,
        },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "60x60",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          sizes: "32x32",
          type: "image/png",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          sizes: "16x16",
          type: "image/png",
          href: "/favicon-16x16.png",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: "/scss/slick.css",
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: "/scss/slick-theme.css",
        },
        {
          rel: "mask-icon",
          type: "text/css",
          href: "/safari-pinned-tab.svg",
          color: "#ED4EB6",
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Icons",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Icons+Outlined",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Icons+Round",
        },
      ],
    },
  },
  devServer: {},
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/components",
      extensions: [".vue"],
      pathPrefix: false,
    },
  ],
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "line-awesome/dist/line-awesome/css/line-awesome.min.css",
    "~/assets/scss/style.scss",
    "vue-advanced-cropper/dist/style.css",
  ],
  plugins: [],
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/eslint-module",
    "@nuxtjs/robots",
    "@nuxtjs/device",
    "nuxt-vue3-google-signin",
    "@vee-validate/nuxt",
  ],

  googleSignIn: {
    clientId:
      "915533235056-kvq3l2vadj1uiutvse45dmjulnh560tn.apps.googleusercontent.com",
  },
  robots: {
    rules: {
      UserAgent: "*",
      Disallow: "",
    },
  },
  pinia: {
    storesDirs: ["~/stores/**"],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "assets/scss/custom/_color.scss" as *;',
        },
      },
    },
    plugins: [
      ckeditor5({
        theme: larkTheme,
      }),
    ],
  },
});
