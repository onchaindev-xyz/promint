// ./constants.ts
export const APP_URL = (() => {
  const envUrl = process.env.NEXT_PUBLIC_URL;
  if (!envUrl || envUrl.includes("localhost")) {
    return "https://pro.specuverse.xyz";
  }
  try {
    const parsedUrl = new URL(envUrl);
    if (parsedUrl.protocol !== "https:") {
      return "https://pro.specuverse.xyz";
    }
    return parsedUrl.toString().replace(/\/$/, ""); // Remove trailing slash
  } catch (error) {
    return "https://pro.specuverse.xyz";
  }
})();

export const APP_NAME = process.env.NEXT_PUBLIC_FRAME_NAME || "promint";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_FRAME_DESCRIPTION || "PRO NFT Marketplace";
export const APP_PRIMARY_CATEGORY = process.env.NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY || "social";
export const APP_TAGS = process.env.NEXT_PUBLIC_FRAME_TAGS?.split(",") || ["social", "nft"];
export const APP_ICON_URL = `${APP_URL}/icon.png`;
export const APP_OG_IMAGE_URL = `${APP_URL}/api/opengraph-image`;
export const APP_SPLASH_URL = `${APP_URL}/splash.png`;
export const APP_SPLASH_BACKGROUND_COLOR = "#f7f7f7";
export const APP_BUTTON_TEXT = process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT || "Enter";
export const APP_WEBHOOK_URL = process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID
  ? `https://api.neynar.com/f/app/${process.env.NEYNAR_CLIENT_ID}/event`
  : `${APP_URL}/api/webhook`;