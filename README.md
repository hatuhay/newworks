# NewWorks - Bootstrap Barrio Subtheme

A SASS-based Drupal theme built on the Bootstrap Barrio base theme, implementing Bootstrap 5 with custom components and templates.

---

## GitHub Copilot Instructions

This guide helps GitHub Copilot understand the NewWorks theme architecture, patterns, and best practices based on the Bootstrap Barrio framework.

### Theme Architecture

#### Base Information
- **Base Theme**: Bootstrap Barrio (bootstrap_barrio)
- **Framework**: Bootstrap 5.3.0
- **Build System**: Gulp + SASS
- **Core Compatibility**: Drupal ^9 || ^10 || ^11

#### Directory Structure
```
newworks-theme/
├── components/           # Single Directory Components (SDC)
├── templates/           # Twig template overrides
├── scss/               # SASS source files
├── css/                # Compiled CSS
├── js/                 # JavaScript files
├── config/             # Theme configuration
└── libraries/          # External libraries
```

### Working with Components

#### Component Structure (Single Directory Components)
Each component follows the SDC pattern with these files:
- `*.component.yml` - Component metadata and props schema
- `*.twig` - Template file
- `*.css` - Component-specific styles (optional)
- `*.js` - Component-specific JavaScript (optional)

**Example Component Structure:**
```
components/card_detail_popup/
├── card_detail_popup.component.yml
├── card_detail_popup.twig
└── card_detail_popup.js
```

#### Creating New Components

When creating a new component:

1. **Create component directory** under `components/`
2. **Define component.yml** following this structure:
```yaml
$schema: https://git.drupalcode.org/project/drupal/-/raw/HEAD/core/assets/schemas/v1/metadata.schema.json
name: Component Name
status: stable
props:
  type: object
  properties:
    property_name:
      type: string
      title: Property Title
```

3. **Create Twig template** with Bootstrap 5 markup
4. **Add JavaScript** if interactivity is needed
5. **Include library definition** in `newworks.libraries.yml` if needed

**Key Principles:**
- Use Bootstrap 5 utility classes extensively
- Follow Bootstrap markup patterns (cards, buttons, forms, etc.)
- Keep components self-contained and reusable
- Define clear prop schemas in component.yml

### Template System

#### Template Locations
- `templates/paragraphs/` - Paragraph entity templates
- `templates/field/` - Field-specific overrides
- `templates/media/` - Media entity templates
- `templates/views/` - Views output templates

#### Twig Template Patterns

**Accessing Drupal Settings:**
```twig
{% set drupal_settings = {
  '#attached': {
    'drupalSettings': {
      'themeName': {
        'key': 'value'
      }
    }
  }
} %}
{{ drupal_settings }}
```

**Bootstrap Class Usage:**
```twig
<div class="card rounded-4">
  <img src="{{ image_url }}" class="card-img" alt="{{ alt_text }}">
  <div class="card-img-overlay text-white d-flex align-items-end">
    <p class="card-text">{{ content }}</p>
  </div>
</div>
```

**Template Suggestions:**
- Use specific paragraph template names: `paragraph--{bundle}.html.twig`
- Field templates: `field--paragraph--field-{name}--{bundle}.html.twig`
- Media templates: `media--{bundle}--{view-mode}.html.twig`

### SASS/CSS Development

#### File Structure
```
scss/
├── style.scss        # Main stylesheet (imports everything)
├── import.scss       # Bootstrap import orchestration (CRITICAL)
├── variables.scss    # Bootstrap variable overrides
├── typography.scss   # Font and typography overrides
└── mixins.scss       # Custom mixins
```

#### Understanding the Compilation Process

The Gulpfile orchestrates a sophisticated build pipeline:

**1. Source Processing (`gulpfile.js` → `styles` function)**
```javascript
// Gulp compiles TWO files in sequence:
1. node_modules/bootstrap/scss/bootstrap.scss  // Full Bootstrap
2. scss/style.scss                             // Your custom styles
```

**2. SASS Compilation**
```javascript
includePaths: [
  './node_modules/bootstrap/scss',           // Bootstrap source
  '../../contrib/bootstrap_barrio/scss'       // Barrio theme utilities
]
```

**3. PostCSS Processing Pipeline**
- **Inline SVG**: Embeds Bootstrap icons directly into CSS
- **PX to REM**: Converts spacing/typography to rem units for accessibility
  - Converts: `font`, `font-size`, `line-height`, `letter-spacing`, `margin`, `padding`
  - Respects media queries
- **Autoprefixer**: Adds vendor prefixes for browser compatibility

**4. Output Generation**
- `css/bootstrap.css` - Full Bootstrap framework (with your overrides)
- `css/bootstrap.min.css` - Minified Bootstrap
- `css/style.css` - Your custom styles
- `css/style.min.css` - Minified custom styles
- Source maps included for debugging

#### Bootstrap Variable Override System

**Critical Order in `import.scss`:**
```scss
// 1. FIRST: Bootstrap Functions (enables color manipulation)
@import "../node_modules/bootstrap/scss/functions";

// 2. YOUR OVERRIDES HERE (before Bootstrap variables!)
@import "variables";      // Your custom values
@import "typography";     // Font overrides

// 3. Bootstrap Variables (your overrides take precedence)
@import "../node_modules/bootstrap/scss/variables";
@import "../node_modules/bootstrap/scss/variables-dark";

// 4. Bootstrap Maps & Mixins
@import "../node_modules/bootstrap/scss/maps";
@import "../node_modules/bootstrap/scss/mixins";

// 5. Rest of Bootstrap components...
```

**Why This Order Matters:**
- Bootstrap `functions` must load first (provides `tint-color()`, `shade-color()`, etc.)
- Your variables override Bootstrap's defaults
- Bootstrap variables file reads your overrides
- Maps and mixins use the finalized variable values

#### Key Variable Overrides

**Color System (`variables.scss`):**
```scss
// Step 1: Define your brand colors
$primary-shade: rgb(255, 78, 46);    // Your main brand color
$accent-shade: #0079C0;              // Your accent color

// Step 2: Use Bootstrap color functions to create variations
$primary-light: tint-color($primary-shade, 37%);  // Lighter version
$primary-dark: shade-color($primary-shade, 12%);  // Darker version

// Step 3: Map to Bootstrap's semantic color system
$primary: $accent-shade;      // Bootstrap buttons, links, etc.
$secondary: $primary-shade;   // Secondary UI elements
$success: #28a745;            // Success states
$info: #17a2b8;               // Info messages
$warning: #ffc107;            // Warnings
$danger: #dc3545;             // Errors/danger
```

**Common Variables to Override:**
```scss
// Theme Colors
$primary: #your-color;
$secondary: #your-color;
$body-bg: #fff;
$body-color: #333;

// Links
$link-color: $primary;
$link-decoration: none;
$link-hover-color: darken($primary, 15%);

// Spacing (affects margins/paddings globally)
$spacer: 1rem;  // Base spacing unit

// Border Radius
$border-radius: .375rem;
$border-radius-sm: .25rem;
$border-radius-lg: .5rem;

// Shadows
$enable-shadows: false;        // Set true for Bootstrap shadows
$enable-gradients: false;      // Set true for gradient backgrounds

// Responsive Fonts
$enable-responsive-font-sizes: true;  // Scales fonts with viewport

// Grid Breakpoints
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);

// Container Max Widths
$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1140px,
  xxl: 1320px
);
```

#### Font Configuration

**Typography Variables (`typography.scss`):**

```scss
// Import Google Fonts (uncomment and customize)
@import url("https://fonts.googleapis.com/css?family=Lato:400,700");
@import url("https://fonts.googleapis.com/css?family=Raleway:400,600,700");

// Define Font Stacks
$font-lato: 'Lato', Arial, Verdana, sans-serif;
$font-raleway: 'Raleway', Arial, Verdana, sans-serif;

// Apply to Bootstrap Variables
$font-family-sans-serif: $font-raleway;  // Used sitewide
$font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, monospace;

// Base Font Sizes
$font-size-base: 1rem;           // 16px default
$font-size-lg: $font-size-base * 1.25;    // 20px
$font-size-sm: $font-size-base * .875;    // 14px

// Font Weights
$font-weight-lighter: lighter;
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-bold: 700;
$font-weight-bolder: bolder;

// Line Heights
$line-height-base: 1.5;
$line-height-sm: 1.25;
$line-height-lg: 2;

// Heading Sizes
$h1-font-size: $font-size-base * 2.5;   // 40px
$h2-font-size: $font-size-base * 2;     // 32px
$h3-font-size: $font-size-base * 1.75;  // 28px
$h4-font-size: $font-size-base * 1.5;   // 24px
$h5-font-size: $font-size-base * 1.25;  // 20px
$h6-font-size: $font-size-base;         // 16px
```

**Using Multiple Font Families:**
```scss
// In typography.scss, define multiple fonts
$font-primary: 'Raleway', sans-serif;
$font-secondary: 'Lato', sans-serif;
$font-heading: 'Montserrat', sans-serif;

// Override Bootstrap's font variables
$font-family-sans-serif: $font-primary;
$headings-font-family: $font-heading;

// Or customize in style.scss
body {
  font-family: $font-primary;
}

h1, h2, h3, h4, h5, h6 {
  font-family: $font-heading;
}
```

#### Build Commands

```bash
# Install dependencies
npm install

# Compile SASS once
gulp styles

# Watch for changes and auto-compile
gulp watch

# Full development server with BrowserSync
gulp serve
# Note: Update proxy in gulpfile.js to your local Drupal URL

# Production build (generates minified CSS)
gulp styles  # Automatically creates .min.css files
```

#### Advanced Customization

**Adding Custom Bootstrap Modules:**
```scss
// In import.scss, uncomment/add specific Bootstrap components
@import "../node_modules/bootstrap/scss/tooltips";
@import "../node_modules/bootstrap/scss/popovers";
// Only import what you need to reduce CSS size
```

**Creating Custom Utilities:**
```scss
// In style.scss, after imports
.bg-brand {
  background-color: $primary-shade !important;
}

.text-brand {
  color: $primary-shade !important;
}

// Or extend Bootstrap's utility API in import.scss
$utilities: map-merge(
  $utilities,
  (
    "brand-color": (
      property: color,
      class: text-brand,
      values: (
        primary: $primary-shade,
        accent: $accent-shade
      )
    )
  )
);
```

#### SASS Best Practices

1. **Always Override Variables Before Importing Bootstrap**
   - Edit `variables.scss` and `typography.scss` first
   - Never edit files in `node_modules/bootstrap/`

2. **Use Bootstrap Functions**
   ```scss
   // Available after importing functions
   tint-color($color, $weight)    // Lighten color
   shade-color($color, $weight)   // Darken color
   shift-color($color, $weight)   // Shift color
   ```

3. **Test Compilation Frequently**
   - Run `gulp styles` after variable changes
   - Check browser console for SASS errors
   - Watch terminal output for compilation issues

4. **Leverage Bootstrap Mixins**
   ```scss
   // Media query mixin
   @include media-breakpoint-up(md) {
     .custom-class { font-size: 1.5rem; }
   }

   // Responsive spacing
   @include make-container();
   ```

5. **Keep Custom Styles in `style.scss`**
   - `import.scss` is for Bootstrap orchestration only
   - `style.scss` is for your custom CSS rules
   - Component-specific styles go in `components/[name]/[name].css`

#### Troubleshooting

**SASS Won't Compile:**
- Check `import.scss` variable order (functions → your vars → Bootstrap vars)
- Ensure node_modules is installed: `npm install`
- Verify Bootstrap version matches: `npm list bootstrap`

**Styles Not Applying:**
- Clear Drupal cache: `drush cr`
- Hard refresh browser: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
- Check library definition in `newworks.libraries.yml`

**Variable Override Not Working:**
- Verify override is BEFORE Bootstrap variable import in `import.scss`
- Check for `!default` flag (Bootstrap vars have it, yours shouldn't)
- Ensure variable name exactly matches Bootstrap's variable name

### JavaScript Development

#### Library Definition
Define JavaScript libraries in `newworks.libraries.yml`:

```yaml
component-name:
  version: VERSION
  js:
    components/component-name/component-name.js: {}
  dependencies:
    - core/jquery
    - core/drupal
```

#### JavaScript Patterns
```javascript
(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.componentName = {
    attach: function (context, settings) {
      // Use 'context' for proper Drupal AJAX handling
      $('.selector', context).once('component-name').each(function() {
        // Component logic
      });
    }
  };

})(jQuery, Drupal, drupalSettings);
```

**Key Points:**
- Always use Drupal.behaviors pattern
- Use `.once()` to prevent re-initialization
- Respect `context` parameter for AJAX compatibility
- Access settings via `drupalSettings`

### Configuration

#### Theme Settings Override
Modify theme settings in `newworks.theme`:

```php
function newworks_form_system_theme_settings_alter(&$form, FormStateInterface $form_state) {
  // Override Barrio settings with custom options
  $form['components']['navbar']['bootstrap_barrio_navbar_background']['#options'] = [
    'bg-primary' => t('Primary'),
    'bg-secondary' => t('Secondary'),
    // ...
  ];
}
```

#### Regions
Available regions (defined in `newworks.info.yml`):
- top_header, header, primary_menu, secondary_menu
- content, sidebar_first, sidebar_second
- breadcrumb, highlighted, page_top, page_bottom
- featured_top, featured_bottom_first/second/third
- footer_first through footer_fifth

### Bootstrap Barrio Features

#### Layouts
Barrio provides Bootstrap-based layouts via Layout Discovery:
- Card layouts (various formats)
- Media layouts
- Column layouts: 2-column (6-6, 3-9, 9-3), 3-column (4-4-4), 4-column (3-3-3-3)
- Works with Layout Builder, Display Suite, and other layout consumers

#### Bootstrap Library Loading
Options for loading Bootstrap:
1. **CDN** - Via Bootstrap Library module
2. **Local** - Automatically from node_modules (recommended)

#### Navbar Configuration
- Top navbar and main navbar separately configurable
- Background color options via theme settings
- Support for offcanvas mobile menu (Bootstrap 5)
- Flyout submenus for multi-level navigation

### Common Patterns

#### Paragraph Integration
```twig
{# In paragraph template #}
{% include '@newworks/component-name/component-name.twig' with {
  'prop_name': content.field_name|render|striptags|trim,
  'prop_name2': content.field_name2,
} %}
```

#### Views Templates
```twig
{# views-view--view-id--display-id.html.twig #}
<div class="row g-4">
  {% for row in rows %}
    <div class="col-md-4">
      {{ row.content }}
    </div>
  {% endfor %}
</div>
```

#### Image Handling
```twig
{% if content.field_image|render %}
  <img src="{{ file_url(content.field_image['#items'].entity.uri.value) }}"
       alt="{{ content.field_image['#items'].alt }}"
       class="img-fluid rounded">
{% endif %}
```

### Development Workflow

#### Making Changes

1. **Component Changes:**
   - Edit component files in `components/[component-name]/`
   - Run `drush cr` to clear cache after component.yml changes
   - Test component rendering in content

2. **Style Changes:**
   - Modify SASS files in `scss/`
   - Run `gulp watch` for automatic compilation
   - Changes appear in `css/style.css`

3. **Template Changes:**
   - Edit Twig files in `templates/`
   - Clear cache: `drush cr`
   - Twig debug mode helps identify template suggestions

4. **JavaScript Changes:**
   - Edit JS files
   - Define/update library in `newworks.libraries.yml`
   - Clear cache and hard-refresh browser

#### Debugging

**Enable Twig Debugging:**
```yaml
# sites/default/services.yml
parameters:
  twig.config:
    debug: true
    auto_reload: true
    cache: false
```

**Common Drush Commands:**
```bash
drush cr                  # Clear all caches
drush theme:enable newworks  # Enable theme
drush config:export       # Export configuration
```

### Bootstrap 5 Specifics

#### Key Changes from Bootstrap 4
- jQuery removed (5.5.7+) - use vanilla JS or declare jQuery dependency
- `.ms-*` / `.me-*` instead of `.ml-*` / `.mr-*`
- `.text-start` / `.text-end` instead of `.text-left` / `.text-right`
- Offcanvas component for mobile menus
- Updated form controls and components

#### Utility Classes (Use These!)
- Spacing: `m-{0-5}`, `p-{0-5}`, `mt-auto`, `mb-3`, `px-4`
- Flexbox: `d-flex`, `align-items-center`, `justify-content-between`
- Sizing: `w-100`, `h-100`, `mw-100`, `min-vh-100`
- Display: `d-none`, `d-md-block`, `d-lg-flex`
- Colors: `text-primary`, `bg-light`, `text-white`
- Borders: `rounded`, `rounded-4`, `border-0`
- Shadows: `shadow`, `shadow-sm`, `shadow-lg`

### Tips for AI Assistance

When asking for help:
1. **Specify component type**: "Create a Bootstrap 5 card component"
2. **Mention SDC pattern**: "Following the Single Directory Component structure"
3. **Include Bootstrap version**: "Using Bootstrap 5 utilities"
4. **Reference Barrio**: "Compatible with Bootstrap Barrio base theme"
5. **Mention Drupal version**: Working with Drupal 9/10/11

### Resources

- **Bootstrap Documentation**: https://getbootstrap.com/docs/5.3/
- **Barrio Theme Guide**: https://www.drupal.org/docs/contributed-themes/barrio-bootstrap-45-drupal-89-theme
- **Drupal Theming**: https://www.drupal.org/docs/theming-drupal
- **Twig Documentation**: https://twig.symfony.com/doc/

---

## Installation

1. Place theme in `/themes/custom/newworks/`
2. Install dependencies: `npm install`
3. Compile SASS: `gulp styles`
4. Enable theme: `drush theme:enable newworks`
5. Set as default: `drush config:set system.theme default newworks`

## Development

```bash
# Watch for changes
gulp watch

# Compile styles
gulp styles

# Browser sync (if configured)
gulp serve
```
