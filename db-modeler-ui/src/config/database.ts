interface DataType {
  label: string
  value: string
  hasLength?: boolean
  hasPrecision?: boolean
  defaultLength?: number
  maxLength?: number
  defaultPrecision?: number
  supportAutoIncrement?: boolean
}

interface DatabaseConfig {
  name: string
  value: string
  engineOptions?: Array<{ label: string; value: string }>
  charsetOptions?: Array<{ label: string; value: string }>
  collateOptions?: Array<{ label: string; value: string }>
  dataTypes: DataType[]
}

export const databaseConfigs: DatabaseConfig[] = [
  {
    name: 'MySQL',
    value: 'MySQL',
    engineOptions: [
      { label: 'InnoDB', value: 'InnoDB' },
      { label: 'MyISAM', value: 'MyISAM' },
      { label: 'Memory', value: 'Memory' },
      { label: 'CSV', value: 'CSV' },
      { label: 'Archive', value: 'Archive' }
    ],
    charsetOptions: [
      { label: 'utf8mb4', value: 'utf8mb4' },
      { label: 'utf8', value: 'utf8' },
      { label: 'latin1', value: 'latin1' },
      { label: 'gbk', value: 'gbk' },
      { label: 'ascii', value: 'ascii' }
    ],
    collateOptions: [
      { label: 'utf8mb4_general_ci', value: 'utf8mb4_general_ci' },
      { label: 'utf8mb4_unicode_ci', value: 'utf8mb4_unicode_ci' },
      { label: 'utf8mb4_bin', value: 'utf8mb4_bin' },
      { label: 'utf8_general_ci', value: 'utf8_general_ci' },
      { label: 'latin1_swedish_ci', value: 'latin1_swedish_ci' }
    ],
    dataTypes: [
      { label: 'TINYINT', value: 'tinyint', hasLength: true, defaultLength: 4, maxLength: 4, supportAutoIncrement: true },
      { label: 'SMALLINT', value: 'smallint', hasLength: true, defaultLength: 6, maxLength: 6, supportAutoIncrement: true },
      { label: 'MEDIUMINT', value: 'mediumint', hasLength: true, defaultLength: 9, maxLength: 9, supportAutoIncrement: true },
      { label: 'INT', value: 'int', hasLength: true, defaultLength: 11, maxLength: 11, supportAutoIncrement: true },
      { label: 'BIGINT', value: 'bigint', hasLength: true, defaultLength: 20, maxLength: 20, supportAutoIncrement: true },
      { label: 'DECIMAL', value: 'decimal', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'FLOAT', value: 'float', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'DOUBLE', value: 'double', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'CHAR', value: 'char', hasLength: true, defaultLength: 1, maxLength: 255 },
      { label: 'VARCHAR', value: 'varchar', hasLength: true, defaultLength: 255, maxLength: 65535 },
      { label: 'TINYTEXT', value: 'tinytext', maxLength: 255 },
      { label: 'TEXT', value: 'text', maxLength: 65535 },
      { label: 'MEDIUMTEXT', value: 'mediumtext', maxLength: 16777215 },
      { label: 'LONGTEXT', value: 'longtext', maxLength: 4294967295 },
      { label: 'BINARY', value: 'binary', hasLength: true, defaultLength: 1 },
      { label: 'VARBINARY', value: 'varbinary', hasLength: true, defaultLength: 255 },
      { label: 'TINYBLOB', value: 'tinyblob' },
      { label: 'BLOB', value: 'blob' },
      { label: 'MEDIUMBLOB', value: 'mediumblob' },
      { label: 'LONGBLOB', value: 'longblob' },
      { label: 'DATE', value: 'date' },
      { label: 'TIME', value: 'time' },
      { label: 'DATETIME', value: 'datetime' },
      { label: 'TIMESTAMP', value: 'timestamp' },
      { label: 'YEAR', value: 'year' },
      { label: 'BOOLEAN', value: 'boolean' },
      { label: 'JSON', value: 'json' },
      { label: 'ENUM', value: 'enum', hasLength: true },
      { label: 'SET', value: 'set', hasLength: true }
    ]
  },
  {
    name: 'PostgreSQL',
    value: 'PostgreSQL',
    charsetOptions: [
      { label: 'UTF8', value: 'UTF8' },
      { label: 'LATIN1', value: 'LATIN1' },
      { label: 'ISO_8859_5', value: 'ISO_8859_5' },
      { label: 'UNICODE', value: 'UNICODE' }
    ],
    collateOptions: [
      { label: 'default', value: 'default' },
      { label: 'C', value: 'C' },
      { label: 'POSIX', value: 'POSIX' }
    ],
    dataTypes: [
      { label: 'SMALLINT', value: 'smallint', supportAutoIncrement: true },
      { label: 'INTEGER', value: 'integer', supportAutoIncrement: true },
      { label: 'BIGINT', value: 'bigint', supportAutoIncrement: true },
      { label: 'DECIMAL', value: 'decimal', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'NUMERIC', value: 'numeric', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'REAL', value: 'real' },
      { label: 'DOUBLE PRECISION', value: 'double precision' },
      { label: 'MONEY', value: 'money' },
      { label: 'CHARACTER', value: 'character', hasLength: true, defaultLength: 1 },
      { label: 'CHARACTER VARYING', value: 'character varying', hasLength: true, defaultLength: 255 },
      { label: 'TEXT', value: 'text' },
      { label: 'BYTEA', value: 'bytea' },
      { label: 'TIMESTAMP', value: 'timestamp' },
      { label: 'TIMESTAMP WITH TIME ZONE', value: 'timestamp with time zone' },
      { label: 'DATE', value: 'date' },
      { label: 'TIME', value: 'time' },
      { label: 'TIME WITH TIME ZONE', value: 'time with time zone' },
      { label: 'INTERVAL', value: 'interval' },
      { label: 'BOOLEAN', value: 'boolean' },
      { label: 'ENUM', value: 'enum', hasLength: true },
      { label: 'UUID', value: 'uuid' },
      { label: 'JSON', value: 'json' },
      { label: 'JSONB', value: 'jsonb' },
      { label: 'XML', value: 'xml' },
      { label: 'CIDR', value: 'cidr' },
      { label: 'INET', value: 'inet' },
      { label: 'MACADDR', value: 'macaddr' }
    ]
  },
  {
    name: 'Oracle',
    value: 'Oracle',
    charsetOptions: [
      { label: 'AL32UTF8', value: 'AL32UTF8' },
      { label: 'UTF8', value: 'UTF8' },
      { label: 'ZHS16GBK', value: 'ZHS16GBK' }
    ],
    dataTypes: [
      { label: 'NUMBER', value: 'number', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'FLOAT', value: 'float', hasLength: true },
      { label: 'BINARY_FLOAT', value: 'binary_float' },
      { label: 'BINARY_DOUBLE', value: 'binary_double' },
      { label: 'CHAR', value: 'char', hasLength: true, defaultLength: 1 },
      { label: 'VARCHAR2', value: 'varchar2', hasLength: true, defaultLength: 255 },
      { label: 'NCHAR', value: 'nchar', hasLength: true, defaultLength: 1 },
      { label: 'NVARCHAR2', value: 'nvarchar2', hasLength: true, defaultLength: 255 },
      { label: 'CLOB', value: 'clob' },
      { label: 'NCLOB', value: 'nclob' },
      { label: 'BLOB', value: 'blob' },
      { label: 'DATE', value: 'date' },
      { label: 'TIMESTAMP', value: 'timestamp' },
      { label: 'TIMESTAMP WITH TIME ZONE', value: 'timestamp with time zone' },
      { label: 'TIMESTAMP WITH LOCAL TIME ZONE', value: 'timestamp with local time zone' },
      { label: 'INTERVAL YEAR TO MONTH', value: 'interval year to month' },
      { label: 'INTERVAL DAY TO SECOND', value: 'interval day to second' },
      { label: 'RAW', value: 'raw', hasLength: true },
      { label: 'LONG RAW', value: 'long raw' },
      { label: 'ROWID', value: 'rowid' },
      { label: 'UROWID', value: 'urowid' },
      { label: 'XMLType', value: 'xmltype' }
    ]
  },
  {
    name: 'SQLite',
    value: 'SQLite',
    dataTypes: [
      { label: 'INTEGER', value: 'integer', supportAutoIncrement: true },
      { label: 'REAL', value: 'real' },
      { label: 'TEXT', value: 'text' },
      { label: 'BLOB', value: 'blob' },
      { label: 'NUMERIC', value: 'numeric' }
    ]
  },
  {
    name: 'SQL Server',
    value: 'SQLServer',
    charsetOptions: [
      { label: 'Latin1_General_CI_AS', value: 'Latin1_General_CI_AS' },
      { label: 'Chinese_PRC_CI_AS', value: 'Chinese_PRC_CI_AS' },
      { label: 'SQL_Latin1_General_CP1_CI_AS', value: 'SQL_Latin1_General_CP1_CI_AS' }
    ],
    dataTypes: [
      { label: 'BIGINT', value: 'bigint', supportAutoIncrement: true },
      { label: 'NUMERIC', value: 'numeric', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'BIT', value: 'bit' },
      { label: 'SMALLINT', value: 'smallint', supportAutoIncrement: true },
      { label: 'DECIMAL', value: 'decimal', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'SMALLMONEY', value: 'smallmoney' },
      { label: 'INT', value: 'int', supportAutoIncrement: true },
      { label: 'TINYINT', value: 'tinyint', supportAutoIncrement: true },
      { label: 'MONEY', value: 'money' },
      { label: 'FLOAT', value: 'float', hasLength: true },
      { label: 'REAL', value: 'real' },
      { label: 'DATE', value: 'date' },
      { label: 'DATETIMEOFFSET', value: 'datetimeoffset', hasLength: true },
      { label: 'DATETIME2', value: 'datetime2', hasLength: true },
      { label: 'SMALLDATETIME', value: 'smalldatetime' },
      { label: 'DATETIME', value: 'datetime' },
      { label: 'TIME', value: 'time', hasLength: true },
      { label: 'CHAR', value: 'char', hasLength: true, defaultLength: 1 },
      { label: 'VARCHAR', value: 'varchar', hasLength: true, defaultLength: 255 },
      { label: 'TEXT', value: 'text' },
      { label: 'NCHAR', value: 'nchar', hasLength: true, defaultLength: 1 },
      { label: 'NVARCHAR', value: 'nvarchar', hasLength: true, defaultLength: 255 },
      { label: 'NTEXT', value: 'ntext' },
      { label: 'BINARY', value: 'binary', hasLength: true },
      { label: 'VARBINARY', value: 'varbinary', hasLength: true },
      { label: 'IMAGE', value: 'image' },
      { label: 'XML', value: 'xml' },
      { label: 'UNIQUEIDENTIFIER', value: 'uniqueidentifier' }
    ]
  }
]

export const getDefaultConfig = (dbType: string): DatabaseConfig | undefined => {
  return databaseConfigs.find(config => config.value === dbType)
}

export const getDataTypes = (dbType: string): DataType[] => {
  const config = getDefaultConfig(dbType)
  return config ? config.dataTypes : []
}

export const getEngineOptions = (dbType: string) => {
  const config = getDefaultConfig(dbType)
  return config?.engineOptions || []
}

export const getCharsetOptions = (dbType: string) => {
  const config = getDefaultConfig(dbType)
  return config?.charsetOptions || []
}

export const getCollateOptions = (dbType: string) => {
  const config = getDefaultConfig(dbType)
  return config?.collateOptions || []
}

export const getDataTypeConfig = (dbType: string, dataType: string): DataType | undefined => {
  const types = getDataTypes(dbType)
  return types.find(type => type.value === dataType)
}
