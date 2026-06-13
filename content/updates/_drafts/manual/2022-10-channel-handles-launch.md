---
title: "Channel handles replace legacy custom URLs"
date: "2022-10-11"
severity: info
category: policy
summary: "YouTube launched @handle URLs as the primary public-facing channel identifier, alongside the existing UC channel ID and legacy custom URLs. Each channel gets exactly one handle between 3 and 30 characters."
whatThisMeans: "Use the @handle anywhere viewers see (cards, video end screens, social bios, video descriptions) because that is what people share and search. Keep the UC channel ID for any technical use (RSS feeds, YouTube API calls, automation, embeds) because it is permanent while the handle can change."
source:
  name: "YouTube Creators Blog"
  url: "https://blog.youtube/news-and-events/introducing-handles/"
  tier: 1
relatedTools:
  - youtube-channel-id-finder
  - youtube-channel-name-generator
---

YouTube rolled out channel handles on October 11, 2022. Each channel was assigned a unique @handle that appears across YouTube on channel pages, Shorts comments, mentions, and shared channel links. Handles are between 3 and 30 characters and can include letters, numbers, underscores, and hyphens.

Handles do not replace the underlying UC channel ID. The ID remains the permanent, machine-readable identifier used by the YouTube Data API, RSS subscription feeds, embedded players, and external automation. Tools that rely on the channel ID continue to work regardless of whether the creator changes their handle.

Creators can change their handle through YouTube Studio with frequency limits to prevent abuse. Legacy custom URLs (/c/ and /user/) continue to redirect. New tooling and integrations should use the @handle for human-facing references and the UC channel ID for technical references.
