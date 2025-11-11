import { type ReactNode, useRef } from 'react';
import { DataSource } from 'typeorm';
import { DataSourceProviderContext } from './context';

type DataSourceProviderProps = {
  children: ReactNode;
  database: string;
};

export const DataSourceProvider = ({ children, database }: DataSourceProviderProps) => {
  const dataSource = useRef<DataSource>(
    new DataSource({
      // cache: {
      //   duration: 300_000, // 5 minutes
      // },
      database,
      driver: require('expo-sqlite'),
      entities: [],
      logging: true,
      // todo: set to false in production
      synchronize: true,
      type: 'expo',
    }),
  );

  return <DataSourceProviderContext.Provider value={dataSource.current}>{children}</DataSourceProviderContext.Provider>;
};
