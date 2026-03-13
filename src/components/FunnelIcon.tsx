import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../theme/colors';

interface FunnelIconProps {
  size?: number;
  color?: string;
}

/** Funnel icon - trapezoid top + stem */
export function FunnelIcon({size = 20, color = Colors.textSecondary}: FunnelIconProps) {
  const s = size / 20;
  return (
    <View style={[styles.container, {width: size, height: size * 1.1}]}>
      {/* Top of funnel - downward triangle using borders */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 7 * s,
          borderRightWidth: 7 * s,
          borderTopWidth: 10 * s,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
        }}
      />
      {/* Stem */}
      <View
        style={[
          styles.stem,
          {
            width: 4 * s,
            height: 6 * s,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stem: {
    marginTop: -1,
    borderRadius: 1,
  },
});
