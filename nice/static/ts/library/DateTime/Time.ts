interface Time
{
    hours: number;
    minutes: number;
    seconds: number;
    format(format?: string): string;
}
export = Time;