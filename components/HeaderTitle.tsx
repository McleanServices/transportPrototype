// HeaderTitle.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';

interface HeaderTitleProps {
  logoSource: any; // Type this properly based on the image source
  title: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ logoSource, title }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
    <Image source={logoSource} style={{ width: 70, height: 50, marginRight: 20 }} />
    <Text>{title}</Text>
  </View>
);

export default HeaderTitle;
