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
├── style.scss        # Main entry point
├── variables.scss    # Bootstrap variable overrides
├── mixins.scss       # Custom mixins
├── typography.scss   # Typography styles
└── import.scss       # Additional imports
```

#### Bootstrap Integration
The theme uses Bootstrap 5 SASS source for customization:
- Variables are overridden in `variables.scss`
- Bootstrap is imported from `node_modules/bootstrap/scss`
- PostCSS processes: autoprefixer, px-to-rem, inline-svg

#### Build Commands
```bash
# Install dependencies
npm install

# Watch and compile SASS
gulp watch

# Build production CSS
gulp styles
```

#### SASS Best Practices
- Override Bootstrap variables before importing Bootstrap
- Use Bootstrap mixins and functions
- Reference Barrio base theme SASS: `../../contrib/bootstrap_barrio/scss`
- Utilize Bootstrap utility classes instead of custom CSS when possible

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
