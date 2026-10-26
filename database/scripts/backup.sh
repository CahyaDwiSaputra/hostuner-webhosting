#!/bin/sh
# ==============================================================================
# Automated PostgreSQL Backup Script
# Adheres to SRS RNF-08 (Backup dan Pemulihan Data) & WBS 7.5
# ==============================================================================

set -e

BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="buana_db_backup_${TIMESTAMP}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

mkdir -p "$BACKUP_DIR"

echo "[$(date -u +"%Y-%m-%d %H:%M:%SZ")] Starting automated database backup for database: ${PGDATABASE}..."

# Export compressed dump with error detection
if pg_dump -h "${PGHOST:-localhost}" -p "${PGPORT:-5432}" -U "${PGUSER:-buana_admin}" "${PGDATABASE:-buana_hosting_db}" | gzip -9 > "$BACKUP_PATH"; then
    FILESIZE=$(ls -lh "$BACKUP_PATH" | awk '{print $5}')
    echo "[$(date -u +"%Y-%m-%d %H:%M:%SZ")] Backup successful! File created: $BACKUP_PATH (Size: $FILESIZE)"
else
    echo "[$(date -u +"%Y-%m-%d %H:%M:%SZ")] ERROR: Database backup failed!" >&2
    rm -f "$BACKUP_PATH"
    exit 1
fi

# Cleanup old backups exceeding retention policy
echo "[$(date -u +"%Y-%m-%d %H:%M:%SZ")] Cleaning up database backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -type f -name "buana_db_backup_*.sql.gz" -mtime +"$RETENTION_DAYS" -exec rm -vf {} \;

echo "[$(date -u +"%Y-%m-%d %H:%M:%SZ")] Backup maintenance cycle finished."
