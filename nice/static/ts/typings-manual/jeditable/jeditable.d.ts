interface JQuery {
    editable(url?: string): JQuery;
    editable(url: string, options: any): JQuery;
    editable(handler: (value?: string, settings?: any) => string, options: any): JQuery;
}
