#!/bin/bash

# Supabase Local Storage Helper Script
# This script provides utilities for working with Supabase local storage

STORAGE_CONTAINER="supabase_storage_vivvers-nextjs"
STORAGE_PATH="/mnt/stub/stub"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if Supabase is running
check_supabase() {
    if ! docker ps | grep -q "$STORAGE_CONTAINER"; then
        echo -e "${RED}Error: Supabase storage container is not running.${NC}"
        echo "Run 'npx supabase start' to start the local development environment."
        exit 1
    fi
}

# Function to list buckets
list_buckets() {
    echo -e "${BLUE}Available storage buckets:${NC}"
    docker exec "$STORAGE_CONTAINER" ls -la "$STORAGE_PATH/" 2>/dev/null | grep "^d" | awk '{print "  - " $NF}' | grep -v "^\.$\|^\.\.$"
}

# Function to list files in a bucket
list_files() {
    local bucket=$1
    if [ -z "$bucket" ]; then
        echo -e "${RED}Error: Please specify a bucket name.${NC}"
        echo "Usage: $0 list <bucket-name>"
        exit 1
    fi
    
    echo -e "${BLUE}Files in bucket '$bucket':${NC}"
    docker exec "$STORAGE_CONTAINER" find "$STORAGE_PATH/$bucket" -type f 2>/dev/null | while read -r file; do
        basename=$(basename "$file")
        echo "  - $basename"
    done
}

# Function to export a file from storage
export_file() {
    local bucket=$1
    local filename=$2
    local destination=$3
    
    if [ -z "$bucket" ] || [ -z "$filename" ]; then
        echo -e "${RED}Error: Please specify bucket and filename.${NC}"
        echo "Usage: $0 export <bucket> <filename> [destination]"
        exit 1
    fi
    
    if [ -z "$destination" ]; then
        destination="./$filename"
    fi
    
    # Find the file in the bucket
    file_path=$(docker exec "$STORAGE_CONTAINER" find "$STORAGE_PATH/$bucket" -name "*$filename*" -type f 2>/dev/null | head -1)
    
    if [ -z "$file_path" ]; then
        echo -e "${RED}Error: File not found in bucket '$bucket'.${NC}"
        exit 1
    fi
    
    # Copy the file
    docker cp "$STORAGE_CONTAINER:$file_path" "$destination"
    echo -e "${GREEN}File exported to: $destination${NC}"
}

# Function to export all files from a bucket
export_all() {
    local bucket=$1
    local destination=$2
    
    if [ -z "$bucket" ]; then
        echo -e "${RED}Error: Please specify a bucket name.${NC}"
        echo "Usage: $0 export-all <bucket> [destination-directory]"
        exit 1
    fi
    
    if [ -z "$destination" ]; then
        destination="./exported-$bucket"
    fi
    
    mkdir -p "$destination"
    
    echo -e "${BLUE}Exporting all files from bucket '$bucket' to '$destination'...${NC}"
    
    docker exec "$STORAGE_CONTAINER" find "$STORAGE_PATH/$bucket" -type f 2>/dev/null | while read -r file; do
        basename=$(basename "$file")
        docker cp "$STORAGE_CONTAINER:$file" "$destination/$basename" 2>/dev/null
        echo "  - Exported: $basename"
    done
    
    echo -e "${GREEN}Export complete!${NC}"
}

# Function to show storage statistics
storage_stats() {
    echo -e "${BLUE}Storage Statistics:${NC}"
    
    # Get total size
    total_size=$(docker exec "$STORAGE_CONTAINER" du -sh "$STORAGE_PATH" 2>/dev/null | awk '{print $1}')
    echo "  Total storage used: $total_size"
    
    # Get size per bucket
    echo -e "\n  Size per bucket:"
    docker exec "$STORAGE_CONTAINER" du -sh "$STORAGE_PATH"/* 2>/dev/null | while read -r line; do
        size=$(echo "$line" | awk '{print $1}')
        path=$(echo "$line" | awk '{print $2}')
        bucket=$(basename "$path")
        echo "    - $bucket: $size"
    done
    
    # Count files per bucket
    echo -e "\n  Files per bucket:"
    docker exec "$STORAGE_CONTAINER" ls -la "$STORAGE_PATH/" 2>/dev/null | grep "^d" | awk '{print $NF}' | grep -v "^\.$\|^\.\.$" | while read -r bucket; do
        count=$(docker exec "$STORAGE_CONTAINER" find "$STORAGE_PATH/$bucket" -type f 2>/dev/null | wc -l)
        echo "    - $bucket: $count files"
    done
}

# Function to clean a bucket
clean_bucket() {
    local bucket=$1
    
    if [ -z "$bucket" ]; then
        echo -e "${RED}Error: Please specify a bucket name.${NC}"
        echo "Usage: $0 clean <bucket>"
        exit 1
    fi
    
    echo -e "${RED}Warning: This will delete all files in bucket '$bucket'.${NC}"
    read -p "Are you sure? (y/N): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        docker exec "$STORAGE_CONTAINER" find "$STORAGE_PATH/$bucket" -type f -delete 2>/dev/null
        echo -e "${GREEN}Bucket '$bucket' has been cleaned.${NC}"
    else
        echo "Operation cancelled."
    fi
}

# Main script logic
check_supabase

case "$1" in
    "buckets")
        list_buckets
        ;;
    "list")
        list_files "$2"
        ;;
    "export")
        export_file "$2" "$3" "$4"
        ;;
    "export-all")
        export_all "$2" "$3"
        ;;
    "stats")
        storage_stats
        ;;
    "clean")
        clean_bucket "$2"
        ;;
    *)
        echo -e "${BLUE}Supabase Local Storage Helper${NC}"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  buckets              List all storage buckets"
        echo "  list <bucket>        List files in a specific bucket"
        echo "  export <bucket> <filename> [destination]"
        echo "                       Export a file from storage"
        echo "  export-all <bucket> [destination-dir]"
        echo "                       Export all files from a bucket"
        echo "  stats                Show storage statistics"
        echo "  clean <bucket>       Delete all files in a bucket"
        echo ""
        echo "Examples:"
        echo "  $0 buckets"
        echo "  $0 list avatars"
        echo "  $0 export avatars avatar.webp ./my-avatar.webp"
        echo "  $0 export-all project-images ./exported-images"
        echo "  $0 stats"
        ;;
esac