import { useEnvironment } from "@droplink/keycloak-ui-shared";
import {
  Badge,
  Button,
  Label,
  Icon,
  Modal,
  ModalVariant,
  Content,
  ModalBody,
  ModalFooter,
} from "@patternfly/react-core";
import { UserCheckIcon } from "@patternfly/react-icons";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchPermission, updateRequest } from "../api";
import { Permission, Resource } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";

type PermissionRequestProps = {
  resource: Resource;
  refresh: () => void;
};

export const PermissionRequest = ({
  resource,
  refresh,
}: PermissionRequestProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const approveDeny = async (
    shareRequest: Permission,
    approve: boolean = false
  ) => {
    try {
      const permissions = await fetchPermission({ context }, resource._id);
      const { scopes, username } = permissions.find(
        (p) => p.username === shareRequest.username
      ) || { scopes: [], username: shareRequest.username };

      await updateRequest(
        context,
        resource._id,
        username,
        approve
          ? [...(scopes as string[]), ...(shareRequest.scopes as string[])]
          : scopes
      );
      addAlert(t("shareSuccess"));
      toggle();
      refresh();
    } catch (error) {
      addError("shareError", error);
    }
  };

  return (
    <>
      <Button variant="link" onClick={toggle}>
        <Icon size="lg">
          <UserCheckIcon />
        </Icon>
        <Badge>{resource.shareRequests?.length}</Badge>
      </Button>
      <Modal
        title={t("permissionRequest", { name: resource.name })}
        variant={ModalVariant.large}
        isOpen={open}
        onClose={toggle}
      >
        <ModalBody>
          <Table aria-label={t("resources")}>
            <Thead>
              <Tr>
                <Th>{t("requestor")}</Th>
                <Th>{t("permissionRequests")}</Th>
                <Th aria-hidden="true"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {resource.shareRequests?.map((shareRequest) => (
                <Tr key={shareRequest.username}>
                  <Td>
                    {shareRequest.firstName} {shareRequest.lastName}{" "}
                    {shareRequest.lastName ? "" : shareRequest.username}
                    <br />
                    <Content component="small">{shareRequest.email}</Content>
                  </Td>
                  <Td>
                    {shareRequest.scopes.map((scope) => (
                      <Label key={scope.toString()} readOnly>
                        {scope as string}
                      </Label>
                    ))}
                  </Td>
                  <Td>
                    <Button
                      onClick={() => {
                        approveDeny(shareRequest, true);
                      }}
                    >
                      {t("accept")}
                    </Button>
                    <Button
                      onClick={() => {
                        approveDeny(shareRequest);
                      }}
                      className="pf-v5-u-ml-sm"
                      variant="danger"
                    >
                      {t("deny")}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button key="close" variant="link" onClick={toggle}>
            {t("close")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
