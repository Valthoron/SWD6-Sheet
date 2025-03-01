# Project Rules and Design Decisions

## Data Management
1. All character data must be maintained in the Character class
2. View classes should only handle display logic, not store state
3. Data should be stored in pips internally, converted to dice notation only for display

## File Placement Guidelines
1. Each class should be in its own file, named after the class
2. Utility functions should be grouped by purpose
3. Data files should be in the data directory
4. CSS files should be in the css directory
5. Place new view components in the views directory
6. Place new model classes in the models directory

## Coding Standards
1. Follow single responsibility principle - each file should have one primary purpose
2. Keep files small and focused
3. Use consistent naming conventions:
   - PascalCase for class names
   - camelCase for functions and variables
   - camelCase for file names (except class files)
   - PascalCase for class file names
4. Keep main app.js file as a coordinator that uses classes/functions from other files

## Class Responsibilities
### Character
- Stores all character data
- Handles stat calculations
- Provides methods to access and modify character data

### View Classes (StatRow, StatModifierRow, etc.)
- Handle DOM manipulation
- Display data in the correct format
- Must not store duplicates of character data
