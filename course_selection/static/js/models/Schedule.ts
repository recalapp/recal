class Schedule {
    id: number;

    static compare(a: Schedule, b: Schedule) {
        return a.id - b.id;
    }
}

export = Schedule;
