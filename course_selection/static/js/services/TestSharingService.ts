class TestSharingService {
    static $inject = [];
    data: string;

    constructor() {
        this.data = "";
    }

    public update(input: string) {
        this.data = input;
    }
}

export = TestSharingService;
