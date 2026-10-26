#!/bin/sh
# ==============================================================================
# PostgreSQL Disaster Recovery / Restore Script
# Adheres to SRS RNF-08 (Backup dan Pemulihan Data)
# ==============================================================================

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <path_to_backup_file.sql.gz>"
    echo "Example: $0 /backups/buana_db_backup_20261013_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file $BACKUP_FILE not found!"
    exit 1
fi

echo "===================================================================="
echo "WARNING: Restoring will overwrite existing data in ${PGDATABASE}!"
echo "Target file: $BACKUP_FILE"
echo "===================================================================="

gunzip -c "$BACKUP_FILE" | psql -h "${PGHOST:-localhost}" -p "${PGPORT:-5432}" -U "${PGUSER:-buana_admin}" -d "${PGDATABASE:-buana_hosting_db}"

echo "Database restoration completed successfully!"
