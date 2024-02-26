# Simple Starter
The basic boilerplate to start development.
- Works on Node.js 18+
- Built with Gulp + Webpack
- Designed for latest vesions of Chrome, Firefox, Safari, Opera, Edge

## Project start
1. Install dependencies:
    ```
    npm install
    ```
2. Start Gulp for development:
    ```
    npm start
    ```
3. Open URL: http://localhost:3000/

## Commands
- Start project for development:
    ```
    npm start
    ```
- Build project for production:
    ```
    npm run build
    ```
- Run linter tests:
    ```
    npm run test
    ```

## Project structure
All source files should be kept in the `source/` directory.

The project directory general structure:
```
source/
source/fonts/                       // Local fonts
source/images/                      // Images
source/js/                          // JS scripts
source/templates/                   // Template files
source/styles/                      // Style files
```

### Markup files (Pug)
The project uses the Pug template engine. See the examples below and the [documentation](https://pugjs.org/api/getting-started.html) for effective use of the template engine.

The following is the structure of the markup files:
```
source/templates/
source/templates/components/        // Components
source/templates/mixins/            // Mixins
source/templates/data.pug           // Project data
source/templates/layout.pug         // Basic layout and data
source/templates/mixins.pug         // Included mixins
source/templates/sprite.pug         // Inline SVG-sprite
source/index.pug                    // Main page
```

The sources for the main and inner pages should be kept in the `source/` directory. It is recommended to take the `index.pug` as a basis.

#### Components
The component files should be kept in the `templates/components/` directory. To include them in your files and templates, use `include templates/components/<component-name>` (`*.pug` extension is omitted).

Here is an example of including a header component:
```pug
include templates/components/header
```

#### Mixins
The mixin files should be kept in the `templates/mixins/` directory and included via the `mixins.pug`. The included mixin can be used with `+<mixin-name>(args)`.

An example of including an icon from an SVG-sprite with a mixin:
```pug
+svg('arrow', 30, 30)
```

#### Project data
The project data that can be used in several places should be added to the `data.pug`. They can then be accessed in templates.
```pug
// data.pug
-
  const data = {
    logo: {
      file: 'images/logo.svg',
      width: 150,
      height: 100,
    },
  };

// Template
img(src=data.logo.file alt="" width=data.logo.width height=data.logo.height)
```

#### Default layout and data
The basic layout, data and default project settings are provided in the `layout.pug`. Edit it *only* if you want to make global changes to the project.

For example, you can change the value of the `lang` attribute for a French project:
```javascript
const html = {
  attributes: {
    lang: 'fr',     // changed from 'en'
  },
};
```

You may also want to change the default breakpoints and add support for new resolutions:
```javascript
const site = {
  breakpoints: {
    fullhd: 1920,     // while adding a new resolution,
    desktop: 1280,    // keep the order from largest to smallest
    tablet: 720,
  },
};
```

In other cases, it is recommended to leave the `layout.pug` as is and make changes through the page files.

##### Adding a class to &lt;body&gt;
If you want to add an extra class to the `<body>` of a single page (for example, to apply special styles only for the main page), use `body.classList.push('some-class');`.

Similarly, to add a class to the `<html>`, use `html.classList.push('some-class');`. See the `index.pug` for the reference.

### Style files (SCSS)
The project uses the Sass preprocessor with SCSS syntax. See the examples below and the [documentation](https://sass-lang.com/documentation/) for effective use of the SCSS capabilities.

The following is the starting structure of the SCSS files:
```
source/styles/
source/styles/animations/           // Animations
source/styles/components/           // Component styles
source/styles/functions/            // Functions
source/styles/mixins/               // Mixins
source/styles/vendor/               // 3rd party styles
source/styles/_animations.scss      // Included animations
source/styles/_fonts.scss           // Local fonts
source/styles/_functions.scss       // Included functions
source/styles/_global.scss          // Global styles
source/styles/_helpers.scss         // Helper styles (wrappers, visually-hidden, etc.)
source/styles/_mixins.scss          // Included mixins
source/styles/_variables.scss       // Constants and variables
source/styles/_vendor.scss          // Included 3rd party styles
source/styles/style.scss            // Main file to be compiled into style.css
```

**Note:** All filenames of imported style files must begin with an underscore (`_`).

#### Component styles
For each template component, it is recommended to create a separate style file with the corresponding name in the `styles/components/` directory. This file should then be imported in the `style.scss` with `@import "components/<component-name>";` (`*.scss` extension and underscore is omitted).

#### Constants and variables
It is recomended to keep your SCSS variables in the `_variables.scss`. Native CSS variables (custom properties) should be placed in the `_global.scss` inside the `:root` rule.

**Note:** To assign a SCSS variable or the result of an expression to a CSS variable, you must use interpolation:
```scss
:root {
  --color-primary: #{$color-blue};
  --color-translucent: #{rgba($color-blue, 0.3)};
}
```

#### Mixins and functions
The mixin files should be kept in the `styles/mixins/` directory and imported via the `_mixins.scss`. The imported mixin can be included in the stylesheet with `@include <mixin-name>(args);`.

The function files should be kept in the `styles/functions/` directory and imported via the `_functions.scss`. The imported functions can be called in the stylesheet using `<function-name>(args)`.

**Note:** To ease the routine tasks that developers regularly deal with, the project is completed with several mixins. See the [Built-in mixins](#built-in-mixins) section below.

#### Global styles
Global styles should be placed in the `_global.scss`. Global styles apply to the entire project as a whole: for example, font properties or background color.

#### Local fonts
Non-standard fonts should be added using the `_fonts.scss`. To automatically generate the `@font-face` at-rule, use the mixin included in the project.
```scss
@include font-face("Roboto", "Bold", 700);
```

For a detailed guide on working with fonts, see the [Fonts](#fonts) section.

#### Built-in mixins
##### @media at-rules
The project has a set of mixins to simplify the generation of `@media` at-rules to create breakpoints for different viewport sizes.
```
// To apply styles based on viewport width
@include media-min(<min-width>) { ... };
@include media-max(<max-width>) { ... };
@include media-min-max(<min-width>, <max-width>) { ... };

// To apply styles based on viewport height
@include media-min-height(<min-height>) { ... };
@include media-max-height(<max-height>) { ... };
@include media-min-max-height(<min-height>, <max-height>) { ... };

// To apply styles based on viewport orientation
@include landscape { ... };
@include portrait { ... };
```

For detailed reference, read the comments in the [mixin file](source/styles/mixins/_media.scss).

Here is an example to set styles for desktop-sized viewports:
```scss
// SCSS source
p {
  font-size: 14px;
  @include media-min(1440px) {
    font-size: 18px;
  };
}

// CSS output
p {
  font-size: 14px;
}
@media only screen and (min-width: 1440px) {
  p {
    font-size: 18px;
  }
}
```

##### Background images
The project has set of mixins to make it easier to add background images to styles in modern format (WebP, AVIF) or work with retina images. For a detailed guide on working with images, see the [Images](#images) section.

##### Helper mixins
Various helper mixins designed to aid the developer with repetitive tasks.
```
// Hides an element from the viewport
@include visually-hidden;

// Resets the default browser styles for lists
@include list-reset;

// Truncates contents of a block to the specified number of lines and adds an ellipsis at the end
@include line-clamp(<number>);
```

For detailed reference, read the comments in the [mixin file](source/styles/mixins/_helpers.scss).

### Scripts
The project uses the [Webpack](https://webpack.js.org/) bundler to build scripts into a single file. The script files should be kept in the `source/js/` directory and imported into the `main.js` as modules.

To learn more about JavaScript modules [read here](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).

**Note:** While there are no strict rules, it is recommended to keep your modules organized and group them into appropriate directories based on their functionality.

Do not forget to include the resulting bundle in your template with the `<script>`. See the `index.pug` for the reference.

### Images
The original image files should be stored in the `source/images/` directory. Also, if you want to use mixins to work with images provided in the project, then you should adhere to the following format when naming files:
```
<image-name>[-<device>][<@descriptor>].<extension>
```
- `<image-name>` - arbitrary filename
- `<device>` - device name for which the image is targeted (for example: `tablet`, `desktop`); must match one of the `breakpoints` keys in the `layout.pug`
- `<@descriptor>` - pixel density descriptor of the image (for example: `@2x`, `@3x`)
- `<extension>` - file extension of JPEG, PNG or SVG format

File naming examples:
```
logo.svg

map.png
map-tablet.png
map-desktop.png

slide-01.jpg
slide-01@2x.jpg
slide-01-tablet.jpg
slide-01-tablet@2x.jpg
slide-01-desktop.jpg
slide-01-desktop@2x.jpg
```

#### WebP and AVIF
Most modern browsers support progressive image formats (WebP and AVIF). However, you do not have to prepare them manually, they will be generated automatically when you create the build.

By default, only WebP files are generated. If you also need the AVIF format, uncomment the corresponding lines in the `optimizeImages` and `fastImages` tasks in the `gulpfile.js`.

#### Adding images in the template
The project has a mixin that simplifies the insertion of responsive images into the template.
```
+picture(<image-name>, <description>, <width>, <height>, <format-list>, [<options>]);
```
- `<image-name>` - image filename *without* device name, pixel density descriptor and file extension
- `<description>` - image description to add to the `alt` attribute
- `<width>` и `<height>` - image width and height
- `<format-list>` - list of all image formats to be included in the resulting `<picture>`
- `<options>` - additional options (maximum pixel density, list of viewport breakpoints, etc.)

For detailed reference, read the comments in the [mixin file](source/templates/mixins/picture.pug).

An example of inserting a responsive image in WebP and AVIF with 2x pixel density:
```pug
// Original images
   slide-01.jpg
   slide-01@2x.jpg
   slide-01-tablet.jpg
   slide-01-tablet@2x.jpg
   slide-01-desktop.jpg
   slide-01-desktop@2x.jpg

// Mixin usage
+picture('slide-01', '', 600, 400, ['avif', 'webp', 'jpg'], {retina: 2})

// HTML output
   Breakpoint values 768px and 1440px are taken from layout.pug
   Reminder: Gulp generates WebP and AVIF files automatically, you do not have to prepare them manually
<picture>
  <source srcset="images/slide-01-desktop.avif, images/slide-01-desktop@2x.avif 2x" media="(min-width: 1440px)" type="image/avif">
  <source srcset="images/slide-01-desktop.webp, images/slide-01-desktop@2x.webp 2x" media="(min-width: 1440px)" type="image/webp">
  <source srcset="images/slide-01-desktop.jpg, images/slide-01-desktop@2x.jpg 2x" media="(min-width: 1440px)" type="image/jpeg">
  <source srcset="images/slide-01-tablet.avif, images/slide-01-tablet@2x.avif 2x" media="(min-width: 768px)" type="image/avif">
  <source srcset="images/slide-01-tablet.webp, images/slide-01-tablet@2x.webp 2x" media="(min-width: 768px)" type="image/webp">
  <source srcset="images/slide-01-tablet.jpg, images/slide-01-tablet@2x.jpg 2x" media="(min-width: 768px)" type="image/jpeg">
  <source srcset="images/slide-01.avif, images/slide-01@2x.avif 2x" type="image/avif">
  <source srcset="images/slide-01.webp, images/slide-01@2x.webp 2x" type="image/webp">
  <img src="images/slide-01.jpg" srcset="images/slide-01@2x.jpg 2x" alt="" width="600" height="400">
</picture>
```

#### Adding background images
The project has a set of mixins that make it easier to add background images in modern formats (WebP, AVIF) to styles and work with retina images.

There is also a built-in script in the `layout.pug` that detects browser support for WebP and AVIF formats. If the browser supports one or both formats, the `webp` and/or `avif` classes are added to the `<html>`. Otherwise, the `no-webp` and/or `no-avif` classes are added. That script is essential for mixins to inserting background images in the above formats.

##### Background images in WebP and AVIF
To set a background image in WebP and/or AVIF formats with a fallback for older browsers, use the `background-modern` mixin.
```
@include background-modern(<image-name>, [<format-list>]);
```
- `<image-name>` - filename with extension and without file path
- `<format-list>` - list of modern image formats to be included in the resulting set of CSS rules

For detailed reference, read the comments in the [mixin file](source/styles/mixins/_background-image.scss).

An example of inserting a background image in WebP and AVIF with JPEG fallback:
```scss
// SCSS source
.foo {
  @include background-modern("image.jpg", webp avif);
}

// CSS output
.no-js .foo, .no-webp .foo, .no-avif .foo {
  background-image: url("../images/image.jpg");
}
.webp .foo {
  background-image: url("../images/image.webp");
}
.avif .foo {
  background-image: url("../images/image.avif");
}
```

##### Background retina images
To set a background image for higher pixel density displays, use the `background-retina` mixin.
```
@include background-retina(<image-name> <retina-image-name>, <image-size>, [<format-list>]);
```
- `<image-name>` - filename with extension and without file path
- `<retina-image-name>` - filename of retina image
- `<image-size>` - background image size
- `<format-list>` - list of modern image formats to be included in the resulting set of CSS rules

For detailed reference, read the comments in the [mixin file](source/styles/mixins/_background-image.scss).

An example of inserting a background image in WebP and AVIF with 2x pixel density:
```scss
// SCSS source
.foo {
  @include background-retina("image.jpg" "image@2x.jpg", 100px 50px, webp avif);
}

// CSS output
.foo {
  background-size: 100px 50px;
}
.no-js .foo, .no-webp .foo, .no-avif .foo {
  background-image: url("../images/image.jpg");
}
.webp .foo {
  background-image: url("../images/image.webp");
}
.avif .foo {
  background-image: url("../images/image.avif");
}
@media only screen and (min-resolution: 192dpi) {
  .no-js .foo, .no-webp .foo, .no-avif .foo {
    background-image: url("../images/image@2x.jpg");
  }
  .webp .foo {
    background-image: url("../images/image@2x.webp");
  }
  .avif .foo {
    background-image: url("../images/image@2x.avif");
  }
}
```

#### SVG-sprite
The files for the SVG-sprite should be stored in the `source/images/icons/` directory. The `sprite.svg` will be generated from them automatically when you create the build. The icons can then be inserting into the template using the mixin.
```
+svg(<icon-name>, <width>, <height>)
```

For detailed reference, read the comments in the [mixin file](source/templates/mixins/svg.pug).

An example of inserting an icon from an SVG-sprite:
```pug
// Original image
   arrow.svg

// Mixin usage
+svg('arrow', 30, 30)

// HTML output
<svg width="30" height="30">
  <use href="images/sprite.svg#arrow"></use>
</svg>
```

##### Inline SVG-sprite
If the resulting SVG-sprite is small and contains few icons, you may inline it into the template to reduce the number of requests to the server. Just add `include templates/sprite` at the beginning of the `content` block of your pages. See the `index.pug` for the reference.

When using the mixin, you need to specify that the SVG-sprite is inlined:
```pug
+svg('arrow', 30, 30, true)
```

#### Favicons
The favicons should be stored in the `source/images/favicons/` directory, except for the `favicon.ico` which should be stored in the `source/` directory.

There are many standard and non-standard sizes and formats of favicons, but in most cases you only need a few. In the project it is proposed to use *192x192* and *512x512* PNG favicons included using [Web App Manifest](https://developer.mozilla.org/docs/Web/Manifest/icons), a *180x180* `apple-touch-icon` favicon, and an SVG favicon. Optionally, an ICO favicon for older browsers.

An example of adding favicons:
```javascript
links.push({
  rel: 'icon',
  href: 'favicon.ico',
});
links.push({
  rel: 'icon',
  href: 'images/favicons/favicon.svg',
  type: 'image/svg+xml',
});
links.push({
  rel: 'apple-touch-icon',
  href: 'images/favicons/apple.png',
});
links.push({
  rel: 'manifest',
  href: 'manifest.webmanifest',
});
```
For the reference, see the commented out block of code after `append variables` in the `index.pug`.

**Note:** The above set of favicons is a simple recommendation. You can add only some of the favicons or create your own set.

### Fonts
The local fonts should be stored in the `source/fonts/` directory. Also, for compatibility with the built-in mixin, you should adhere to the following format when naming files:
```
<font-name>-<numeric-font-weight>[i|o].<extension>
```
- `<font-name>` - filename in lowercase, without spaces, hyphens or underscores
- `<numeric-font-weight>` - numeric representation of font weight
- `<extension>` - file extension of EOT, WOFF2, WOFF, OTF, TTF or SVG format
- `i` for italic font style, `o` for oblique font style

File naming examples:
```
// Roboto Regular
roboto-400.woff2

// Roboto Mono Bold Italic
robotomono-700i.woff2
```

#### Adding fonts
To automatically generate a `@font-face` at-rule and add a local font, use the `font-face` mixin.
```
@include font-face(<font-family>, <weight-name>, [<numeric-font-weight>], [<font-style>], [<format-list>]);
```
- `<font-family>` - font family name
- `<weight-name>` - font weight [name](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-weight#common_weight_name_mapping)
- `<numeric-font-weight>` - numeric representation of font weight
- `<font-style>` - font style (`italic` or `oblique`)
- `<format-list>` - list of font formats to be included in the resulting set of CSS rules

For detailed reference, read the comments in the [mixin file](source/styles/mixins/_font-face.scss).

An example of adding the **Roboto Italic** font in WOFF and WOFF2 formats:
```scss
// SCSS source
@include font-face("Roboto", "Regular", 400, italic);

// CSS output
@font-face {
  font-style: italic;
  font-weight: 400;
  font-family: "Roboto";
  font-display: swap;
  src:
    local("Roboto Italic"), local("Roboto-Italic"),
    url("../fonts/roboto-400i.woff2") format("woff2"),
    url("../fonts/roboto-400i.woff") format("woff");
}
```

An example of adding the **Roboto Mono Bold** font in EOT and WOFF2 formats:
```scss
// SCSS source
@include font-face("Roboto Mono", "Bold", 700, $extensions: eot woff2);

// CSS output
@font-face {
  font-style: normal;
  font-weight: 700;
  font-family: "Roboto Mono";
  font-display: swap;
  src:
    local("Roboto Mono Bold"), local("RobotoMono-Bold"),
    url("../fonts/robotomono-700.eot?") format("eot"),
    url("../fonts/robotomono-700.woff2") format("woff2");
}
```

#### Adding fonts from Google Fonts
You can also add fonts from [Google Fonts](https://fonts.google.com/). Here is an example of adding the **Roboto Regular** font:
```javascript
links.push({
  rel: 'preconnect',
  href: 'https://fonts.googleapis.com',
});
links.push({
  rel: 'preconnect',
  href: 'https://fonts.gstatic.com',
  crossorigin: 'anonymous',
});
links.push({
  rel: 'stylesheet',
  href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
});
```
Add the block of code above after `append variables` in the `index.pug` and other page files.

#### Preloading fonts
Font preloading can be enabled with `preloads.push('fonts/<font-name>.<extension>')`.
```javascript
preloads.push('fonts/roboto-400.woff2');
```

For the reference, see the commented out block of code after `append variables` in the `index.pug`.
