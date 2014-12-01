import IColorPalette = require('./IColorPalette');

interface IColorManager {
    addColor(color: IColorPalette): void;
    getPreviewColor(): IColorPalette;
    nextColor(): IColorPalette;
}

export = IColorManager;
