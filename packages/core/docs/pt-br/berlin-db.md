# DBs

BerlinDB

Global properties

- $prefix

Table properties

- $name
- $version
- $db_version_key
- $db_version
- $table_name

Column properties

- $name Name of database column
- $type Type of database column
- $length Length of database column
- $unsigned Is integer unsigned?
- $zerofill Is integer filled with zeroes?
- $binary Is data in a binary format?
- $allow_null Is null an allowed value?
- $default Typically empty/null, or date value
- $extra auto_increment, etc...
- $encoding Typically inherited from wpdb
- $collation Typically inherited from wpdb
- $comment Typically empty
- $pattern What is the string-replace pattern?
- $primary Is this the primary column?
- $created Is this the column used as a created date?
- $modified Is this the column used as a modified date?
- $uuid Is this the column used as a universally unique identifier?
- $searchable Is this column searchable?
- $sortable Is this column used in orderby?
- $date_query Is this column a datetime?
- $in Is **in supported? \* $not_in Is **not_in supported?
- $cache_key Is this column queried independently?
- $transition Does this column transition between changes?
- $validate A callback function used to validate on save.
- $caps Array of capabilities to check.
- $aliases Array of possible column name aliases.
- $relationships Array of columns in other tables this column relates to.

Query properties

- $table_name
- $table_alias
- $table_schema
- $item_name
- $item_name_plural
- $item_shape
