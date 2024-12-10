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
    value: 'MYSQL',
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
      { label: 'TINYINT', value: 'TINYINT', hasLength: true, defaultLength: 4, maxLength: 4, supportAutoIncrement: true },
      { label: 'SMALLINT', value: 'SMALLINT', hasLength: true, defaultLength: 6, maxLength: 6, supportAutoIncrement: true },
      { label: 'MEDIUMINT', value: 'MEDIUMINT', hasLength: true, defaultLength: 9, maxLength: 9, supportAutoIncrement: true },
      { label: 'INT', value: 'INT', hasLength: true, defaultLength: 11, maxLength: 11, supportAutoIncrement: true },
      { label: 'BIGINT', value: 'BIGINT', hasLength: true, defaultLength: 20, maxLength: 20, supportAutoIncrement: true },
      { label: 'DECIMAL', value: 'DECIMAL', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'FLOAT', value: 'FLOAT', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'DOUBLE', value: 'DOUBLE', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'CHAR', value: 'CHAR', hasLength: true, defaultLength: 1, maxLength: 255 },
      { label: 'VARCHAR', value: 'VARCHAR', hasLength: true, defaultLength: 255, maxLength: 65535 },
      { label: 'TINYTEXT', value: 'TINYTEXT', maxLength: 255 },
      { label: 'TEXT', value: 'TEXT', maxLength: 65535 },
      { label: 'MEDIUMTEXT', value: 'MEDIUMTEXT', maxLength: 16777215 },
      { label: 'LONGTEXT', value: 'LONGTEXT', maxLength: 4294967295 },
      { label: 'BINARY', value: 'BINARY', hasLength: true, defaultLength: 1 },
      { label: 'VARBINARY', value: 'VARBINARY', hasLength: true, defaultLength: 255 },
      { label: 'TINYBLOB', value: 'TINYBLOB' },
      { label: 'BLOB', value: 'BLOB' },
      { label: 'MEDIUMBLOB', value: 'MEDIUMBLOB' },
      { label: 'LONGBLOB', value: 'LONGBLOB' },
      { label: 'DATE', value: 'DATE' },
      { label: 'TIME', value: 'TIME' },
      { label: 'DATETIME', value: 'DATETIME' },
      { label: 'TIMESTAMP', value: 'TIMESTAMP' },
      { label: 'YEAR', value: 'YEAR' },
      { label: 'BOOLEAN', value: 'BOOLEAN' },
      { label: 'JSON', value: 'JSON' },
      { label: 'ENUM', value: 'ENUM', hasLength: true },
      { label: 'SET', value: 'SET', hasLength: true }
    ]
  },
  {
    name: 'PostgreSQL',
    value: 'POSTGRESQL',
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
      { label: 'SMALLINT', value: 'SMALLINT', supportAutoIncrement: true },
      { label: 'INTEGER', value: 'INTEGER', supportAutoIncrement: true },
      { label: 'BIGINT', value: 'BIGINT', supportAutoIncrement: true },
      { label: 'DECIMAL', value: 'DECIMAL', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'NUMERIC', value: 'NUMERIC', hasLength: true, hasPrecision: true, defaultLength: 10, defaultPrecision: 2 },
      { label: 'REAL', value: 'REAL' },
      { label: 'DOUBLE PRECISION', value: 'DOUBLE PRECISION' },
      { label: 'MONEY', value: 'MONEY' },
      { label: 'CHARACTER', value: 'CHARACTER', hasLength: true, defaultLength: 1 },
      { label: 'CHARACTER VARYING', value: 'CHARACTER VARYING', hasLength: true, defaultLength: 255 },
      { label: 'TEXT', value: 'TEXT' },
      { label: 'BYTEA', value: 'BYTEA' },
      { label: 'TIMESTAMP', value: 'TIMESTAMP' },
      { label: 'TIMESTAMP WITH TIME ZONE', value: 'TIMESTAMP WITH TIME ZONE' },
      { label: 'DATE', value: 'DATE' },
      { label: 'TIME', value: 'TIME' },
      { label: 'TIME WITH TIME ZONE', value: 'TIME WITH TIME ZONE' },
      { label: 'INTERVAL', value: 'INTERVAL' },
      { label: 'BOOLEAN', value: 'BOOLEAN' },
      { label: 'ENUM', value: 'ENUM', hasLength: true },
      { label: 'UUID', value: 'UUID' },
      { label: 'JSON', value: 'JSON' },
      { label: 'JSONB', value: 'JSONB' },
      { label: 'XML', value: 'XML' },
      { label: 'CIDR', value: 'CIDR' },
      { label: 'INET', value: 'INET' },
      { label: 'MACADDR', value: 'MACADDR' }
    ]
  },
  {
    name: 'Oracle',
    value: 'ORACLE',
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
    value: 'SQLITE',
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
    value: 'SQLSERVER',
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
  const normalizedDbType = dbType.toUpperCase()
  return databaseConfigs.find(config => config.value === normalizedDbType)
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
  return types.find(type => type.value === dataType.toUpperCase())
}
