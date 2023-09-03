export const customStyleInjector = (packageName) => (varname, id) => {
  const idSplit = id.split("/");
  const srcIndex = idSplit.indexOf("src");
  const resolvedId = JSON.stringify([packageName, ...idSplit.slice(srcIndex + 1)].join("/"));

  if (process.env.NODE_ENV === "development") {
    return `const $prevStyle = document.getElementById(${resolvedId});
          
    if (!$prevStyle) {
      const $style = document.createElement("style");
      $style.id = ${resolvedId};
      $style.type = "text/css";
      $style.innerHTML = ${varname};
      document.head.appendChild($style);
    } else if ($prevStyle.innerHTML !== ${varname}) {
      $prevStyle.innerHTML = ${varname};
    }`;
  } else {
    return `const $style = document.createElement("style");
    $style.id = ${resolvedId};
    $style.type = "text/css";
    $style.innerHTML = ${varname};
    document.head.appendChild($style);`;
  }
};
