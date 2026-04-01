const generateLinkKey = linkObject => linkObject.key || `${ linkObject.text }${ linkObject.link }`;

const removeDuplicateLinks = linkArray => linkArray.reduce((accu, patternLink, patternIndex) => {
  const patternKey = generateLinkKey(patternLink);
  const hasDupe = accu.some((thisLink, thisIndex) => generateLinkKey(thisLink) === patternKey && thisIndex !== patternIndex);
  return hasDupe
    ? [ ...accu ]
    : [ ...accu, patternLink ];
}, []);

const removeLink = (linkArray, linkObject) => {
  const targetKey = generateLinkKey(linkObject);
  return linkArray.filter(link => generateLinkKey(link) !== targetKey);
};

const addLink = (linkArray, linkObject, desiredIndex) => {
  const cleanedArray = removeLink(linkArray, linkObject);
  const calculatedIndex = desiredIndex || linkArray.length;
  cleanedArray.splice(calculatedIndex, 0, linkObject);
  return cleanedArray;
};


const exports = {
  generateLinkKey,
  removeDuplicateLinks,
  removeLink,
  addLink,
};
export default exports;