import {Object, Shadow} from 'fabric/fabric-impl';
import {isText} from '../utils/is-text';
import {EditableObjProps} from './editable-obj-props';
import {TextAlign} from './text-align';

export function fabricObjToState(obj: Object): EditableObjProps {
  if (!obj) return {};

  const props: EditableObjProps = {
    fill: obj.fill,
    opacity: obj.opacity,
    backgroundColor: obj.backgroundColor,
    stroke: obj.stroke,
    strokeWidth: obj.strokeWidth,
  };

  const shadow = obj.shadow as Shadow | null;
  if (shadow) {
    props.shadow = {
      color: shadow.color,
      blur: shadow.blur,
      offsetX: shadow.offsetX,
      offsetY: shadow.offsetY,
    };
  }

  if (isText(obj)) {
    props.textAlign = obj.textAlign as TextAlign;
    props.underline = obj.underline;
    props.linethrough = obj.linethrough;
    props.fontStyle = obj.fontStyle;
    props.fontFamily = obj.fontFamily;
    props.fontWeight = obj.fontWeight;
    props.fontSize = obj.fontSize;
  }

  return props;
}
