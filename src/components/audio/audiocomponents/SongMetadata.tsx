import { ShortcutTags, TagType } from "jsmediatags/types";
import React, { useEffect, useState } from "react";
var jsmediatags = window.jsmediatags;
type SongMetadata = {
  file: File | null;
};
function SongMetadata({ file }: SongMetadata) {
  const [metadata, setMetadata] = useState<ShortcutTags>();
  useEffect(() => {
    if (file) {
      jsmediatags.read(file, {
        onSuccess: (metadata: TagType) => {
          //   console.log(metadata.tags.artist);
          if (metadata) {
          }

          setMetadata(metadata.tags as ShortcutTags);
        },
        onError: (error: any) => {},
      });
    }
  }, [file]);
  return <div>{metadata && `${metadata.artist} - ${metadata.title}`}</div>;
}
export default SongMetadata;
