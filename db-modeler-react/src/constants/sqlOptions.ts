export interface SQLOptions {
  dbType: 'mysql' | 'postgresql';
  engine?: 'InnoDB' | 'MyISAM';
  charset?: string;
}

export const SQLOptions = {
  dbTypes: [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgresql' },
  ],
  engines: [
    { label: 'InnoDB', value: 'InnoDB' },
    { label: 'MyISAM', value: 'MyISAM' },
  ],
  charsets: [
    { label: 'UTF-8', value: 'utf8' },
    { label: 'UTF-8 MB4', value: 'utf8mb4' },
    { label: 'Latin1', value: 'latin1' },
  ],
}; 