import { createContext } from 'react';
import type { DataSource } from 'typeorm';

export const DataSourceProviderContext = createContext<DataSource | null>(null);
