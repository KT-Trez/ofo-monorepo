import { DEFAULT_API_ORIGIN } from '@config';
import { ConfigItemModel } from '@models';
import { useObject, useRealm } from '@realm/react';
import { ConfigItemsKeys } from '@utils';
import { useCallback, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { Section } from '../components';

export const ServerSection = () => {
  const apiOrigin = useObject(ConfigItemModel, ConfigItemsKeys.API_ORIGIN);
  const realm = useRealm();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>(apiOrigin?.value || '');
  const { colors } = useTheme();

  const connectedErrorIcon = isError ? 'alert-circle-outline' : 'progress-question';
  const connectedIcon = isConnected ? 'check-circle-outline' : connectedErrorIcon;
  const connectingIcon = isConnecting ? 'progress-clock' : connectedIcon;

  const connect = useCallback(async () => {
    setIsConnected(false);
    setIsConnecting(true);

    try {
      realm.write(() => {
        if (apiOrigin) {
          apiOrigin.value = origin;
        } else {
          realm.create(
            ConfigItemModel.schema.name,
            ConfigItemModel.generate({ key: ConfigItemsKeys.API_ORIGIN, value: origin }),
          );
        }
      });

      const res = await fetch(new URL('/v3/ping', origin));

      if (res.ok) {
        setIsError(false);
        setIsConnected(true);
      } else {
        setIsError(true);
      }
    } catch (err) {
      setIsError(true);
      ToastAndroid.showWithGravity('Failed to connect to the server.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    } finally {
      setIsConnecting(false);
    }
  }, [apiOrigin, origin, realm]);

  return (
    <Section hasDivider={false} title="Server">
      <TextInput
        disabled={isConnecting}
        error={isError}
        inputMode="url"
        label="URL"
        left={<TextInput.Icon color={isError ? colors.error : undefined} icon={connectingIcon} />}
        mode="outlined"
        onChangeText={setOrigin}
        onSubmitEditing={connect}
        placeholder={DEFAULT_API_ORIGIN}
        value={origin}
      />
    </Section>
  );
};
