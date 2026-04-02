#!/usr/bin/env python3
"""
Migrate MUI Grid v5 API to v7 API.

Changes:
  - Remove `item` prop from <Grid>
  - Convert xs/sm/md/lg/xl props to size prop:
      xs={N}           → size={N}
      xs={N} md={M}    → size={{ xs: N, md: M }}
      xs={N} sm={M}    → size={{ xs: N, sm: M }}
      etc.
  - <Grid item> (no breakpoints) → <Grid>  (just remove item)
"""

import re
import sys
import os
from pathlib import Path

BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl']

def extract_prop_value(text, prop):
    """Extract value of a prop like xs={12} or xs="value" from text."""
    # Match prop={value} where value can be numbers or expressions
    pattern = rf'\b{prop}=\{{([^}}]*)\}}'
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    # Match prop="value"
    pattern2 = rf'\b{prop}="([^"]*)"'
    match2 = re.search(pattern2, text)
    if match2:
        return f'"{match2.group(1)}"'
    return None

def has_item_prop(text):
    """Check if text has a standalone `item` prop (not part of another word or inside a value)."""
    # Only match `item` not preceded by {, ., or word chars, and not followed by ., {, word chars, or }
    return bool(re.search(r'(?<![{.a-zA-Z0-9_])item(?![.{a-zA-Z0-9_}])', text))

def has_breakpoint_props(text):
    """Check if text has any breakpoint props."""
    for bp in BREAKPOINTS:
        if re.search(rf'\b{bp}=\{{', text):
            return True
    return False

def build_size_prop(text):
    """Build the size prop from breakpoint props in text."""
    vals = {}
    for bp in BREAKPOINTS:
        val = extract_prop_value(text, bp)
        if val is not None:
            vals[bp] = val
    
    if not vals:
        return None
    
    if len(vals) == 1 and 'xs' in vals:
        # Single xs only -> size={N}
        return f'size={{{vals["xs"]}}}'
    else:
        # Multiple breakpoints -> size={{ xs: N, sm: M, ... }}
        parts = []
        for bp in BREAKPOINTS:
            if bp in vals:
                parts.append(f'{bp}: {vals[bp]}')
        return 'size={{ ' + ', '.join(parts) + ' }}'

def remove_item_prop(text):
    """Remove standalone `item` prop (not inside a value like {item.key})."""
    # Remove just the word `item` where it's a JSX boolean prop (not inside a value)
    cleaned = re.sub(r'(?<![{.a-zA-Z0-9_])item(?![.{a-zA-Z0-9_}])', '', text)
    # Collapse any resulting double spaces
    return re.sub(r'  +', ' ', cleaned)

def remove_breakpoint_props(text):
    """Remove xs/sm/md/lg/xl props."""
    for bp in BREAKPOINTS:
        text = re.sub(rf'\s*\b{bp}=\{{[^}}]*\}}', '', text)
    return text

def transform_grid_tag(tag_content):
    """
    Transform a <Grid ...> tag.
    tag_content is everything between <Grid and >
    """
    if not has_item_prop(tag_content):
        return None  # Not an item grid, no change needed
    
    # Build size prop from breakpoints if present
    size_prop = build_size_prop(tag_content)
    
    # Remove item prop
    new_content = remove_item_prop(tag_content)
    
    # Remove breakpoint props
    new_content = remove_breakpoint_props(new_content)
    
    # Add size prop if we had breakpoints
    if size_prop:
        stripped = new_content.strip()
        if stripped:
            new_content = ' ' + size_prop + ' ' + stripped
        else:
            new_content = ' ' + size_prop
    else:
        # No breakpoints — just keep remaining props, ensure leading space if any
        new_content = new_content.rstrip()
        if new_content and not new_content[0].isspace():
            new_content = ' ' + new_content

    # Clean up extra whitespace (but preserve newlines for multi-line tags)
    new_content = re.sub(r' {2,}', ' ', new_content)

    return new_content

def process_file(filepath):
    """Process a single TSX file."""
    content = Path(filepath).read_text()
    original = content
    
    # We need to handle <Grid ...> tags, including multi-line ones
    # Strategy: find all <Grid ... > sequences and transform them
    # 
    # Pattern: <Grid followed by props until we hit > (but not />)
    # We need to be careful about nested JSX expressions like sx={{ }} that contain }
    
    result = []
    pos = 0
    
    while pos < len(content):
        # Find next <Grid occurrence
        grid_start = content.find('<Grid', pos)
        if grid_start == -1:
            result.append(content[pos:])
            break
        
        # Add text before this <Grid
        result.append(content[pos:grid_start])
        
        # Now find the end of this Grid tag
        # We need to handle nested braces like sx={{ }}
        # Find the closing > of the opening tag
        i = grid_start + len('<Grid')
        
        # Check what follows: must be space, newline, > or / for a valid tag
        if i < len(content) and content[i] not in ' \t\n\r>/{':
            # Not a Grid tag (e.g., <GridContainer) - just add it and continue
            result.append('<Grid')
            pos = grid_start + len('<Grid')
            continue
        
        # Track brace depth to properly handle sx={{ }} etc.
        brace_depth = 0
        tag_end = None
        j = i
        while j < len(content):
            ch = content[j]
            if ch == '{':
                brace_depth += 1
            elif ch == '}':
                brace_depth -= 1
            elif ch == '>' and brace_depth == 0:
                tag_end = j
                break
            j += 1
        
        if tag_end is None:
            # Couldn't find end - just append and move on
            result.append('<Grid')
            pos = grid_start + len('<Grid')
            continue
        
        # Extract props portion (everything between <Grid and >)
        props_portion = content[i:tag_end]
        
        if not has_item_prop(props_portion):
            # Not an item, no change
            result.append('<Grid' + props_portion + '>')
            pos = tag_end + 1
            continue
        
        # Transform the props
        new_props = transform_grid_tag(props_portion)
        
        if new_props is None:
            result.append('<Grid' + props_portion + '>')
        else:
            result.append('<Grid' + new_props + '>')
        
        pos = tag_end + 1
    
    new_content = ''.join(result)
    
    if new_content != original:
        Path(filepath).write_text(new_content)
        return True
    return False

def main():
    workspace = Path('/home/oystein/workspace/volley/beachvolleyball-scoreboard/src')
    
    tsx_files = list(workspace.rglob('*.tsx'))
    changed = []
    
    for f in sorted(tsx_files):
        if process_file(f):
            changed.append(str(f))
            print(f'  Modified: {f.relative_to(workspace.parent)}')
    
    print(f'\nTotal files modified: {len(changed)}')

if __name__ == '__main__':
    main()
