// see: https://github.com/audi/audi-ui/issues/11
// see also index.js of the @audi/audi-ui package for underlying logic
// @ts-ignore
import * as aui from '@audi/audi-ui';

export enum AudiModuleName {
  Alert = 'Alert', // done
  Audioplayer = 'Audioplayer', // ignore
  Breadcrumb = 'Breadcrumb',
  Checkbox = 'Checkbox', // done
  Dropdown = 'Dropdown', // done
  Flyout = 'Flyout',
  Header = 'Header',
  Modal = 'Modal', // done
  Nav = 'Nav',
  Notification = 'Notification', // done
  Pagination = 'Pagination', // done
  Player = 'Player', // ignore
  Popover = 'Popover', // done
  Progress = 'Progress', // done
  Radio = 'Radio', // done
  Response = 'Response', // UI animation effects, such as btn // done
  Select = 'Select', // done
  Slider = 'Slider',
  Indicator = 'Indicator', // done
  Spinner = 'Spinner', // done
  Textfield = 'Textfield', // done
  Tooltip = 'Tooltip', // done
}

export type AudiModule = {
  name: AudiModuleName;
  module: any; // no type files are written for audi ui..gotta read their source code on your own to figure it out buddy!
};

export type AudiComponents = {
  moduleName: AudiModuleName;
  components: any | any[];
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
): AudiComponents[] {
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

  // const initializedModules: AudiComponents[] = [
  //   ...uninitializedModules.map((m: AudiModule) => ({
  //     moduleName: m.name,
  //     components: m.module.upgradeElements(),
  //   })),
  // ];

  // return uninitializedModules;

  const components: AudiComponents[] = [
    ...uninitializedModules.map((m: AudiModule) => ({
      moduleName: m.name,
      components: m.module,
    })),
  ];

  return components;
}
