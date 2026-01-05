export const queryKeys = {
  /**
   * Top 100 podcasts list (home page).
   */
  topPodcasts: ['topPodcasts'] as const,
  /**
   * Podcast detail (episodes + metadata) keyed by `podcastId`.
   */
  podcastDetail: (podcastId: string) => ['podcastDetail', podcastId] as const,
  /**
   * Episode detail keyed by `podcastId` + `episodeId`.
   *
   * Note: in practice this can be derived from the cached `podcastDetail` query.
   */
  episodeDetail: (podcastId: string, episodeId: string) =>
    ['episodeDetail', podcastId, episodeId] as const
}
