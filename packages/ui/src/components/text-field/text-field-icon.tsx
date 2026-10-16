import { useUnistyles } from 'react-native-unistyles';
import { Icon, type IconName } from '../icon';

export const ICON_SIZE = 22;

type TextFieldIconProps = {
  name: IconName;
};

export const TextFieldIcon = ({ name }: TextFieldIconProps) => {
  const { theme } = useUnistyles();

  return <Icon color={theme.colors.textTertiary} name={name} size={ICON_SIZE} />;
};
