## ADDED Requirements

### Requirement: Centered article layout without sidebar

The post page SHALL render a single-column centered layout with `max-w-3xl` containing the article content. The sidebar SHALL be removed entirely. The layout SHALL be responsive: full-width on mobile, centered on desktop.

#### Scenario: Article renders centered

- **WHEN** a user navigates to `/posts/<slug>`
- **THEN** the article SHALL be rendered in a centered column with no sidebar

### Requirement: Reading progress bar

A thin horizontal progress bar SHALL appear fixed at the top of the viewport (`z-50`). Its width SHALL represent the scroll progress through the article (0% at top, 100% at bottom). The bar SHALL use the `foreground` color.

#### Scenario: Progress updates on scroll

- **WHEN** the user scrolls through an article
- **THEN** the progress bar width SHALL update proportionally to the scroll position

#### Scenario: Progress resets on new page

- **WHEN** the user navigates to a different article
- **THEN** the progress bar SHALL reset to 0%

### Requirement: Collapsible table of contents

A table of contents SHALL render as a horizontal bar showing the current active heading. When clicked, it SHALL expand to show the full list of headings (`##` and `###` levels). Each heading SHALL link via smooth scroll to its corresponding section. The active heading SHALL update as the user scrolls via `IntersectionObserver`.

#### Scenario: TOC shows active heading

- **WHEN** the user scrolls through an article
- **THEN** the TOC SHALL highlight the currently visible heading

#### Scenario: TOC expands on click

- **WHEN** the user clicks the TOC bar
- **THEN** the full list of headings SHALL be displayed

#### Scenario: TOC click scrolls to heading

- **WHEN** the user clicks a heading in the expanded TOC
- **THEN** the page SHALL smooth-scroll to that heading's section

### Requirement: Enhanced code blocks

Every fenced code block SHALL display a header bar containing the language badge (e.g., `TS`, `TSX`, `BASH`) and a copy button. Clicking the copy button SHALL copy the code content to the clipboard and show "Copied!" feedback for 2 seconds. The code block SHALL be implemented via a custom `rehype-code-block` plugin operating on the rehype AST.

#### Scenario: Code block renders with header

- **WHEN** a markdown fenced code block with a language tag is rendered
- **THEN** the output SHALL show a header bar with the language badge

#### Scenario: Copy button copies code

- **WHEN** the user clicks the copy button on a code block
- **THEN** the code content SHALL be copied to the clipboard and the button SHALL show "Copied!" for 2 seconds

### Requirement: Image lightbox

All images and GIFs in the article content SHALL be clickable. Clicking SHALL open a full-viewport overlay with the image centered at its maximum size (up to `90vh`). Clicking outside the image or pressing Escape SHALL close the overlay. The overlay SHALL have a semi-transparent backdrop.

#### Scenario: Image opens lightbox on click

- **WHEN** the user clicks an image in the article
- **THEN** a full-viewport overlay SHALL display the image centered and enlarged

#### Scenario: Lightbox closes on Escape

- **WHEN** the lightbox is open and the user presses Escape
- **THEN** the lightbox SHALL close

### Requirement: Reading time display

The article header SHALL display an estimated reading time calculated from the word count divided by 200 words per minute, rounded up to a minimum of 1 minute.

#### Scenario: Reading time shows correct estimate

- **WHEN** an article with 400 words is rendered
- **THEN** the reading time SHALL display "2 min de lectura"

### Requirement: Author bio at article end

The bottom of each article SHALL display an author bio card with the author's avatar, name, a short description, and links to LinkedIn, GitHub, and Twitter. It SHALL be separated from the article body by a horizontal rule.

#### Scenario: Author bio renders

- **WHEN** the user scrolls to the end of an article
- **THEN** an author bio card SHALL be visible below a horizontal separator

### Requirement: Related posts

The bottom of each article SHALL display up to 3 related posts selected by shared tags. If no posts share tags, the 3 most recent posts SHALL be displayed. Each card SHALL show a small image, title, and date in a responsive grid.

#### Scenario: Related posts show by tag match

- **WHEN** the current article has tags `[react, hooks]` and another article has tag `react`
- **THEN** the other article SHALL appear in the related posts section

#### Scenario: Related posts fallback to recent

- **WHEN** no other posts share tags with the current article
- **THEN** the 3 most recent posts SHALL be displayed

### Requirement: Previous/Next post navigation

The article footer SHALL display Previous and Next links based on chronological ordering (by date). If there is no previous or next post, the corresponding link SHALL be hidden. Each link SHALL display the post title and date.

#### Scenario: Prev/Next links navigate chronologically

- **WHEN** viewing the second oldest post of 3
- **THEN** "Previous" SHALL link to the newest post and "Next" SHALL link to the oldest post

#### Scenario: No next link for most recent post

- **WHEN** viewing the most recent post
- **THEN** the "Next" link SHALL be hidden
