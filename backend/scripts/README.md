# Database Migration Scripts

## Drop Old Indexes

If you're experiencing a duplicate key error on the `identifier` field in the vehicles or maintenance collections, this is likely due to old indexes from a previous schema version.

### To fix this issue:

1. Make sure your backend server is stopped
2. Run the migration script:

```bash
cd backend
npm run db:drop-old-indexes
```

This script will:
- Connect to your MongoDB database
- Check for any old `identifier` indexes
- Drop them if they exist
- Leave your data intact

### What this fixes:

The error message you might see:
```
E11000 duplicate key error collection: agro-care.maintenancelogs index: identifier_1 dup key: { identifier: null }
```

This happens when MongoDB has an old unique index on a field that no longer exists in your schema. The script safely removes these outdated indexes.
