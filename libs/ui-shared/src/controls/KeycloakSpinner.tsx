import { Bullseye, Spinner } from "@patternfly/react-core";
import React from "react";
import { useTranslation } from "react-i18next";

export const KeycloakSpinner = () => {
  const { t } = useTranslation();

  return (
    <Bullseye>
      <Spinner aria-label={t("spinnerLoading")} />
    </Bullseye>
  );
};
