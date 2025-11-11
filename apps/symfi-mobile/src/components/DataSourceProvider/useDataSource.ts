import { useContext } from 'react';
import { DataSourceProviderContext } from './context';

export const useDataSource = () => {
  const dataSource = useContext(DataSourceProviderContext);

  if (!dataSource) {
    throw new Error('"useDataSource" must be used within a "DataSourceProvider"');
  }

  return dataSource;
};
