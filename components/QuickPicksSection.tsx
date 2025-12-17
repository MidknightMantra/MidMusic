/**
 * This file defines the `QuickPicksSection` component, which displays a horizontally
 * scrollable list of recommended songs, often referred to as "Quick Picks".
 * It shows song artwork, title, and artist, and indicates the currently playing track.
 */

import React, { useMemo } from "react";
import { Colors } from "@/constants/Colors";
import { triggerHaptic } from "@/helpers/haptics";
import { FlashList } from "@shopify/flash-list";
import FastImage from "@d11/react-native-fast-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import LoaderKit from "react-native-loader-kit";
import { ScaledSheet } from "react-native-size-matters/extend";
import { useActiveTrack } from "react-native-track-player";
import { defaultStyles } from "@/styles";

/**
 * @interface QuickPicksSectionProps
 */
export interface QuickPicksSectionProps {
  results: Song[]; // An array of Song objects to display as quick picks.
  onItemClick: (item: Song) => void; // Callback function when a quick pick item is clicked.
}

/**
 * `QuickPicksSection` component.
 * Renders a section of quick pick songs in a two-row horizontal scroll view.
 * @param results - An array of Song objects to display as quick picks.
 * @param onItemClick - Callback function when a quick pick item is clicked.
 */
export const QuickPicksSection: React.FC<QuickPicksSectionProps> = ({
  results,
  onItemClick,
}) => {
  const router = useRouter();
  const activeTrack = useActiveTrack();

  /**
   * Renders an individual quick pick item (song).
   * @param item The Song object to render.
   * @returns A TouchableOpacity component representing the quick pick item.
   */
  const renderItem = (item: Song) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemContainer}
      onPress={() => {
        triggerHaptic();
        onItemClick(item);
      }}
      onLongPress={() => {
        // Prepare song data for the menu modal.
        const songData = JSON.stringify({
          id: item.id,
          title: item.title,
          artist: item.artist,
          thumbnail: item.thumbnail,
        });

        // Trigger haptic feedback for long press.
        triggerHaptic(Haptics.AndroidHaptics.Long_Press);

        // Navigate to the menu modal with song details.
        router.push({
          pathname: "/(modals)/menu",
          params: { songData: songData, type: "song" },
        });
      }}
    >
      <View style={styles.imageContainer}>
        <FastImage source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        {/* Display a playing indicator if this is the active track */}
        {activeTrack?.id === item.id && (
          <LoaderKit
            style={styles.trackPlayingIconIndicator}
            name="LineScalePulseOutRapid"
            color="white"
          />
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );

  const data = useMemo(() => {
    const mid = Math.ceil(results.length / 2);
    return results.slice(0, mid).map((top, idx) => ({
      top,
      bottom: results.slice(mid)[idx],
    }));
  }, [results]);

  // If there are no results, return null to avoid rendering the section.
  if (results.length === 0) {
    return null;
  }

  return (
    <View>
      <Text style={styles.header}>Quick Picks</Text>
      <View style={styles.listContainer}>
        <FlashList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          extraData={activeTrack}
          contentContainerStyle={{ paddingLeft: 13 }}
          keyExtractor={(col) => `${col.top.id}-${col.bottom?.id || "none"}`}
          renderItem={({ item }) => (
            <View style={styles.column}>
              {renderItem(item.top)}
              {item.bottom && renderItem(item.bottom)}
            </View>
          )}
        />
      </View>
    </View>
  );
};

// Styles for the QuickPicksSection component.
const styles = ScaledSheet.create({
  header: {
    color: Colors.text,
    fontSize: "22@ms",
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingBottom: 16,
    letterSpacing: 0.5,
  },
  listContainer: {
    height: "320@ms",
  },
  column: {
    flexDirection: "column",
  },
  itemContainer: {
    marginRight: "16@ms",
    width: "140@ms",
    height: "190@ms",
    marginBottom: "16@vs",
    backgroundColor: "rgba(255,255,255,0.03)", // Subtle glass effect
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: "8@ms",
  },
  imageContainer: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  thumbnail: {
    borderRadius: 12,
    width: "100%",
    aspectRatio: 1,
  },
  trackPlayingIconIndicator: {
    position: "absolute",
    top: "35%",
    left: "35%",
    width: "30@ms",
    height: "30@ms",
  },
  title: {
    color: Colors.text,
    fontSize: "14@ms",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 2,
  },
  artist: {
    fontSize: "12@ms",
    color: Colors.textMuted,
    fontWeight: "400",
  },
});
