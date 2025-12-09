---
title: Advanced Slides Guide
description: Complete guide to creating beautiful presentations with Obsidian Advanced Slides and Reveal.js
category: Obsidian Plugins
order: 12
version: 1.0.0
lastModified: 2025-12-09
hideCoverImage: false
hideTOC: false
draft: false
featured: true
---

Create stunning, interactive presentations directly from your Obsidian notes using the Advanced Slides plugin and Reveal.js.

## What is Advanced Slides?

**Advanced Slides** is an Obsidian plugin that transforms your markdown notes into beautiful presentations powered by [Reveal.js](https://revealjs.com/). It combines the simplicity of markdown with the power of professional presentation software.

### Key Features

- 📝 **Write in Markdown** - Use familiar syntax
- 🎨 **11 Beautiful Themes** - Professional designs out of the box
- ✨ **Rich Animations** - Fragment animations and transitions
- 💻 **Code Highlighting** - Syntax highlighting for all languages
- 🎤 **Speaker Notes** - Private notes only you can see
- 📱 **Responsive Design** - Works on all devices
- 🌐 **Web Publishing** - Share online instantly

## Quick Start

### Installation

1. Open Obsidian Settings
2. Navigate to Community Plugins
3. Search for "Advanced Slides"
4. Install and enable the plugin

### Create Your First Slide

1. Create a new note in your `slides/` folder
2. Add frontmatter configuration:

```yaml
---
title: "My First Presentation"
theme: "night"
transition: "slide"
---
```

3. Create slides using sections:

```html
<section>

# Welcome

My first slide!

</section>

---

<section>

## Second Slide

More content here.

</section>
```

4. Preview in Obsidian or view on your website at `/slides/`

## Slide Structure

### Frontmatter Configuration

Essential configuration at the top of your file:

```yaml
---
title: "Presentation Title"
description: "Brief description"
date: 2025-12-09
author: "Your Name"
tags: ["presentation", "demo"]
theme: "night"
transition: "slide"
backgroundTransition: "fade"
controls: true
progress: true
slideNumber: true
center: true
draft: false
---
```

### Slide Separators

**Horizontal slides (→):**
```html
<section>
First slide
</section>

---

<section>
Second slide
</section>
```

**Vertical slides (↓):**
```html
<section>
  <section>
    Parent slide
  </section>

  <section>
    Child slide (navigate down)
  </section>
</section>
```

## Themes

Choose from 11 professional themes:

| Theme | Style | Best For |
|-------|-------|----------|
| **night** ⭐ | Dark blue | Professional talks |
| **black** | Classic dark | Technical presentations |
| **white** | Clean light | Business meetings |
| **league** | Blue-gray | Corporate events |
| **beige** | Warm neutral | Academic talks |
| **sky** | Bright blue | Creative pitches |
| **serif** | Elegant serif | Formal presentations |
| **simple** | Minimalist | Clean design focus |
| **solarized** | Eye-friendly | Long presentations |
| **blood** | High contrast | Bold statements |
| **moon** | Deep blue | Night mode friendly |

Change theme in frontmatter:
```yaml
theme: "sky"
```

## Transitions

Add smooth animations between slides:

### Slide Transitions

```yaml
transition: "slide"  # Options: none, fade, slide, convex, concave, zoom
```

**Available transitions:**
- `slide` - Classic sliding (most common)
- `fade` - Smooth fade in/out
- `convex` - 3D convex effect
- `concave` - 3D concave effect
- `zoom` - Zoom in/out
- `none` - Instant switch

### Background Transitions

```yaml
backgroundTransition: "fade"
```

Separate transition for background changes.

## Fragment Animations

Reveal content progressively:

```html
<section>

## Progressive Reveal

<div class="fragment">
First point appears
</div>

<div class="fragment">
Then second point
</div>

<div class="fragment">
Finally third point
</div>

</section>
```

### Fragment Effects

```html
<div class="fragment fade-in">Fade in</div>
<div class="fragment fade-out">Fade out</div>
<div class="fragment highlight-red">Highlight red</div>
<div class="fragment highlight-blue">Highlight blue</div>
<div class="fragment grow">Grow</div>
<div class="fragment shrink">Shrink</div>
```

## Layouts

### Two-Column Layout

```html
<div class="two-columns">

<div>
Left column content
</div>

<div>
Right column content
</div>

</div>
```

### Three-Column Layout

```html
<div class="three-columns">
  <div>First column</div>
  <div>Second column</div>
  <div>Third column</div>
</div>
```

### Grid Layout

```html
<div class="grid grid-2">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
  <div class="card">Item 4</div>
</div>
```

## Styled Boxes

Add visual emphasis with colored boxes:

```html
<div class="highlight-box">
💡 Important information
</div>

<div class="warning-box">
⚠️ Warning or caution
</div>

<div class="success-box">
✅ Success message
</div>

<div class="error-box">
❌ Error or problem
</div>
```

## Code Blocks

Syntax highlighting for all major languages:

### JavaScript

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

### Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

### With Line Highlighting

```javascript {2,4-6}
function processData(data) {
  // This line is highlighted
  const result = [];
  for (let item of data) {
    result.push(item * 2);
  }
  return result;
}
```

## Speaker Notes

Add private notes only visible to you:

```html
<section>

## Public Content

Audience sees this.

<aside class="notes">
  Private notes for the speaker.
  Talking points and reminders.
  Press 'S' to open speaker view.
</aside>

</section>
```

**Open speaker notes:** Press `S` during presentation

## Keyboard Shortcuts

### Navigation
- `→` `↓` - Next slide
- `←` `↑` - Previous slide
- `Home` - First slide
- `End` - Last slide
- `Space` - Next slide

### Controls
- `F` - Fullscreen mode
- `S` - Speaker notes view
- `Esc` - Thumbnail overview
- `B` / `.` - Pause/blackout
- `?` - Show help

### Advanced
- `Alt+Click` - Zoom in
- `Ctrl+Shift+F` - Search
- `N` - Next slide (space alternative)

## Complete Workflow

### 1. Create in Obsidian

```markdown
1. Open slides/ folder in Obsidian
2. Create new .md file
3. Add frontmatter configuration
4. Write content using markdown
5. Use Templater for quick setup
```

### 2. Structure Content

```html
<section class="center">
# Title Slide
## Subtitle
</section>

---

<section>
## Content Slide

<div class="two-columns">
<div>Point 1</div>
<div>Point 2</div>
</div>

</section>
```

### 3. Preview and Refine

- Use Advanced Slides plugin in Obsidian
- Check layout and animations
- Add speaker notes
- Test navigation

### 4. Publish to Web

- Save file (auto-commits to git)
- Website deploys automatically
- Access at `/slides/your-file-name`
- Share the URL

## Live Demo

Experience Advanced Slides in action with our interactive tutorial:

### 📊 Interactive Tutorial Presentation

<div style="border: 2px solid #42affa; border-radius: 8px; padding: 16px; margin: 24px 0; background: rgba(66, 175, 250, 0.05);">
  <h4 style="margin-top: 0;">🎬 Complete Advanced Slides Tutorial</h4>
  <p>View our comprehensive tutorial covering:</p>
  <ul>
    <li>All 11 themes with live examples</li>
    <li>Transition and animation effects</li>
    <li>Layout systems and grid designs</li>
    <li>Fragment animations and timing</li>
    <li>Speaker notes and keyboard shortcuts</li>
    <li>Best practices and tips</li>
  </ul>
  <a href="/slides/advanced-slides-tutorial" target="_blank" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #42affa 0%, #3498db 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 8px;">
    🎯 Open Tutorial Presentation →
  </a>
  <p style="margin-bottom: 0; margin-top: 12px; font-size: 0.9em; color: #666;">
    💡 Tip: Use arrow keys to navigate, <kbd>F</kbd> for fullscreen
  </p>
</div>

### More Examples

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin: 24px 0;">
  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;">
    <h4 style="margin-top: 0;">🔌 Obsidian Integration</h4>
    <p style="font-size: 0.9em;">Complete overview of all Obsidian plugins integration</p>
    <a href="/slides/obsidian-integration" style="color: #42affa; text-decoration: none; font-weight: 600;">View Presentation →</a>
  </div>

  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;">
    <h4 style="margin-top: 0;">📊 Dataview Demo</h4>
    <p style="font-size: 0.9em;">Comprehensive Dataview plugin demonstration</p>
    <a href="/slides/dataview-demo" style="color: #42affa; text-decoration: none; font-weight: 600;">View Presentation →</a>
  </div>
</div>

### Embed Live Demo

See a presentation embedded directly in this page:

<div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 24px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <iframe
    src="/slides/advanced-slides-tutorial"
    width="100%"
    height="600px"
    frameborder="0"
    allow="fullscreen"
    style="display: block;"
  ></iframe>
</div>

## Best Practices

### Content Design

**Do:**
- ✅ One main point per slide
- ✅ Use fragments for progressive reveal
- ✅ Include visual elements
- ✅ Keep text concise
- ✅ Maintain consistent style

**Don't:**
- ❌ Overcrowd slides with text
- ❌ Use tiny fonts
- ❌ Mix too many colors
- ❌ Skip logical structure
- ❌ Forget speaker notes

### Presentation Tips

1. **Start Strong** - Grab attention immediately
2. **Clear Structure** - Logical flow
3. **Visual Consistency** - Unified design
4. **Interactive Elements** - Engage audience
5. **Strong Ending** - Memorable conclusion

### Technical Preparation

- 📱 Test on different devices
- 🌐 Check browser compatibility
- 🎤 Prepare speaker notes
- 💾 Backup locally
- 🔗 Share URLs in advance

## Advanced Features

### Custom CSS

Add custom styling:

```html
<section>

<style>
.custom-style {
  color: #42affa;
  font-size: 1.5em;
}
</style>

<div class="custom-style">
Styled content
</div>

</section>
```

### Background Images

```html
<section data-background-image="image.jpg">
Content over image
</section>
```

### Background Videos

```html
<section data-background-video="video.mp4">
Content over video
</section>
```

### Auto-Animate

```html
<section data-auto-animate>
<h3>Before</h3>
</section>

<section data-auto-animate>
<h3>After</h3>
<p>Added content</p>
</section>
```

## Troubleshooting

### Common Issues

**Slides not displaying:**
- Check section tags are properly closed
- Verify frontmatter syntax
- Confirm theme name is valid

**Styles not working:**
- Check CSS class names
- Verify HTML structure
- View browser console for errors

**Navigation problems:**
- Test keyboard shortcuts
- Check slide structure
- Verify no broken links

### Debugging Tips

1. **Simplify** - Start with basic slide
2. **Add gradually** - One feature at a time
3. **Check syntax** - Validate HTML/Markdown
4. **Reference examples** - Look at working presentations
5. **Browser tools** - Use F12 dev tools

## Resources

### Official Documentation

- [Reveal.js Official Site](https://revealjs.com/)
- [Reveal.js Demo](https://revealjs.com/demo/)
- [Advanced Slides GitHub](https://github.com/MSzturc/obsidian-advanced-slides)

### Templates

In your vault:
- `template/slides/templater-template.md` - Slide template
- `docs/obsidian-integration-examples.md` - Full documentation

### Community

- Obsidian Forum
- Discord Community
- GitHub Issues
- YouTube Tutorials

## Next Steps

1. **Install** Advanced Slides plugin
2. **Create** first presentation using template
3. **Experiment** with themes and layouts
4. **Practice** with demo presentations
5. **Share** your presentations online

Start creating beautiful presentations today!

---

*Ready to present like a pro? Start with Advanced Slides and Reveal.js!*
