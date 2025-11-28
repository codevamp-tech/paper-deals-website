// This allows for easy theme updates and component customization

export const CATEGORY_CARD_CONFIG = {
  // Image dimensions (responsive)
  image: {
    container: {
      mobile: "w-24 h-24",
      tablet: "sm:w-28 sm:h-28",
      desktop: "lg:w-32 lg:h-32",
    },
    padding: "p-3",
    borderRadius: "rounded-2xl",
  },

  // Typography scale
  typography: {
    heading: "text-base sm:text-lg lg:text-xl font-bold",
    description: "text-xs sm:text-sm",
  },

  // Spacing scale
  spacing: {
    containerGap: "gap-6 sm:gap-8 lg:gap-10",
    headerMargin: "mb-12 sm:mb-16",
  },

  // Shadow effects for elevation
  shadows: {
    card: "shadow-lg",
    cardHover: "shadow-2xl",
  },
}
