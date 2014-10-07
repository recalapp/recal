import InvalidArgumentException = require('../Core/InvalidArgumentException');

class Color
{
    private _red: number = 0;
    public get red(): number { return this._red; }

    private _green: number = 0;
    public get green(): number { return this._green; }

    private _blue: number = 0;
    public get blue(): number { return this._blue; }

    public get hexValue(): string
    {
        return '#' + HexUtilities.numberToHex(this.red)
                   + HexUtilities.numberToHex(this.green)
                   + HexUtilities.numberToHex(this.blue);
    }

    public static fromHex(hexString: string): Color
    {
        if (hexString === null || hexString === undefined)
        {
            throw new InvalidArgumentException("HexString cannot be null.");
        }
        if (hexString.indexOf('#') === 0)
        {
            hexString = hexString.substr(1);
        }
        if (hexString.length === 3)
        {
            hexString = hexString[0] + hexString[0] + hexString[1] + hexString[1] + hexString[2] + hexString[2];
        }
        else if (hexString.length !== 6)
        {
            throw new InvalidArgumentException("HexString is of wrong format.");
        }
        if (!hexString.match(/[0-9a-fA-F]/))
        {
            throw new InvalidArgumentException("HexString is of wrong format.");
        }
        var color = new Color();
        color._red = HexUtilities.hexToNumber(hexString.substr(0, 2));
        color._green = HexUtilities.hexToNumber(hexString.substr(2, 4));
        color._blue = HexUtilities.hexToNumber(hexString.substr(4, 6));
        return color;
    }

    public static fromRGB(red: number, green: number, blue: number)
    {
        if (!HexUtilities.validateHexNumber(red) ||
            !HexUtilities.validateHexNumber(blue) ||
            !HexUtilities.validateHexNumber(green))
        {
            throw new InvalidArgumentException("RGB must be between 0 and 255");
        }
        var color = new Color();
        color._red = red;
        color._blue = blue;
        color._green = green;
        return color;
    }
}

class HexUtilities
{
    static validateHexNumber(hex: number): boolean
    {
        return hex >= 0 && hex <= 255;
    }

    static numberToHex(value: number): string
    {
        return value.toString(16);
    }

    static hexToNumber(hex: string): number
    {
        return parseInt(hex, 16);
    }
}

export = Color;