import { useAlerts } from "@droplink/keycloak-ui-shared";
import { AlertVariant } from "@patternfly/react-core";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ApiException } from "../api/exceptions";

export function useAccountAlerts() {
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const addAccountError = useCallback(
    (messageKey: string, error: unknown) => {
      if (!(error instanceof ApiException)) {
        addError(messageKey, error);
        return;
      }

      const message = t(messageKey, { error: error.message });
      addAlert(message, AlertVariant.danger, error.description);
    },
    [addAlert, addError, t],
  );

  return useMemo(
    () => ({ addAlert, addError: addAccountError }),
    [addAccountError, addAlert],
  );
}
