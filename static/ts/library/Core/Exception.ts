/*
 interface Error {
 name: string;
 message: string;
 }
 */
class Exception implements Error
{
    name: string;
    message: string;

    constructor(message: string)
    {
        this.name = 'Exception';
        this.message = message;
    }

    toString()
    {
        return this.name + ': ' + this.message;
    }
}

export = Exception;
