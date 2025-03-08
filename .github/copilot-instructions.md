# Design Decisions
## Data Management
- Modified MVC pattern with combined view controllers
- All character data must be maintained in the Character class
- View controllers handle both display logic and UI interactions, don't store state
- Stats should be stored in pips internally, converted to dice notation only for display

## Class Responsibilities
### Character
- Stores all character data
- Handles stat calculations
- Provides methods to access and modify character data

### View Classes (StatRow, StatModifierRow, etc.)
- Handle DOM manipulation and display logic
- Manage UI interactions and user events
- Communicate directly with models
- Must not store duplicates of character data
- Display data in the correct format

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
- Models shouls be in the models directory, named <model>.js
- Views should be either in the views directory, or placed as templates in index.html
- Controllers should be in the controllers directory, named <view>.js
- Data files should be in the data directory

## Coding
- Follow single responsibility principle
- Each view controller handles one UI component
- Keep files small and focused
- Keep main app.js file as a coordinator that uses classes/functions from other files
- Prefer to add new elements in HTML, unless dynamic instantiation is a requirement

## Naming
- PascalCase for class names
- camelCase for functions and variables
- camelCase for file names (except class files)
- PascalCase for class file names
- kebab-case for CSS classes
- kebab-case for HTML element id's
- Use BEM methodology for CSS class naming (Block__Element--Modifier)
- Prefix private methods and properties with hash mark (#)
- Prefix protected methods and properties with underscore (_)
- Use descriptive, action-oriented names for event handlers (e.g., handleStatChange)

## Comments
- Write short but explanatory comments for each function and code section you generate
- Don't write comments for single lines where simply reading the code is just as good as reading the comment
- Only write comments for single lines if that line is complicated to read, or performs a non-intuitive task
- Comments regarding functions/methods should be below the function/method name, inside the scope braces
- Don't write placeholder comments for removed code
- Use single-line comments instead of comment blocks unless strictly necessary

## Error Handling
- Use try-catch blocks for operations that may fail
- Provide meaningful error messages that help diagnose issues
- Implement graceful degradation when features cannot function
- Log errors to console with appropriate severity levels
- Consider user-facing error messages for critical failures
