import React, { useEffect, useRef, useState } from "react"
import { StyleSheet } from "react-native"
import NetInfo from "@react-native-community/netinfo"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"

import { Text } from "./Text"
import { colors } from "../theme"
import { useIsConnected } from "react-native-offline"

export const OfflineNotice = ({ children }) => {
  const isConnected = useIsConnected()
  const animatedVal = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();
  const bottomGap = bottom < 5 ? 5 : bottom;
  const tabbarGap = bottom < 5 ? 0 : bottom - 10;
  const mount = useRef(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);

  const colorStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(animatedVal.value, [0, 1, 2, 3], ['transparent', colors.palette.neutral400, colors.palette.green, 'transparent']);
    return { backgroundColor };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(animatedVal.value, [0, 1, 2, 3], [0, bottomGap + 20, bottomGap + 20, 0]);
    const paddingTop = interpolate(animatedVal.value, [0, 1, 2, 3], [0, 5, 5, 0]);
    const marginTop = interpolate(animatedVal.value, [0, 1, 2, 3], [0, -tabbarGap, -tabbarGap, 0]);
    return { height, paddingTop, marginTop };
  });

  useEffect(() => {
    mount.current = true;
    NetInfo.fetch().then(state => {
      if (state.isInternetReachable === false) {
        displayOffline();
      }
    });
  }, []);

  useEffect(() => {
    if (mount.current) {
     if(isConnected) displayOnline()
     else displayOffline()
    }
  }, [isConnected]);

  const displayOffline = () => {
    setIsOffline(true);
    animatedVal.value = withTiming(1, { duration: 500 });
  };

  const displayOnline = () => {
    setIsOffline(false);
    setShowOnline(true);
    animatedVal.value = withSequence(
      withTiming(2, { duration: 500 }),
      withDelay(
        1000,
        withTiming(3, { duration: 500 }, () => (animatedVal.value = 0))
      )
    );
    setTimeout(() => setShowOnline(false), 2000);
  };

  return (
    <>
      {children}
      <Animated.View style={[styles.container, animatedStyle, colorStyle]}>
        {
          isOffline
            ? <Text style={styles.offlineText}>{'No Connection'}</Text>
            : (showOnline && <Text style={styles.onlineText}>{'Back Online'}</Text>)
        }
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  offlineText: {
    color: colors.palette.neutral900,
    fontSize: 12,
  },
  onlineText: {
    color: colors.palette.neutral100,
    fontSize: 12,
  },
});
