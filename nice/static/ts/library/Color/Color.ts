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
}

class HexUtilities
{
    private static _numToHex = {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: 'A',
        11: 'B',
        12: 'C',
        13: 'D',
        14: 'E',
        15: 'F'
    };

    private static _hexToNum = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'A': 10,
        'B': 11,
        'C': 12,
        'D': 13,
        'E': 14,
        'F': 15
    };

    static validateHexNumber(hex: number): boolean
    {
        return hex >= 0 && hex <= 255;
    }

    static numberToHex(value: number): string
    {
        var createHexDigit = (value: number)=>
        {
            if (value === 0)
            {
                return '';
            }
            var hex = value % 16;
            var hexString = HexUtilities._numToHex[hex];
            return createHexDigit(value / 16) + hexString;
        };
        return createHexDigit(value);
    }

    static hexToNumber(hex: string): number
    {
        var createNumberDigit = (hex: string)=>
        {
            var lastChar = hex.charAt(hex.length - 1);
            var value = parseInt(HexUtilities._hexToNum[lastChar.toUpperCase()]);
            return createNumberDigit(hex.substring(0, hex.length - 1)) * 16 + value;
        };
        return createNumberDigit(hex);
    }
}

export = Color;