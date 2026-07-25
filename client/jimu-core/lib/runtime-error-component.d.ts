import type { IntlShape } from 'react-intl';
import { type RuntimeErrors } from './types/state';
export interface RuntimeErrorComponentProps {
    runtimeErrors: RuntimeErrors;
    intl: IntlShape;
}
export declare function RuntimeErrorComponent(props: RuntimeErrorComponentProps): import("@emotion/react/jsx-runtime").JSX.Element;
