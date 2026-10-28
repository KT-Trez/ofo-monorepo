export type PlaylistCardProps = {
  coverSeed: string;
  isSelected?: boolean;
  isSynced?: boolean;
  onPress: () => void;
  title: string;
  trackCount: number;
  trackCountLabel: string;
};
