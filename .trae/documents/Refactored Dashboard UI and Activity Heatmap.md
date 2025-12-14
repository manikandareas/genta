I have completed the requested changes.

1.  **Reduced Space in Grid**: I decreased the gap in the grid section of `page.tsx` from `gap-8` to `gap-4`, making the components sit tighter together.
2.  **Refactored Activity Heatmap**:
    - **Title**: Changed to "Active Days" with an Information Circle icon.
    - **Layout**:
      - Updated the day labels to `M`, `W`, `F` on the left.
      - Moved the Legend to the bottom right with "Less" and "More" labels.
      - Removed the bottom statistics section (Total Sessions, Avg, Active Days) to match the screenshot strictly.
    - **Styling**:
      - Used smaller rounded corners (`rounded-[2px]`) for the heatmap cells to match the "pixel" look.
      - Ensured the legend matches the heatmap cell style.
      - Kept the Year Select dropdown but made it borderless and cleaner.

The `activity-heatmap.tsx` now closely resembles the structure of the provided screenshot, and the overall dashboard layout is tighter as requested.
