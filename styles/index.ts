/**
 * This file defines global styles used across the MidMusic application.
 * It centralizes common styling patterns to ensure consistency and reusability.
 */

import { fontSize } from "@/constants/tokens";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

/**
 * Defines a set of default styles that can be applied to various components.
 */
export const defaultStyles = StyleSheet.create({
  /**
   * A basic container style that takes up all available space.
   */
  container: {
    flex: 1,
    // backgroundColor: Colors.background, // Commented out to allow global gradient
  },
  /**
   * Default text styling, including font size and color from the defined tokens.
   */
  text: {
    fontSize: fontSize.base,
    color: Colors.text,
  },
  /**
   * Premium card style with subtle background and border.
   */
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  /**
   * Soft shadow for elevation.
   */
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  /**
   * Glass-like effect container (requires BlurView for real effect, this is fallback/base).
   */
  glass: {
    backgroundColor: "rgba(15, 18, 29, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
  },
});
