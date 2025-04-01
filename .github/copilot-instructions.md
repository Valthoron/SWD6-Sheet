# Design Decisions
## Data Management Principles
- Modified MVC pattern with combined view controllers
- Stats stored in pips internally, converted to dice notation for display

## Character Class
- Stores all character data
- Handles stat calculations
- Provides methods to access and modify character data

## View Controllers
- Handle DOM manipulation and display logic
- Manage UI interactions and user events
- Communicate directly with models
- Must not store duplicates of character data or application state

# Project Structure and Conventions
## Code Placement
- Classes with non-trivial functionality should be in their own files, named after the class
- Classes with small, trivial, boilerplate or barebones functionality can be grouped by purpose in the same file, named appropriately for purpose
- Utility functions should be grouped by purpose

## Style Sheet Placement
- All styles should be in css/styles.css
- Sort style lines within each class in ascending order
- Keep relevant classes together, sorted from least specific to most specific

## File Placement
- Models should be in the models directory, named <model>.js
- Views should be either in the views directory, or placed as templates in index.html
- Controllers should be in the controllers directory, named <view>.js
- Data files should be in the data directory

## Coding
- Follow single responsibility principle (e.g., each view controller handles only one UI component)
- Keep files small and focused
- Keep main app.js file as a coordinator that uses classes/functions from other files
- Prefer to add new elements in HTML, unless dynamic instantiation is a requirement
- Prefer guard clauses and early returns when generating functions with multiple return paths or null checks
- Never trust operator precedence, use parentheses to clarify order of operations
- When using logical operators with comparison operators, always wrap each comparison in its own set of parentheses

## Naming and Syntax
- camelCase for file names (except class files)
- PascalCase for class file names
- PascalCase for class names
- camelCase for functions and variables
- kebab-case for CSS classes
- kebab-case for HTML element id's
- Use BEM methodology for CSS class naming (Block__Element--Modifier)
- Prefer double quotes (") over single quotes (') whenever possible and valid
- Prefix private methods and properties with hash mark (#)
- Prefix protected methods and properties with underscore (_)
- Use descriptive, action-oriented names for event handlers (e.g., handleStatChange)
- Don't shorten names unless established by the project (e.g. text not txt, button not btn)

## Comments
- Write comments for lines or code sections only when they are not self-explanatory, complicated or non-intuitive
- Comments should be concise but but explanatory
- Comments regarding functions/methods should be below the function/method name, inside the scope braces
- Don't write placeholder comments for removed code
- Prefer per-line commenting (//) instead of comment blocks (/* */) for JavaScript

## Error Handling
- Use try-catch blocks for operations that may fail
- Provide meaningful error messages that help diagnose issues
- Implement graceful degradation when features cannot function
- Log errors to console with appropriate severity levels
- Consider user-facing error messages for critical failures
