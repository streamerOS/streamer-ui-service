# MusicKitJS v3 Notes

## Links

- [Apple Music v3 API](https://js-cdn.music.apple.com/musickit/v3/docs/?path=/story/introduction--page)
- [Apple Music WebService API](https://developer.apple.com/documentation/applemusicapi/)

## General Notes

The Cloud Library API is accessible through Apple Music Web Service API methods that start with `v1/me/library`.

Example:

```javascript
const music = MusicKit.getInstance();
// You should check authorization before accessing user's iCloud Music Library:
await music.authorize();
const result = await music.api.music('v1/me/library/albums');
```

## QueryParameters

| Parameter | Type     | Remarks                                                                                                                                                                                                                                  |
|-----------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| include   | [string] | Additional relationships to include in the fetch.                                                                                                                                                                                        |
| l         | string   | The localization to use, specified by a language tag. The possible values are in the supportedLanguageTags array belonging to the Storefront object specified by storefront. Otherwise, the default is defaultLanguageTag in Storefront. |
| limit     | integer  | The number of objects or number of objects in the specified relationship returned.                                                                                                                                                       |
| offset    | string   | The next page or group of objects to fetch.                                                                                                                                                                                              |
| extend    | [string] | A list of attribute extensions to apply to resources in the response.                                                                                                                                                                    |

## Playback States

| State                             | Numeric Value |
|-----------------------------------|---------------|
| MusikKit.PlaybackStates.completed | 10            |
| MusikKit.PlaybackStates.ended     | 5             |
| MusikKit.PlaybackStates.loading   | 1             |
| MusikKit.PlaybackStates.none      | 0             |
| MusikKit.PlaybackStates.paused    | 3             |
| MusikKit.PlaybackStates.playing   | 2             |
| MusikKit.PlaybackStates.seeking   | 6             |
| MusikKit.PlaybackStates.stalled   | 9             |
| MusikKit.PlaybackStates.stopped   | 4             |
| MusikKit.PlaybackStates.waiting   | 8             |
