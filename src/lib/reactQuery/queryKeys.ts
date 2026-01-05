export const queryKeys = {
  /**
   * Top 100 podcasts list (home page).
   *
   * @returns Query key tuple for top podcasts.
   */
  topPodcasts: ['topPodcasts'] as const,
  /**
   * Podcast detail (episodes + metadata) keyed by `podcastId`.
   *
   * @param podcastId - Podcast identifier.
   * @returns Query key tuple for podcast detail.
   */
  podcastDetail: (podcastId: string) => ['podcastDetail', podcastId] as const,
  /**
   * Episode detail keyed by `podcastId` + `episodeId`.
   *
   * Note: in practice this can be derived from the cached `podcastDetail` query.
   *
   * @param podcastId - Podcast identifier.
   * @param episodeId - Episode identifier.
   * @returns Query key tuple for episode detail.
   */
  episodeDetail: (podcastId: string, episodeId: string) =>
    ['episodeDetail', podcastId, episodeId] as const
}
