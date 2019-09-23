import { Platform } from 'react-native';
import RNFS from "react-native-fs";

export const dirHome = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}/serecisn`,
  android: `${RNFS.ExternalStorageDirectoryPath}/serecisn`
});