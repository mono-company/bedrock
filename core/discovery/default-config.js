const defaultConfig = {
  /**
   *  Don't index (hide prototypes from search engines)
   */
  noIndex: true,
  /**
   *  Page tree generation: existence of this section
   *  determines whether the page tree gets generated
   */
  pageTree: {
    layoutStyle: 'sidebar'
  },
  /**
   *  Partials generation: this flag determines
   *  whether the components partials get generated
   */
  partials: false,
  /**
   * CSS and JS minification
   * Adjust these values to set up your project for production or dev
   */
  js: {
    minify: false
  },
  css: {
    compiler: 'scss',
    minify: false,
    purge: false
  },
  /**
   *  Styleguide generation: existence of this section
   *  determines whether the styleguide gets generated
   */
  styleguide: {
    /**
     *  search [boolean]
     *  Feature flag for search feature
    */
    search: true,
    colors: './content/scss/_colors.scss',
    /**
     *  categoryOrder
     *  Determines the order of documentation categories
     */
    categoryOrder: [
      'Style guide',
      'Design patterns',
      'Components'
    ],
    /**
     * componentCategories
     * The prefix on folder names in /components determines the category
     */
    componentCategories: {
      aov: 'Overviews',
      c: 'Components',
    },
    /**
     * Code samples
     */
    codeSamples: {
      jsx: false
    }
  },
  /**
   *  Icon
   *  Set up whether Bedrock should generate icon fonts
   *  Set up CSS classnames for SVG icons and icon font
   */
  icons: {
    generateIconFont: false,
    iconFontPath: "./content/scss/_icon-font.scss",
    svgIconClassPrefix: 'o-svg-icon',
    iconFontClassPrefix: 'if'
  },
  pug: {
    pretty: true,
    basedir: "./content"
  },
  prettify: {
    indentWithTabs: true,
    preserveNewlines: true,
    inline: '',
    logSuccess: false,
    indentSize: 4,
    unformatted: ['pre', 'textarea'],
    extraLiners: ['body']
  },
  express: {
    port: 8000,
  },
};

module.exports = defaultConfig;
