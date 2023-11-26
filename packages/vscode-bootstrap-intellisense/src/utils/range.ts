import { Position, Range, type TextDocument } from "vscode";

const CLASS_NAME_REGEX = /class(?:Name)=['"][-\w\d\s]*[^"']/g;

export const getCurrentClassNameRange = (document: TextDocument, position: Position) => {
  // fine current line from start to cursor
  const line = document.getText(
    new Range(new Position(position.line, 0), new Position(position.line, position.character)),
  );

  // check if the line contains a class name
  const classNameProps = line.match(CLASS_NAME_REGEX);

  if (!classNameProps || classNameProps.length === 0) {
    return;
  }

  const classNameProp = classNameProps[classNameProps.length - 1];
  const lastClass = classNameProp.split(" ").pop();

  if (line[line.length - 1] === " " || !lastClass) {
    // if the last character is a space, then we are at the end of the class name
    // and we should show the completion
    return new Range(new Position(position.line, position.character), new Position(position.line, position.character));
  }

  // get current class name index
  const classNameIndex = line.lastIndexOf(lastClass);

  // get current class name range
  const classNameRange = new Range(
    new Position(position.line, classNameIndex),
    new Position(position.line, position.character),
  );

  return classNameRange;
};
