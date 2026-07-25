import { React } from 'jimu-core';
import 'arcgis-portal-components';
export type ClassificationValues = HTMLArcgisPortalClassificationConfigElement['values'];
export type ClassificationStatus = HTMLArcgisPortalClassificationConfigElement['status'];
export interface ConfigProps {
    className?: string;
    portalItemId: string;
    values?: ClassificationValues;
    onChange: (valid: boolean, values: ClassificationValues) => void;
}
export declare const ClassificationConfig: React.ForwardRefExoticComponent<ConfigProps & React.RefAttributes<import("@arcgis/portal-components/dist/components/arcgis-portal-classification-config/customElement").ArcgisPortalClassificationConfig>>;
export declare const ClassificationConfigModalContent: React.ForwardRefExoticComponent<ConfigProps & {
    className?: string;
    showHeader?: boolean;
} & React.RefAttributes<import("@arcgis/portal-components/dist/components/arcgis-portal-classification-config/customElement").ArcgisPortalClassificationConfig>>;
