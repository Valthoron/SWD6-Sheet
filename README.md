# Star Wars D6 Character Sheet
A character sheet manager for the Star Wars D6 roleplaying game system by West End Games. Can run as a desktop app on in a browser.

[![CodeFactor](https://www.codefactor.io/repository/github/valthoron/swd6-sheet/badge)](https://www.codefactor.io/repository/github/valthoron/swd6-sheet)

## Installation
## Notice on Fonts
The sheet currently uses the fonts "Tw Cen MT" and "Segoe UI", that cannot be distributed as part of this repository. You will need to have these fonts installed in your system or put them in the `fonts` directory, and modify `css/fonts.css` accordingly. The sheet layout may be incorrect without them.

### Option 1: Run as desktop application
Install dependencies and run:
```bash
npm install
npm start
```
To build a distributable version:
```bash
npm run build
```
The app will be available under the `dist` directory.

### Option 2: Run in browser
Host the app locally, using Node.js or Python:

```bash
# Node.js
npx http-server -p 8080
```
```bash
# Python 3
python -m http.server 8080
```

Then open your browser to http://localhost:8080/html/editor.html. Change the port number to anything else if it's occupied on your machine.

## Licensing
This program is free software: you can redistribute it and/or modify it under the terms of the [GNU General Public License](http://www.gnu.org/licenses/gpl-3.0.html) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
