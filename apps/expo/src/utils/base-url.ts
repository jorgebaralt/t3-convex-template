import Constants from "expo-constants";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  /**
   * In development, always use localhost:3000 since the Next.js app
   * will always be running there.
   *
   * **NOTE**: In production, you'll want to set the baseUrl to your production API URL.
   */
  const debuggerHost = Constants.expoConfig?.hostUri; // this is the localhost for mobile (192.168.86.243)
  
  // Always use localhost:3000 in development
  if (debuggerHost) {
    return "http://localhost:3000";
  }
  
  // TODO: For production, you should set this to your production API URL
  // return "https://your-production-url.com";
  throw new Error(
    "Failed to get localhost. Please point to your production server.",
  );
};
