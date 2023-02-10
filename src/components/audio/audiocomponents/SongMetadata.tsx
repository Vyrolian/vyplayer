import { ShortcutTags, TagType } from "jsmediatags/types";
import React, { useEffect, useState } from "react";
var jsmediatags = window.jsmediatags;

function SongMetadata() {
  const audioElement = document.getElementById(
    "audio-element"
  ) as HTMLAudioElement;
  const [metadata, setMetadata] = useState<ShortcutTags>();
  useEffect(() => {
    if (audioElement) {
      jsmediatags.read(audioElement, {
        onSuccess: (metadata: TagType) => {
          //   console.log(metadata.tags.artist);
          if (metadata) {
          }

          setMetadata(metadata.tags as ShortcutTags);
        },
        onError: (error: any) => {},
      });
    }
  }, [audioElement]);
  return <div>{metadata && `${metadata.artist} - ${metadata.title}`}</div>;
}
export default SongMetadata;
