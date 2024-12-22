import { KeycloakProvider } from "@droplink/keycloak-ui-shared";
import { Page, Spinner } from "@patternfly/react-core";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { environment } from "../environment";
import { Header } from "./Header";
import { PageNav } from "./PageNav";

export const Root = () => {
  return (
    <KeycloakProvider environment={environment}>
      <Page masthead={<Header />} sidebar={<PageNav />} isManagedSidebar>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Page>
    </KeycloakProvider>
  );
};
