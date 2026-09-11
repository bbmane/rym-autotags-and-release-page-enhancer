# RYM Genre Autotags and Release Page Enhancer

My lazy a** was very tired of typing out every parent genre by hand — and I just hated how the "My Catalog" panel (rating, tags, labels, list, catalog status...) was scattered in a bunch of separate boxes below the tracklist. This userscript (+ companion style) fixes both.

It auto-generates a full tag list from the genres already assigned to the release (adding every relevant parent/related genre automatically), and merges the whole "My Catalog" panel directly into the release info table for a much more compact page.

## How does it look

![What it does](https://i.imgur.com/Y7DgbJM.png)

## What it does

- **Autotags releases**: reads the Primary (and optionally Secondary) genres already set on the release, then walks a large genre-relationship map to add every relevant parent/related tag (e.g. tagging `math pop` also adds `math rock` and `indie rock` cause nested in both; `indie rock` also adds `alternative rock` cause nested in it and so on), plus the release year, then saves the tag field automatically

  ![What it does](https://i.imgur.com/aQ5qMFS.gif)

> [!WARNING]
> The autotag buttons **overwrite** the current Tags field and save it immediately — there's no confirmation step.

> [!TIP]
> If you have hand-tweaked tags, run autotag first and adjust manually afterwards, not the other way around.

> [!NOTE]
> The genre map reflects RYM's official genre hierarchy at the time of writing; since it's hard-coded into the script, it will need occasional updates as RYM adds or reorganizes genres.
> 
> Some of the biggest parent genres (`rock`, `metal`, `electronic`, `regional music`) are excluded by choice. `Scenes and movements` are excluded too.
>
> Of course if an album has "incorrect" genre tags, the autotags will reflect that.
  
- Merges the "My Catalog" panel (rating, tags, labels, list, catalog/format, listens/review/misc) into the `album_info` table instead of leaving it in a separate section below
- Pulls in release **labels** (with issue counts) next to the catalog info
- Companion userstyle trims dead space, removes clutter (buy button, prev/next nav, section headers), fixes the truncation of list names and tightens up the tracklist/credits layout for a denser, more compact release page

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/).
2. [Click here to install the script](https://raw.githubusercontent.com/bbmane/rym-autotags-and-release-page-enhancer/main/main.user.js).
3. Install a userstyle manager such as [Stylus](https://add0n.com/stylus.html).
4. [Click here to install the companion style](https://raw.githubusercontent.com/bbmane/rym-autotags-and-release-page-enhancer/main/main.user.css).
5. Visit any RateYourMusic release page — the extra buttons and merged catalog panel will appear automatically.
