export const PLATFORM_META = {
  instagram: { label: 'Instagram', limit: 2200 },
  facebook: { label: 'Facebook', limit: 63206 },
  x: { label: 'X', limit: 280 },
};

export function getPlatformMeta(platform) {
  if (!platform) {
    return { label: 'Unknown', limit: 280 };
  }
  return PLATFORM_META[platform] || { label: platform, limit: 280 };
}
