import {
  MenuToggleElement,
  Avatar as PfAvatar,
  AvatarProps as PfAvatarProps,
} from "@patternfly/react-core";
import { PencilAltIcon } from "@patternfly/react-icons";
import React, { forwardRef, useRef } from "react";
import { DefaultAvatar } from "./DefaultAvatar";
import "./Avatar.css";

export interface AvatarProps extends PfAvatarProps {
  uploadAvatar?: (file: File) => void;
  showEditIcon?: boolean; // Adicionado para controlar se o ícone de edição aparece
}

export const Avatar = forwardRef<
  HTMLDivElement | MenuToggleElement,
  AvatarProps
>(({ uploadAvatar, showEditIcon = true, src, ...rest }, ref) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadAvatar) {
      uploadAvatar(file);
    }
  };

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="avatar-container">
      <div className="avatar-wrapper">
        {src ? <PfAvatar src={src} {...rest} /> : <DefaultAvatar />}
        {uploadAvatar && (
          <input
            type="file"
            ref={fileInputRef}
            className="avatar-input"
            onChange={handleFileChange}
            accept="image/*"
          />
        )}
      </div>
    </div>
  );
});
