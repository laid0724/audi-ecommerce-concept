// see: https://github.com/audi/audi-ui/issues/11
// see also index.js of the @audi/audi-ui package for underlying logic
// @ts-ignore
import * as aui from '@audi/audi-ui';

export enum AudiModuleName {
  Alert = 'Alert',
  Audioplayer = 'Audioplayer',
  Breadcrumb = 'Breadcrumb',
  Checkbox = 'Checkbox',
  Dropdown = 'Dropdown',
  Flyout = 'Flyout',
  Header = 'Header',
  Modal = 'Modal',
  Nav = 'Nav',
  Notification = 'Notificaiton',
  Pagination = 'Pagination',
  Player = 'Player',
  Popover = 'Popover',
  Progress = 'Progress',
  Radio = 'Radio',
  Response = 'Response', // UI animation effects, such as btn
  Select = 'Select',
  Slider = 'Slider',
  Indicator = 'Indicator',
  Spinner = 'Spinner',
  Textfield = 'Textfield',
  Tooltip = 'Tooltip',
}

export type AudiModule = {
  name: AudiModuleName;
  module: any; // no type files are written for audi ui..gotta read their source code on your own to figure it out buddy!
};

export type InitializedAudiComponents = {
  moduleName: AudiModuleName;
  components: any[];
};

const {
  Alert,
  Audioplayer,
  Breadcrumb,
  Checkbox,
  Dropdown,
  Flyout,
  Header,
  Modal,
  Nav,
  Notification,
  Pagination,
  Player,
  Popover,
  Progress,
  Radio,
  Response,
  Select,
  Slider,
  Indicator,
  Spinner,
  Textfield,
  Tooltip,
} = aui;

export function initAudiModules(
  ...modulesToInit: AudiModuleName[]
): InitializedAudiComponents[] {
  if (
    'classList' in document.createElement('div') &&
    'querySelector' in document &&
    'addEventListener' in window &&
    Array.prototype.forEach
  ) {
    document.documentElement.classList.add('aui-js');
  }

  const auiModules = {
    Alert,
    Audioplayer,
    Breadcrumb,
    Checkbox,
    Dropdown,
    Flyout,
    Header,
    Modal,
    Nav,
    Notification,
    Pagination,
    Player,
    Popover,
    Progress,
    Radio,
    Response,
    Select,
    Slider,
    Indicator,
    Spinner,
    Textfield,
    Tooltip,
  };

  let uninitializedModules: AudiModule[] = Object.keys(auiModules).map(
    (key: string) => {
      const module = (auiModules as any)[key];
      return {
        name: key as AudiModuleName,
        module,
      };
    }
  );

  if (
    modulesToInit &&
    Array.isArray(modulesToInit) &&
    modulesToInit.length > 0
  ) {
    uninitializedModules = [
      ...uninitializedModules.filter((m) => modulesToInit.includes(m.name)),
    ];
  }

  const initializedModules: InitializedAudiComponents[] = [
    ...uninitializedModules.map((m: AudiModule) => ({
      moduleName: m.name,
      components: m.module.upgradeElements(),
    })),
  ];

  return initializedModules;
}
