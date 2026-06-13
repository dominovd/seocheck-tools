---
title: "YouTube Data API added batch video stats method"
date: "2026-06-03"
severity: minor
category: api
summary: "YouTube added the videos.batchGetStats method to the Data API to retrieve lists of video statistics. The method costs 1 quota unit in its own granular quota bucket with a default daily quota of 10,000 units."
whatThisMeans: "For channels with automation that calls Data API video-statistics endpoints, the new batchGetStats method consolidates lookups into a single batched request. Code that issues multiple videos.list calls can switch to reduce quota usage. Channels without Data API automation are not affected."
source:
  name: "YouTube API Release Notes"
  url: "https://developers.google.com/youtube/v3/revision_history"
  tier: 1
relatedTools:
  - youtube-channel-audit
  - youtube-video-audit
  - youtube-visibility-score
---

The YouTube Data API now supports a new method, videos.batchGetStats, that retrieves a list of video statistics matching the request parameters.

Calls to videos.batchGetStats cost 1 quota unit and use their own granular quota bucket.

The default quota for videos.batchGetStats is 10,000 units per day.
