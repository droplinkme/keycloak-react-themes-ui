import {
  getInjectedEnvironment,
  type BaseEnvironment,
} from "@droplink/keycloak-ui-shared";
import { EnvVar } from "./utils/env/EnvVar";

export type Environment = BaseEnvironment & {
  /** The URL to the root of the account console. */
  baseUrl: string;
  /** The locale of the user */
  locale: string;
  /** Name of the referrer application in the back link */
  referrerName?: string;
  /** UR to the referrer application in the back link */
  referrerUrl?: string;
  /** Feature flags */
  features: Feature;
};

export type Feature = {
  isRegistrationEmailAsUsername: boolean;
  isEditUserNameAllowed: boolean;
  isLinkedAccountsEnabled: boolean;
  isMyResourcesEnabled: boolean;
  deleteAccountAllowed: boolean;
  updateEmailFeatureEnabled: boolean;
  updateEmailActionEnabled: boolean;
  isViewGroupsEnabled: boolean;
  isViewOrganizationsEnabled: boolean;
  isOid4VciEnabled: boolean;
};

const envVar = new EnvVar();

export const environment = ((): Environment => {
  const env = getInjectedEnvironment<Environment | undefined>({ no_error: true });

  if (env) return env

  return {
    baseUrl: envVar.parse('VITE_BASE_URL').isRequired().asString(),
    serverBaseUrl: envVar.parse('VITE_KEYCLOAK_BASE_URL').isRequired().asString(),
    realm: envVar.parse('VITE_KEYCLOAK_REALM').isRequired().asString(),
    clientId: envVar.parse('VITE_KEYCLOAK_CLIENT_ID').isRequired().asString(),
    resourceUrl: envVar.parse('VITE_RESOURCE_URL').isRequired().asString(),
    locale: 'br',
    logo: 'logo.svg',
    logoUrl: 'logo.svg',
    features: {
      isRegistrationEmailAsUsername: envVar.parse('VITE_IS_REGISTRATION_EMAIL_AS_USERNAME').asBoolean(),
      isEditUserNameAllowed: envVar.parse('VITE_IS_EDIT_USERNAME_ALLOWED').asBoolean(),
      isLinkedAccountsEnabled: envVar.parse('VITE_IS_LINKED_ACCOUNTS_ENABLED').asBoolean(),
      isMyResourcesEnabled: envVar.parse('VITE_IS_MY_RESOURCES_ENABLED').asBoolean(),
      deleteAccountAllowed: envVar.parse('VITE_IS_DELETE_ACCOUNT_ALLOWED').asBoolean(),
      updateEmailFeatureEnabled: envVar.parse('VITE_UPDATE_EMAIL_FEATURE_ENABLED').asBoolean(),
      updateEmailActionEnabled: envVar.parse('VITE_UPDATE_EMAIL_ACTION_ENABLED').asBoolean(),
      isViewGroupsEnabled: envVar.parse('VITE_IS_VIEW_GROUP_ENABLED').asBoolean(),
      isOid4VciEnabled: envVar.parse('VITE_IS_OID4_VCI_ENABLED').asBoolean(),
      isViewOrganizationsEnabled: envVar.parse('VITE_IS_VIEW_ORGANIZATIONS_ENABLED').asBoolean()
    }
  }
})();
