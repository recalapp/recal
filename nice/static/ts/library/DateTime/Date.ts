interface Date
{
    month: number;
    date: number;
    day: number;
    format(format?: string): string;
}

export = Date;