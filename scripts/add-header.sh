#!/bin/bash

#  Script to prepend content from a header file to all TypeScript files
# in specified directories. It is idempotent, meaning it won't add the
# header if it's already present.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# The file containing the header text to prepend.
HEADER_FILE="header.ts.txt"
# An array of directories to search for .ts files.
TARGET_DIRS=("../src/app" "../firebase/functions")
# ---------------------

# 1. Check if the header file exists.
if [ ! -f "$HEADER_FILE" ]; then
    echo "Error: Header file '$HEADER_FILE' not found."
    echo "Please create this file in the same directory as the script,"
    echo "and fill it with the content you want to prepend."
    exit 1
fi

echo "Using header from '$HEADER_FILE'"

# Store header content and line count for comparison.
# Using `cat` to handle potential trailing newlines correctly.
HEADER_CONTENT=$(cat "$HEADER_FILE")
# Using `wc` and `xargs` to get a clean line count.
HEADER_LINES=$(wc -l < "$HEADER_FILE" | xargs)

# 2. Find and process files in each target directory.
for dir in "${TARGET_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "Warning: Directory '$dir' not found. Skipping."
        continue
    fi

    echo "Processing files in '$dir'"
    for file in $(find "$dir" -type f -name "*.ts"); do
        # Read the first few lines of the file to check for the header.
        if [ -f "$file" ]; then
            # Read the first few lines of the file.
            FILE_HEADER=$(head -n "$HEADER_LINES" "$file")
            
            # Check if the header is already present.
            if [ "$FILE_HEADER" != "$HEADER_CONTENT" ]; then
                echo "Adding header to '$file'"
                # Prepend the header content to the file.
                echo -e "$HEADER_CONTENT\n$(cat "$file")" > "$file"
            else
                echo "Header already present in '$file'. Skipping."
            fi
        else
            echo "Warning: File '$file' not found. Skipping."
        fi
    done
done
echo "Header addition complete."