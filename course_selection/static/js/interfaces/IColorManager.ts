import IColorPalette = require('./IColorPalette');

interface IColorManager {
    toPreviewColor(color: string): string;
    addColor(color: IColorPalette): void;
    getPreviewColor(): IColorPalette;
    nextColor(): IColorPalette;
}

export = IColorManager;
