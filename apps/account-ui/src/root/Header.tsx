import {
  KeycloakMasthead,
  label,
  useEnvironment,
} from "@droplink/keycloak-ui-shared";
import { Button } from "@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";

import { environment } from "../environment";
import { joinPath } from "../utils/joinPath";

import style from "./header.module.css";
import { useState } from "react";
import { usePromise } from "../utils/usePromise";
import { getAvatar, uploadAccountUserAvatar } from "../api/methods";
import { eventBus } from "../utils/eventBus";

const ReferrerLink = () => {
  const { t } = useTranslation();

  return environment.referrerUrl ? (
    <Button
      data-testid="referrer-link"
      component="a"
      href={environment.referrerUrl.replace("_hash_", "#")}
      variant="link"
      icon={<ExternalLinkSquareAltIcon />}
      iconPosition="right"
      isInline
    >
      {t("backTo", {
        app: label(t, environment.referrerName, environment.referrerUrl),
      })}
    </Button>
  ) : null;
};

export const Header = () => {
  const { environment, keycloak } = useEnvironment();
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<string | undefined>();
  const [_, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  usePromise(
    async (signal) => {
      const responses = await Promise.allSettled([
        getAvatar({ signal, context: { environment, keycloak } }),
      ]);

      return responses.map((response) => {
        if (response.status === "rejected") return;

        return response.value;
      });
    },
    async ([avatar]) => {
      setAvatar(avatar ? URL.createObjectURL(avatar) : undefined);
    }
  );

  const uploadAvatar = async (file: File) => {
    try {
      setIsLoading(true);
      setAvatarFile(file);
      const newAvatarUrl = URL.createObjectURL(file);

      await uploadAccountUserAvatar({ environment, keycloak }, file);
      setAvatar(newAvatarUrl);
      eventBus.emitEvent<{ newAvatar: string }>("avatarUpdated", {
        newAvatar: newAvatarUrl,
      });

      setAvatarFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const brandImage = environment.logo || "logo.svg";
  const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
  const internalLogoHref = useHref(logoUrl);

  // User can indicate that he wants an internal URL by starting it with "/"
  const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl;

  return (
    <KeycloakMasthead
      data-testid="page-header"
      keycloak={keycloak}
      features={{ hasManageAccount: false }}
      avatar={{
        alt: t("avatar"),
        src: avatar,
        uploadAvatar: isLoading ? undefined : uploadAvatar,
      }}
      brand={{
        href: indexHref,
        src: joinPath(environment.resourceUrl, brandImage),
        alt: t("logo"),
        className: style.brand,
      }}
      toolbarItems={[<ReferrerLink key="link" />]}
    />
  );
};
