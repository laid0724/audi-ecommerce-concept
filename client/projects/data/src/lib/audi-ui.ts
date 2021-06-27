// see: https://github.com/audi/audi-ui/issues/11
// see also index.js of the @audi/audi-ui package for underlying logic
// @ts-ignore
import * as aui from '@audi/audi-ui';

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

export function initAllAudiElements() {
  Alert.upgradeElements();
  Audioplayer.upgradeElements();
  Breadcrumb.upgradeElements();
  Checkbox.upgradeElements();
  Dropdown.upgradeElements();
  Flyout.upgradeElements();
  Header.upgradeElements();
  Modal.upgradeElements();
  Nav.upgradeElements();
  Notification.upgradeElements();
  Pagination.upgradeElements();
  Player.upgradeElements();
  Popover.upgradeElements();
  Progress.upgradeElements();
  Radio.upgradeElements();
  Response.upgradeElements();
  Select.upgradeElements();
  Slider.upgradeElements();
  Indicator.upgradeElements();
  Spinner.upgradeElements();
  Textfield.upgradeElements();
  Tooltip.upgradeElements();
}
