Changes needs to be made on Create Quiz page on how question are created and what types of question are created and how the will they be displayed when user attempts the quiz. Below I have provided the details explanation.

1. Changes for Create Quiz Page--
2. How Questions are actually Displayed When user is attempting the Quiz--

--Changes for Create Quiz Page--

To make your Create Quiz page functional for these complex Azure-style questions, the user interface needs to adapt based on the Question Type selected.

When a user clicks "Add Question," they should first see a Dropdown to select Question Type. Once selected, the input fields below should change to match that specific format.

Here is the logic for how a user will provide questions, options, and correct answers for each type:

1. Yes/No Statement Grid
Question Input: A standard text box for the main instruction (e.g., "Select Yes if the statement is true, otherwise select No").

Adding Statements: An "Add Statement" button. Clicking this adds a new row with a text field for the statement.

Marking the Answer: Each statement row has two radio buttons: [ Yes ] and [ No ]. The user must click one to set the correct answer for that specific statement.

2. Drag & Drop: Matching (Term to Definition)
Question Input: Main instruction text (e.g., "Match the cloud concept to its description").

Adding Pairs: An "Add Pair" button. Clicking this creates a row with two side-by-side text fields:

Source Field: To enter the "Draggable Term" (e.g., "Low Latency").

Target Field: To enter the "Correct Definition" it belongs to.

Marking the Answer: By filling them in pairs, the system automatically knows which term belongs to which box. When the quiz is played, the system will shuffle the "Draggable Terms" for the student.

3. Drag & Drop: Classification (Many to Few)
Question Input: Instruction (e.g., "Which of these are US Government entities?").

Setting Categories: A section called "Target Categories" with an "Add Category" button (e.g., user adds "US Entity" and "European Entity").

Adding Options: An "Add Option" button. Each option has a text field and a Dropdown next to it to select which "Target Category" it belongs to.

Marking the Answer: The category selected in that dropdown becomes the correct answer for that item.

4. Inline Dropdown (Sentence Completion)
Question Input: A large text area where the user writes the full sentence. To create a dropdown, they use a placeholder like [select].

Configuration: For every [select] placeholder used in the text, a small configuration block appears below:

Option Fields: User adds multiple choices for that specific dropdown.

Correct Answer: A Radio Button next to the choice to mark it as correct.

5. Matching Dropdown (Term to Category)
Question Input: Main instruction.

Adding Rows: An "Add Row" button. Each row has:

Static Text Field: (e.g., "Azure Virtual Machines").

Options List: An "Add Option" button specific to this row to create the dropdown choices (e.g., IaaS, PaaS, SaaS).

Correct Answer: A Radio Button next to one of those options to mark it as correct.

UI/UX Rules for the Creator Page:
Validation: The "Add Quiz" button should remain disabled (greyed out) until every question has at least one correct answer marked.

Preview Mode: Add a small "Eye" icon on each question block so the creator can see exactly how the question will look to the student before saving.

Reordering: Add a "Drag handle" (six dots icon) on the left of each question so the user can change the order of questions.

--How Questions are actually Displayed When user is attempting the Quiz--

Overall Style Guide:

Colors: Primary: Cobalt Blue (#0047AB), Secondary (Success): Emerald Green (#00A86B), Error: Soft Crimson (#DC3545), Neutral: Slate Grey (#718096), Background: Clear White (#FFFFFF).

Typography: Professional sans-serif font (Inter or Roboto) at distinct weights for labels and body text.

Visuals: Components must use soft rounded corners (8-12px) and a subtle drop shadow to differentiate distinct blocks. Text should be clear and legible. Blue borders for all interactive boxes (draggable and drop zones).

Component Set Definition: 'Azure Exam Question Components'
Create a single component set with multiple distinct variants based on the input images, each with proper Auto Layout for responsiveness.

Variant 1: Multiple Choice Grid (ref: image_1.png)
Purpose: Selecting distinct 'Yes/No' (Correct/Incorrect) statuses for a list of statements.

Layout Structure: A main container with Auto Layout (Vertical). Inside, a grid structure with three columns:

Column 1 (Auto width): A vertical stack of text statements, each with body text. (Reference: image_1.png's statement list). Add a column label "Statements".

Column 2 (Fixed width): A parallel vertical stack of unselected radial (circular) selectors. Add a column label "Yes".

Column 3 (Fixed width): A parallel vertical stack of unselected radial (circular) selectors. Add a column label "No".

States: Default unselected; Selected state for both Yes and No circles (one selection per row logic).

Variant 2: Classic Matching via Drag and Drop (ref: image_4.png)
Purpose: Matching a list of terms to their correct definitions.

Layout Structure: A main container with two prominent columns, separated by clear spacing and columns labels "Answer Options" and "Answer Area".

Column 1 (Left): "Answer Options" label. Below, a vertical stack of draggable distinct blue-bordered boxes, each containing a single distinct key term (e.g., Disaster recovery, Fault tolerance, Low latency, Dynamic scalability, as seen in image_4.png).

Column 2 (Right): "Answer Area" label. Below, a structured list of key definitions/statements. To the right of each definition/statement, an empty, blue-bordered drop-target box is perfectly aligned. Use the precise block style and structure from image_4.png.

States: Draggable block (default blue border, lift shadow on hover/active); Drop target (empty/ready state with dashed blue border; item-dropped state filled with the corresponding blue block); Correct/Incorrect feedback for dropped items (light red/green background).

Variant 3: Classification via Drag and Drop (ref: image_0.png)
Purpose: Categorizing multiple items into fewer classification groups.

Layout Structure: A main container with two prominent columns, with spacing and labels "Options" and "Answer".

Column 1 (Left): "Options" label. Below, a vertical stack of multiple draggable blue-bordered boxes (Reference: image_0.png's list of multiple items).

Column 2 (Right): "Answer" label. Below, a vertical stack of fewer empty blue-bordered drop-target boxes (Reference: image_0.png's classification categories on the right).

States: Draggable block (default blue border); Drop target (empty; item-dropped state); Validation states for correct classifications.

Variant 4: Inline Drop-down Single Select (ref: image_2.png)
Purpose: Selecting a correct word or phrase within a written sentence.

Layout Structure: A main container with body text forming a continuous sentence. Within the sentence, replace a key word/phrase with a distinct interactive inline drop-down element.

Component Visuals: The drop-down is a clickable box with a downwards-pointing arrow, shown in an open menu state displaying at least three options in a vertical list (as shown in image_2.png). Highlight the correct option in the menu with a slight success color background. Replicate the inline sentence and drop-down placement from image_2.png.

States: Closed (default box with arrow); Open (menu open, displaying options); Validated state (showing correct selection vs. incorrect, using success/error color feedback on the closed box).

Variant 5: Structured Drop-down Matching List (ref: image_3.png)
Purpose: Matching service names to service categories using distinct drop-down lists.

Layout Structure: A main container with a two-column grid structure.

Column 1 (Left): A vertical stack of specific distinct terms or service names (e.g., "Azure VM", "Azure SQL DB" as seen in image_3.png), each with text.

Column 2 (Right): A parallel vertical stack of distinct, single-select drop-down boxes, one per term. Show the drop-down for at least one term in an open state, displaying the specific options (e.g., IaaS, PaaS, SaaS) in a list (Reference: image_3.png). Replicate the structured term-to-category list from image_3.png.

States: Closed drop-downs; Open drop-down list (showing options); Correct/Incorrect feedback states for individual selections.

Variant 6: Classic Objective Single Select (Standard)
Purpose: Standard multiple choice with only one right answer.

Layout Structure: Single vertical container. Main text block for the question. Below, a vertically stacked list of distinct rectangular option blocks, each containing body text and a single leading radial (circular) selector.

States: Default unselected, Selected (filled circle), Correct/Incorrect validation.

Variant 7: Multiple Answers (Select All That Apply) (Standard)
Purpose: Standard multiple choice where multiple answers are right.

Layout Structure: Single vertical container. Main text block for the question. Below, a vertically stacked list of distinct rectangular option blocks, each containing body text and a single leading square checkbox selector.

States: Default unchecked, Checked, Correct/Incorrect validation.