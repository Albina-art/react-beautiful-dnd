// @flow
import React, { PureComponent } from 'react';
import type {
  Placeholder as PlaceholderType,
  MountAnimationMode,
} from '../../types';
import type { PlaceholderStyle } from './placeholder-types';

type Props = {|
  placeholder: PlaceholderType,
  animate: MountAnimationMode,
  onClose: () => void,
  innerRef?: () => ?HTMLElement,
|};

export default class Placeholder extends PureComponent<Props> {
  onTransitionEnd = () => {
    if (this.props.animate === 'close') {
      this.props.onClose();
    }
  };

  render() {
    const placeholder: PlaceholderType = this.props.placeholder;
    const animate: MountAnimationMode = this.props.animate;
    console.log('rendering placeholder. animate:', animate);
    const { client, display, tagName } = placeholder;

    // The goal of the placeholder is to take up the same amount of space
    // as the original draggable
    const style: PlaceholderStyle = {
      display,
      // ## Recreating the box model
      // We created the borderBox and then apply the margins directly
      // this is to maintain any margin collapsing behaviour

      // creating borderBox
      boxSizing: 'border-box',
      width: client.borderBox.width,
      height: client.borderBox.height,
      // creating marginBox
      marginTop: client.margin.top,
      marginRight: client.margin.right,
      marginBottom: client.margin.bottom,
      marginLeft: client.margin.left,

      // ## Avoiding collapsing
      // Avoiding the collapsing or growing of this element when pushed by flex child siblings.
      // We have already taken a snapshot the current dimensions we do not want this element
      // to recalculate its dimensions
      // It is okay for these properties to be applied on elements that are not flex children
      flexShrink: '0',
      flexGrow: '0',
      // Just a little performance optimisation: avoiding the browser needing
      // to worry about pointer events for this element
      pointerEvents: 'none',

      animation: 'none',
      // animation: getAnimation(animate),
    };

    return React.createElement(tagName, { style, ref: this.props.innerRef });
  }
}
