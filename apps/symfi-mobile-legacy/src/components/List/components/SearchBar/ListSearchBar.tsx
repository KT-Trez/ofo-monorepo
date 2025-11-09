import { TextInput, useTheme } from 'react-native-paper';

type ListSearchBarProps = {
  searchPhrase: string;
  setSearchPhrase: (searchPhrase: string) => void;
};

export const ListSearchBar = ({ searchPhrase, setSearchPhrase }: ListSearchBarProps) => {
  const { colors } = useTheme();

  return (
    <TextInput
      inputMode="search"
      left={<TextInput.Icon color={colors.outline} icon="magnify" />}
      mode="outlined"
      onChangeText={setSearchPhrase}
      placeholder="Search"
      value={searchPhrase}
    />
  );
};
