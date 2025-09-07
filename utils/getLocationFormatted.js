const getLocationFromErrorStack = (errorStack) => {
    if (!errorStack) return { file: "unknown", line: "unknown", character: "unknown" };

    const locationBlocks = errorStack.split("\n")[1].split("\\");
    const locationFileLineCharacter = locationBlocks[locationBlocks.length - 1].split(")")[0];
    const locationFile = locationFileLineCharacter.split(":")[0];
    const locationLine = locationFileLineCharacter.split(":")[1];
    const locationCharacter = locationFileLineCharacter.split(":")[2];
    const location = {
        file: locationFile,
        line: locationLine,
        character: locationCharacter,
    };
    return location;
};

module.exports = getLocationFromErrorStack;
