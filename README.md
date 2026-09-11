# RYM Autotags and Release Page Enhancer

Tagging a release on RateYourMusic means digging through a huge genre tree and typing out every parent genre by hand — and the "My Catalog" panel (rating, tags, labels, list, catalog status...) is scattered in a bunch of separate boxes below the tracklist. This userscript (+ companion style) fixes both.

It auto-generates a full tag list from the genres already assigned to the release (adding every relevant parent/related genre automatically), and merges the whole "My Catalog" panel directly into the release info table for a much more compact page.

## What it does

- **Autotags releases**: reads the Primary (and optionally Secondary) genres already set on the release, then walks a large genre-relationship map to add every relevant parent/related tag (e.g. tagging `black metal` also adds `metal`; tagging a Drill subgenre adds `drill`, `hip hop`, etc.), plus the release year, then saves the tag field automatically
- Adds three quick-action buttons next to the catalog block: **Primary**, **Pri + Sec**, and **Exclude from upcomings**
- Merges the "My Catalog" panel (rating, tags, labels, list, catalog/format, listens/review/misc) into the `album_info` table instead of leaving it in a separate section below
- Pulls in release **labels** (with issue counts) next to the catalog info
- Companion userstyle trims dead space, removes clutter (buy button, prev/next nav, section headers) and tightens up the tracklist/credits layout for a denser, more compact release page

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/).
2. [Click here to install the script](https://raw.githubusercontent.com/bbmane/rym-release-page-enhancer/main/rym-release-page-enhancer.user.js).
3. Install a userstyle manager such as [Stylus](https://add0n.com/stylus.html).
4. [click here to install the companion style](https://raw.githubusercontent.com/bbmane/rym-release-page-enhancer/main/rym-release-page-enhancer.user.css).
5. Visit any RateYourMusic release page — the extra buttons and merged catalog panel will appear automatically.

## Notes

- The genre map is opinionated and reflects RYM's official genre hierarchy at the time of writing; it may need occasional updates as RYM adds or reorganizes genres.
