# Project Rules and Design Decisions

## Data Management
1. All character data must be maintained in the Character class
2. View classes should only handle display logic, not store state
3. Data should be stored in pips internally, converted to dice notation only for display

## Class Responsibilities
### Character
- Stores all character data
- Handles stat calculations
- Provides methods to access and modify character data

### View Classes (StatRow, StatModifierRow, etc.)
- Handle DOM manipulation
- Display data in the correct format
- Must not store duplicates of character data
