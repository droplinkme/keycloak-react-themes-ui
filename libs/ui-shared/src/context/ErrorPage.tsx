import {
  Button,
  Modal,
  ModalVariant,
  Page,
  Content,
  TextArea,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { getNetworkErrorDescription } from "../utils/errors";
import React from "react";

type ErrorPageProps = {
  error?: unknown;
};

export const ErrorPage = (props: ErrorPageProps) => {
  const { t } = useTranslation();
  const error = props.error;
  const errorMessage =
    getErrorMessage(error) ||
    getNetworkErrorDescription(error)?.replace(/\+/g, " ");
  console.error(error);

  function onRetry() {
    location.href = location.origin + location.pathname;
  }

  return (
    <Page>
      <Modal
        variant={ModalVariant.small}
        aria-describedby="modal-title-icon-description"
        aria-labelledby="title-icon-modal-title"
        isOpen
      >
        <ModalHeader
          title={errorMessage ? "" : t("somethingWentWrong")}
          titleIconVariant="danger"
        />
        <ModalBody>
          <TextArea>
            {errorMessage ? (
              <Content>{t(errorMessage)}</Content>
            ) : (
              <Content>{t("somethingWentWrongDescription")}</Content>
            )}
          </TextArea>
        </ModalBody>
        <ModalFooter>
          <Button key="tryAgain" variant="primary" onClick={onRetry}>
            {t("tryAgain")}
          </Button>
        </ModalFooter>
      </Modal>
    </Page>
  );
};

function getErrorMessage(error: unknown): string | null {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return null;
}
